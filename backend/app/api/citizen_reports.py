from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app.database import get_db
from app.models import IncidentReport, Incident, IncidentTimeline, IncidentStatusEnum
from app.schemas import CitizenReportCreate, CitizenReportOut
from app.rules.severity_rules import calculate_incident_severity
from app.rules.priority_rules import calculate_priority_score
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/citizen-reports", tags=["Citizen Emergency Reports"])

@router.post("", response_model=CitizenReportOut)
async def submit_citizen_report(
    req: CitizenReportCreate,
    db: Session = Depends(get_db)
):
    report_code = f"REP-{random.randint(1000, 9999)}"
    
    report = IncidentReport(
        report_code=report_code,
        citizen_name=req.citizen_name,
        citizen_phone=req.citizen_phone,
        emergency_type=req.emergency_type,
        description=req.description,
        status="SUBMITTED",
        lat=req.lat,
        lng=req.lng,
        address=req.address,
        photo_url=req.photo_url
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    log_action(db, action="CITIZEN_REPORT_SUBMITTED", username=req.citizen_name, role="CITIZEN", target_type="CitizenReport", target_id=str(report.id), details=f"Emergency: {req.emergency_type}")

    await manager.broadcast("NEW_CITIZEN_REPORT", {
        "id": report.id,
        "report_code": report.report_code,
        "emergency_type": report.emergency_type,
        "citizen_name": report.citizen_name,
        "lat": report.lat,
        "lng": report.lng
    })

    return report

@router.get("", response_model=List[CitizenReportOut])
def get_all_reports(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(IncidentReport)
    if status:
        query = query.filter(IncidentReport.status == status.upper())
    return query.order_by(IncidentReport.created_at.desc()).all()

@router.post("/{id}/verify")
async def verify_citizen_report(
    id: int,
    action: str = "VERIFY",  # VERIFY or REJECT
    db: Session = Depends(get_db)
):
    report = db.query(IncidentReport).filter(IncidentReport.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if action.upper() == "REJECT":
        report.status = "REJECTED"
        db.commit()
        log_action(db, action="REJECT_CITIZEN_REPORT", target_type="CitizenReport", target_id=str(report.id))
        return {"message": "Report rejected", "status": "REJECTED"}

    report.status = "VERIFIED"

    # Convert into Active Incident if not already linked
    if not report.incident_id:
        inc_code = f"INC-{random.randint(1000, 9999)}"
        sev = calculate_incident_severity(
            incident_type=report.emergency_type,
            population_affected=100
        )
        
        new_incident = Incident(
            incident_code=inc_code,
            title=f"{report.emergency_type}: {report.description[:40]}...",
            description=f"Verified Citizen Report ({report.report_code}) from {report.citizen_name} ({report.citizen_phone}): {report.description}",
            incident_type=report.emergency_type,
            severity=sev,
            status=IncidentStatusEnum.ACTIVE.value,
            lat=report.lat,
            lng=report.lng,
            address=report.address,
            population_affected=100
        )
        db.add(new_incident)
        db.commit()
        db.refresh(new_incident)

        report.incident_id = new_incident.id

        timeline = IncidentTimeline(
            incident_id=new_incident.id,
            title="Citizen Report Verified",
            description=f"Verified Citizen Report {report.report_code} converted into Active Incident {inc_code}",
            status_to="ACTIVE",
            action_by="Authority Officer"
        )
        db.add(timeline)
        db.commit()

        await manager.broadcast("INCIDENT_CREATED", {
            "id": new_incident.id,
            "incident_code": new_incident.incident_code,
            "title": new_incident.title,
            "severity": new_incident.severity,
            "status": new_incident.status,
            "lat": new_incident.lat,
            "lng": new_incident.lng
        })

    db.commit()
    log_action(db, action="VERIFY_CITIZEN_REPORT", target_type="CitizenReport", target_id=str(report.id), details=f"Linked to Incident #{report.incident_id}")

    return {"message": "Report verified successfully", "status": "VERIFIED", "incident_id": report.incident_id}
