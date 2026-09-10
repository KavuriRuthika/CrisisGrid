from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Hospital
from app.schemas import HospitalOut, HospitalUpdate
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

@router.get("", response_model=List[HospitalOut])
def get_hospitals(db: Session = Depends(get_db)):
    return db.query(Hospital).all()

@router.put("/{id}", response_model=HospitalOut)
async def update_hospital_capacity(
    id: int,
    req: HospitalUpdate,
    db: Session = Depends(get_db)
):
    h = db.query(Hospital).filter(Hospital.id == id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")

    if req.available_beds is not None: h.available_beds = req.available_beds
    if req.icu_available is not None: h.icu_available = req.icu_available
    if req.doctors_available is not None: h.doctors_available = req.doctors_available
    if req.ambulances_count is not None: h.ambulances_count = req.ambulances_count
    if req.oxygen_available_liters is not None: h.oxygen_available_liters = req.oxygen_available_liters
    if req.blood_units is not None: h.blood_units = req.blood_units
    if req.incoming_patients is not None: h.incoming_patients = req.incoming_patients

    db.commit()
    db.refresh(h)

    log_action(db, action="UPDATE_HOSPITAL_CAPACITY", target_type="Hospital", target_id=str(h.id))

    await manager.broadcast("HOSPITAL_UPDATED", {
        "id": h.id,
        "name": h.name,
        "available_beds": h.available_beds,
        "icu_available": h.icu_available
    })

    return h
