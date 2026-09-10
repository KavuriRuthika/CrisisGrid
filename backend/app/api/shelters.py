from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Shelter
from app.schemas import ShelterOut, ShelterUpdate
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/shelters", tags=["Shelters"])

@router.get("", response_model=List[ShelterOut])
def get_shelters(db: Session = Depends(get_db)):
    return db.query(Shelter).all()

@router.put("/{id}", response_model=ShelterOut)
async def update_shelter_capacity(
    id: int,
    req: ShelterUpdate,
    db: Session = Depends(get_db)
):
    s = db.query(Shelter).filter(Shelter.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shelter not found")

    if req.current_occupancy is not None: s.current_occupancy = req.current_occupancy
    if req.food_kits is not None: s.food_kits = req.food_kits
    if req.water_liters is not None: s.water_liters = req.water_liters
    if req.medical_kits is not None: s.medical_kits = req.medical_kits

    # Auto update status based on capacity
    ratio = s.current_occupancy / float(s.max_capacity) if s.max_capacity > 0 else 1.0
    if ratio >= 1.0:
        s.status = "FULL"
    elif ratio >= 0.8:
        s.status = "NEAR_CAPACITY"
    else:
        s.status = "AVAILABLE"

    db.commit()
    db.refresh(s)

    log_action(db, action="UPDATE_SHELTER_CAPACITY", target_type="Shelter", target_id=str(s.id))

    await manager.broadcast("SHELTER_UPDATED", {
        "id": s.id,
        "name": s.name,
        "current_occupancy": s.current_occupancy,
        "status": s.status
    })

    return s
