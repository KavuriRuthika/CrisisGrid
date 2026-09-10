"""
Deterministic Resource Allocation Engine using Haversine geographic calculation.
Finds and ranks available resources near an incident.
"""

import math
from typing import List, Dict, Any

def haversine_distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def recommend_nearest_resources(
    incident_lat: float,
    incident_lng: float,
    resources: List[Dict[str, Any]],
    resource_type_filter: str = None
) -> List[Dict[str, Any]]:
    """
    Ranks available resources by shortest geographical distance.
    """
    candidates = []
    
    for r in resources:
        # Check availability
        if r.get("status") != "AVAILABLE":
            continue
        
        # Filter by type if specified
        if resource_type_filter:
            if resource_type_filter.upper() not in r.get("resource_type", "").upper():
                continue

        dist = haversine_distance_km(incident_lat, incident_lng, r["lat"], r["lng"])
        
        # Estimate travel time based on 40 km/h average speed in emergency
        eta_minutes = round((dist / 40.0) * 60.0, 1)

        candidate = {
            "resource_id": r["id"],
            "code": r.get("code", f"RES-{r['id']}"),
            "name": r["name"],
            "resource_type": r["resource_type"],
            "distance_km": round(dist, 2),
            "eta_minutes": max(1.0, eta_minutes),
            "status": r["status"],
            "contact_phone": r.get("contact_phone", "N/A"),
            "lat": r["lat"],
            "lng": r["lng"]
        }
        candidates.append(candidate)

    # Sort by distance
    candidates.sort(key=lambda x: x["distance_km"])
    return candidates
