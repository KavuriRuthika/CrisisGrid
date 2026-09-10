"""
Deterministic Rule Engine for Emergency Severity Classification (No AI / ML).
All severity decisions are calculated using explicit threshold logic and conditions.
"""

def calculate_incident_severity(
    incident_type: str,
    water_level_m: float = 0.0,
    population_affected: int = 0,
    gas_ppm: float = 0.0,
    casualties: int = 0,
    structural_damage: bool = False
) -> str:
    itype = incident_type.upper()
    
    # 1. Flood Rules
    if "FLOOD" in itype:
        if water_level_m >= 4.0 and population_affected >= 1000:
            return "CRITICAL"
        elif water_level_m >= 3.0 and population_affected >= 500:
            return "HIGH"
        elif water_level_m >= 2.0:
            return "MEDIUM"
        else:
            return "LOW"

    # 2. Fire Rules
    elif "FIRE" in itype:
        if structural_damage or casualties >= 3:
            return "CRITICAL"
        elif casualties >= 1 or population_affected >= 300:
            return "HIGH"
        elif population_affected >= 50:
            return "MEDIUM"
        else:
            return "LOW"

    # 3. Gas Leak Rules
    elif "GAS" in itype or "CHEMICAL" in itype:
        if gas_ppm >= 500.0 or casualties >= 2:
            return "CRITICAL"
        elif gas_ppm >= 200.0 or population_affected >= 200:
            return "HIGH"
        elif gas_ppm >= 50.0:
            return "MEDIUM"
        else:
            return "LOW"

    # 4. Accident / Medical Emergency Rules
    elif "ACCIDENT" in itype or "MEDICAL" in itype:
        if casualties >= 5:
            return "CRITICAL"
        elif casualties >= 2:
            return "HIGH"
        elif casualties >= 1:
            return "MEDIUM"
        else:
            return "LOW"

    # 5. Cyclone / Landslide / Building Collapse Rules
    elif "CYCLONE" in itype or "BUILDING" in itype or "LANDSLIDE" in itype:
        if casualties >= 3 or structural_damage:
            return "CRITICAL"
        elif population_affected >= 500:
            return "HIGH"
        elif population_affected >= 100:
            return "MEDIUM"
        else:
            return "LOW"

    # 6. Default Fallback
    else:
        if casualties >= 3:
            return "CRITICAL"
        elif casualties >= 1 or population_affected >= 500:
            return "HIGH"
        elif population_affected >= 100:
            return "MEDIUM"
        else:
            return "LOW"
