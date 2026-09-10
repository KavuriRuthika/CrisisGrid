"""
Deterministic Evacuation Planning Engine.
Allocates affected zone population to shelters based on remaining available capacity and distance.
"""

from typing import List, Dict, Any
from app.rules.resource_rules import haversine_distance_km

def generate_evacuation_plan(
    zone_name: str,
    zone_lat: float,
    zone_lng: float,
    target_population: int,
    shelters: List[Dict[str, Any]]
) -> Dict[str, Any]:
    remaining_people = target_population
    allocated_shelters = []

    # Filter available shelters and calculate distance to zone center
    shelter_candidates = []
    for s in shelters:
        avail = max(0, s["max_capacity"] - s["current_occupancy"])
        if avail > 0:
            dist = haversine_distance_km(zone_lat, zone_lng, s["lat"], s["lng"])
            shelter_candidates.append({
                "id": s["id"],
                "name": s["name"],
                "available_capacity": avail,
                "distance_km": round(dist, 2),
                "lat": s["lat"],
                "lng": s["lng"]
            })

    # Sort shelters by distance
    shelter_candidates.sort(key=lambda x: x["distance_km"])

    total_allocated = 0
    for cand in shelter_candidates:
        if remaining_people <= 0:
            break
        take = min(cand["available_capacity"], remaining_people)
        allocated_shelters.append({
            "shelter_id": cand["id"],
            "shelter_name": cand["name"],
            "allocated_count": take,
            "distance_km": cand["distance_km"]
        })
        total_allocated += take
        remaining_people -= take

    status = "FULL_ALLOCATION" if remaining_people == 0 else "PARTIAL_CAPACITY_DEFICIT"

    return {
        "zone_name": zone_name,
        "target_population": target_population,
        "total_allocated": total_allocated,
        "unallocated_people": max(0, remaining_people),
        "shelters": allocated_shelters,
        "status": status
    }
