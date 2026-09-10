from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import random

from app.database import get_db
from app.models import Incident, IncidentTimeline, Resource, ResourceAssignment, User, IncidentStatusEnum
from app.schemas import IncidentCreate, IncidentUpdate, IncidentOut, ResourceAssignRequest
from app.auth.dependencies import get_current_user, require_role
from app.rules.severity_rules import calculate_incident_severity
from app.rules.priority_rules import calculate_priority_score
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/incidents", tags=["Incidents"])

def _recompute_incident_scores(incident: Incident, db: Session):
    # Auto-calculate severity if not manually set
    calculated_sev = calculate_incident_severity(
        incident_type=incident.incident_type,
        water_level_m=incident.water_level_m,
        population_affected=incident.population_affected,
        gas_ppm=incident.gas_ppm,
        casualties=incident.casualties,
        structural_damage=incident.structural_damage
    )
    if not incident.severity:
        incident.severity = calculated_sev

    # Calculate age in minutes
    now = datetime.now(timezone.utc)
    created_at = incident.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    age_mins = (now - created_at).total_seconds() / 60.0

    score, reason = calculate_priority_score(
        severity=incident.severity,
        population_affected=incident.population_affected,
        resource_shortage=False,
        hospital_nearby=True,
        road_blocked=incident.water_level_m >= 3.0 or incident.structural_damage,
        age_minutes=age_mins
    )
    incident.priority_score = score
    incident.priority_reason = reason

@router.get("", response_model=List[IncidentOut])
def get_all_incidents(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    incident_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if status:
        query = query.filter(Incident.status == status.upper())
    if severity:
        query = query.filter(Incident.severity == severity.upper())
    if incident_type:
        query = query.filter(Incident.incident_type.ilike(f"%{incident_type}%"))
    
    incidents = query.order_by(Incident.priority_score.desc()).all()
    
    # Recompute priority scores for live display
    for inc in incidents:
        _recompute_incident_scores(inc, db)
    db.commit()
    
    return incidents

@router.post("", response_model=IncidentOut)
async def create_incident(
    req: IncidentCreate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user)
):
    code = f"INC-{random.randint(1000, 9999)}"
    
    # Determine severity
    sev = req.severity if req.severity else calculate_incident_severity(
        incident_type=req.incident_type,
        water_level_m=req.water_level_m,
        population_affected=req.population_affected,
        gas_ppm=req.gas_ppm,
        casualties=req.casualties,
        structural_damage=req.structural_damage
    )

    incident = Incident(
        incident_code=code,
        title=req.title,
        description=req.description,
        incident_type=req.incident_type,
        severity=sev,
        status=IncidentStatusEnum.ACTIVE.value,
        lat=req.lat,
        lng=req.lng,
        address=req.address,
        population_affected=req.population_affected,
        water_level_m=req.water_level_m,
        gas_ppm=req.gas_ppm,
        casualties=req.casualties,
        structural_damage=req.structural_damage,
        reported_by_user_id=user.id if user else None
    )
    
    _recompute_incident_scores(incident, db)
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Timeline entry
    timeline = IncidentTimeline(
        incident_id=incident.id,
        title="Incident Reported",
        description=f"Incident registered: {incident.title}",
        status_to=incident.status,
        action_by=user.full_name if user else "Authority"
    )
    db.add(timeline)
    db.commit()
    db.refresh(incident)

    log_action(db, action="CREATE_INCIDENT", user_id=user.id if user else None, target_type="Incident", target_id=str(incident.id), details=f"Created {code}")

    # Broadcast WebSocket update
    await manager.broadcast("INCIDENT_CREATED", {
        "id": incident.id,
        "incident_code": incident.incident_code,
        "title": incident.title,
        "severity": incident.severity,
        "priority_score": incident.priority_score,
        "status": incident.status,
        "lat": incident.lat,
        "lng": incident.lng
    })

    return incident

@router.get("/{id}", response_model=IncidentOut)
def get_incident_by_id(id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    _recompute_incident_scores(incident, db)
    db.commit()
    return incident

@router.put("/{id}", response_model=IncidentOut)
async def update_incident(
    id: int,
    req: IncidentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["ADMIN", "AUTHORITY", "RESCUE_TEAM"]))
):
    incident = db.query(Incident).filter(Incident.id == id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    old_status = incident.status
    old_severity = incident.severity

    if req.title is not None: incident.title = req.title
    if req.description is not None: incident.description = req.description
    if req.incident_type is not None: incident.incident_type = req.incident_type
    if req.severity is not None: incident.severity = req.severity
    if req.status is not None: incident.status = req.status
    if req.population_affected is not None: incident.population_affected = req.population_affected
    if req.water_level_m is not None: incident.water_level_m = req.water_level_m
    if req.gas_ppm is not None: incident.gas_ppm = req.gas_ppm
    if req.casualties is not None: incident.casualties = req.casualties
    if req.structural_damage is not None: incident.structural_damage = req.structural_damage

    if incident.status == "RESOLVED" and old_status != "RESOLVED":
        incident.resolved_at = datetime.now(timezone.utc)

    _recompute_incident_scores(incident, db)
    db.commit()

    # Timeline entry if status or severity changed
    if old_status != incident.status or old_severity != incident.severity:
        t = IncidentTimeline(
            incident_id=incident.id,
            title=f"Incident Status: {incident.status}",
            description=f"Status changed from {old_status} to {incident.status}. Severity: {incident.severity}",
            status_from=old_status,
            status_to=incident.status,
            action_by=user.full_name
        )
        db.add(t)
        db.commit()

    db.refresh(incident)
    log_action(db, action="UPDATE_INCIDENT", user_id=user.id, username=user.username, role=user.role, target_type="Incident", target_id=str(incident.id), details=f"Status: {old_status} -> {incident.status}")

    await manager.broadcast("INCIDENT_UPDATED", {
        "id": incident.id,
        "incident_code": incident.incident_code,
        "status": incident.status,
        "severity": incident.severity,
        "priority_score": incident.priority_score
    })

    return incident

@router.post("/{id}/assign-resource")
async def assign_resource_to_incident(
    id: int,
    req: ResourceAssignRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["ADMIN", "AUTHORITY"]))
):
    incident = db.query(Incident).filter(Incident.id == id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    resource = db.query(Resource).filter(Resource.id == req.resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    resource.status = "ASSIGNED"
    resource.current_incident_id = incident.id
    
    if incident.status in ["REPORTED", "VERIFIED", "ACTIVE"]:
        incident.status = "DISPATCHED"

    assignment = ResourceAssignment(
        incident_id=incident.id,
        resource_id=resource.id,
        status="ASSIGNED",
        notes=req.notes
    )
    db.add(assignment)

    timeline = IncidentTimeline(
        incident_id=incident.id,
        title=f"Resource Dispatched: {resource.name}",
        description=f"Assigned {resource.resource_type} '{resource.name}' ({resource.code}) to incident location.",
        status_to=incident.status,
        action_by=user.full_name
    )
    db.add(timeline)
    db.commit()

    log_action(db, action="ASSIGN_RESOURCE", user_id=user.id, username=user.username, role=user.role, target_type="Incident", target_id=str(incident.id), details=f"Assigned {resource.code}")

    await manager.broadcast("RESOURCE_ASSIGNED", {
        "incident_id": incident.id,
        "resource_id": resource.id,
        "resource_name": resource.name,
        "incident_status": incident.status
    })

    return {"message": "Resource assigned successfully", "resource": resource.name, "status": incident.status}
