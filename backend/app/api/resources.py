from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app.database import get_db
from app.models import Resource
from app.schemas import ResourceCreate, ResourceOut
from app.rules.resource_rules import recommend_nearest_resources
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.get("", response_model=List[ResourceOut])
def get_all_resources(
    resource_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Resource)
    if resource_type:
        query = query.filter(Resource.resource_type.ilike(f"%{resource_type}%"))
    if status:
        query = query.filter(Resource.status == status.upper())
    return query.all()

@router.post("", response_model=ResourceOut)
def create_resource(
    req: ResourceCreate,
    db: Session = Depends(get_db)
):
    code = f"RES-{random.randint(100, 999)}"
    resource = Resource(
        code=code,
        name=req.name,
        resource_type=req.resource_type.upper(),
        lat=req.lat,
        lng=req.lng,
        contact_phone=req.contact_phone,
        capacity=req.capacity,
        status="AVAILABLE"
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    log_action(db, action="CREATE_RESOURCE", target_type="Resource", target_id=str(resource.id), details=f"Created {code}")
    return resource

@router.put("/{id}", response_model=ResourceOut)
async def update_resource(
    id: int,
    status: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    db: Session = Depends(get_db)
):
    resource = db.query(Resource).filter(Resource.id == id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if status: resource.status = status.upper()
    if lat is not None: resource.lat = lat
    if lng is not None: resource.lng = lng

    db.commit()
    db.refresh(resource)

    await manager.broadcast("RESOURCE_STATUS_CHANGED", {
        "id": resource.id,
        "code": resource.code,
        "name": resource.name,
        "status": resource.status,
        "lat": resource.lat,
        "lng": resource.lng
    })

    return resource

@router.get("/recommend")
def get_recommended_resources(
    lat: float,
    lng: float,
    resource_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    resources = db.query(Resource).all()
    resource_dicts = [
        {
            "id": r.id,
            "code": r.code,
            "name": r.name,
            "resource_type": r.resource_type,
            "status": r.status,
            "lat": r.lat,
            "lng": r.lng,
            "contact_phone": r.contact_phone
        }
        for r in resources
    ]
    recommendations = recommend_nearest_resources(
        incident_lat=lat,
        incident_lng=lng,
        resources=resource_dicts,
        resource_type_filter=resource_type
    )
    return recommendations
