"""
Digital Crisis Simulation Engine (Deterministic - No AI).
Calculates exact emergency impacts using physics/threshold formulas based on rainfall, water levels, and population density.
"""

def run_disaster_simulation(
    disaster_type: str,
    rainfall_mm: float,
    water_level_m: float,
    population_density: int
) -> dict:
    multiplier = 1.0
    if disaster_type.upper() == "FLOOD":
        multiplier = 1.2
    elif disaster_type.upper() == "CYCLONE":
        multiplier = 1.4

    affected_pop = int(population_density * (water_level_m / 2.0) * multiplier)
    blocked_roads = int(water_level_m * 1.8)
    req_rescue = max(2, int(affected_pop / 200))
    req_ambulances = max(3, int(affected_pop / 120))
    shelter_beds = int(affected_pop * 0.85)
    hospital_beds = int(affected_pop * 0.18)

    if water_level_m >= 4.0 or rainfall_mm >= 150.0:
        severity = "CRITICAL"
        summary = f"EXTREME HAZARD: High flood risk! Estimated {affected_pop} people affected. Immediate evacuation to safe shelters required."
    elif water_level_m >= 3.0 or rainfall_mm >= 100.0:
        severity = "HIGH"
        summary = f"HIGH HAZARD: Severe waterlogging in low-lying sectors. {req_rescue} rescue teams recommended for deployment."
    elif water_level_m >= 2.0:
        severity = "MEDIUM"
        summary = f"MODERATE HAZARD: Minor localized flooding. Traffic advisories active."
    else:
        severity = "LOW"
        summary = f"MINIMAL HAZARD: Normal water levels monitored."

    return {
        "disaster_type": disaster_type,
        "affected_population": affected_pop,
        "blocked_roads_count": blocked_roads,
        "required_rescue_teams": req_rescue,
        "required_ambulances": req_ambulances,
        "shelter_demand_beds": shelter_beds,
        "hospital_demand_beds": hospital_beds,
        "calculated_severity": severity,
        "risk_summary": summary
    }
