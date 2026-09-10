from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json, random

from app.database import get_db
from app.models import EvacuationZone, Shelter, EvacuationPlan
from app.schemas import EvacuationPlanRequest, EvacuationPlanResponse
from app.rules.evacuation_rules import generate_evacuation_plan
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/evacuation", tags=["Evacuation Management"])

@router.get("/zones")
def get_evacuation_zones(db: Session = Depends(get_db)):
    return db.query(EvacuationZone).all()

@router.post("/plan", response_model=EvacuationPlanResponse)
async def create_evacuation_plan(req: EvacuationPlanRequest, db: Session = Depends(get_db)):
    zone = db.query(EvacuationZone).filter(EvacuationZone.id == req.zone_id).first()
    if not zone:
        # Create a default zone if requested ID doesn't exist
        zone = EvacuationZone(
            name=f"Evacuation Sector {req.zone_id}",
            population_count=req.target_population,
            center_lat=17.3850,
            center_lng=78.4867,
            risk_level="HIGH"
        )
        db.add(zone)
        db.commit()
        db.refresh(zone)

    shelters = db.query(Shelter).all()
    shelter_dicts = [
        {
            "id": s.id,
            "name": s.name,
            "max_capacity": s.max_capacity,
            "current_occupancy": s.current_occupancy,
            "lat": s.lat,
            "lng": s.lng
        }
        for s in shelters
    ]

    plan_result = generate_evacuation_plan(
        zone_name=zone.name,
        zone_lat=zone.center_lat,
        zone_lng=zone.center_lng,
        target_population=req.target_population,
        shelters=shelter_dicts
    )

    plan_code = f"EVC-{random.randint(1000, 9999)}"
    plan = EvacuationPlan(
        plan_code=plan_code,
        zone_id=zone.id,
        target_population=req.target_population,
        assigned_shelter_data=json.dumps(plan_result["shelters"]),
        status="ACTIVE"
    )
    db.add(plan)
    zone.status = "IN_PROGRESS"
    db.commit()

    log_action(db, action="CREATE_EVACUATION_PLAN", target_type="EvacuationPlan", target_id=str(plan.id), details=f"Target: {req.target_population} citizens")

    await manager.broadcast("EVACUATION_STARTED", {
        "plan_code": plan_code,
        "zone_name": zone.name,
        "target_population": req.target_population,
        "total_allocated": plan_result["total_allocated"]
    })

    return EvacuationPlanResponse(
        plan_code=plan_code,
        zone_name=zone.name,
        target_population=req.target_population,
        total_allocated=plan_result["total_allocated"],
        shelters=plan_result["shelters"],
        status=plan_result["status"]
    )
