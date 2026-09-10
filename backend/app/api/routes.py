from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Road
from app.schemas import RouteRequest, RouteResponse
from app.rules.routing_rules import calculate_emergency_routes

router = APIRouter(prefix="/routes", tags=["Emergency Routing"])

@router.post("/calculate", response_model=RouteResponse)
def calculate_route(req: RouteRequest, db: Session = Depends(get_db)):
    roads = db.query(Road).all()
    road_dicts = [
        {
            "id": r.id,
            "road_name": r.road_name,
            "status": r.status,
            "distance_km": r.distance_km,
            "water_depth_m": r.water_depth_m,
            "lat1": r.lat1, "lng1": r.lng1,
            "lat2": r.lat2, "lng2": r.lng2
        }
        for r in roads
    ]

    routes = calculate_emergency_routes(
        start_lat=req.start_lat,
        start_lng=req.start_lng,
        end_lat=req.end_lat,
        end_lng=req.end_lng,
        roads=road_dicts,
        vehicle_type=req.vehicle_type
    )

    return RouteResponse(routes=routes)
