import pytest
from app.rules.severity_rules import calculate_incident_severity
from app.rules.priority_rules import calculate_priority_score
from app.rules.resource_rules import haversine_distance_km, recommend_nearest_resources
from app.rules.routing_rules import calculate_emergency_routes
from app.rules.evacuation_rules import generate_evacuation_plan
from app.rules.sensor_rules import evaluate_sensor_threshold

def test_flood_severity_critical():
    # IF water_level >= 4m AND population_affected >= 1000 THEN CRITICAL
    sev = calculate_incident_severity("Flood", water_level_m=4.2, population_affected=1200)
    assert sev == "CRITICAL"

def test_flood_severity_high():
    # IF water_level >= 3m AND population_affected >= 500 THEN HIGH
    sev = calculate_incident_severity("Flood", water_level_m=3.2, population_affected=600)
    assert sev == "HIGH"

def test_fire_severity_critical():
    # Fire structural damage -> CRITICAL
    sev = calculate_incident_severity("Fire", structural_damage=True)
    assert sev == "CRITICAL"

def test_priority_scoring_breakdown():
    # CRITICAL base = 50, Pop >= 1000 = +20, Hospital nearby = +5, Road blocked = +10 -> Total 85
    score, reason = calculate_priority_score(
        severity="CRITICAL",
        population_affected=1200,
        resource_shortage=False,
        hospital_nearby=True,
        road_blocked=True,
        age_minutes=0
    )
    assert score == 85.0
    assert "CRITICAL (+50 pts)" in reason
    assert "Population Affected >= 1000" in reason

def test_haversine_distance():
    # Distance between 17.385, 78.4867 and 17.395, 78.4967
    dist = haversine_distance_km(17.385, 78.4867, 17.395, 78.4967)
    assert dist > 1.0 and dist < 2.0

def test_resource_recommendation():
    resources = [
        {"id": 1, "code": "A01", "name": "Amb 1", "resource_type": "AMBULANCE", "status": "AVAILABLE", "lat": 17.387, "lng": 78.488},
        {"id": 2, "code": "A02", "name": "Amb 2", "resource_type": "AMBULANCE", "status": "AVAILABLE", "lat": 17.420, "lng": 78.520},
        {"id": 3, "code": "A03", "name": "Amb 3", "resource_type": "AMBULANCE", "status": "ASSIGNED", "lat": 17.386, "lng": 78.487}
    ]
    recs = recommend_nearest_resources(17.385, 78.4867, resources, resource_type_filter="AMBULANCE")
    assert len(recs) == 2  # Only available resources
    assert recs[0]["code"] == "A01"  # Nearest first

def test_sensor_threshold_evaluation():
    status, is_w, is_c, msg = evaluate_sensor_threshold("WATER_LEVEL", "River Basin", 4.2, "m", 3.0, 4.0)
    assert status == "CRITICAL"
    assert is_c is True

def test_evacuation_allocation():
    shelters = [
        {"id": 1, "name": "S1", "max_capacity": 1000, "current_occupancy": 800, "lat": 17.39, "lng": 78.49}, # 200 free
        {"id": 2, "name": "S2", "max_capacity": 1000, "current_occupancy": 200, "lat": 17.40, "lng": 78.50}  # 800 free
    ]
    plan = generate_evacuation_plan("Zone A", 17.385, 78.486, 500, shelters)
    assert plan["total_allocated"] == 500
    assert len(plan["shelters"]) == 2
    assert plan["shelters"][0]["allocated_count"] == 200  # S1 filled to capacity first
    assert plan["shelters"][1]["allocated_count"] == 300  # S2 takes remainder
