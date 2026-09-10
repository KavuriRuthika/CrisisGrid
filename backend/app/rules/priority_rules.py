"""
Deterministic Priority Scoring Engine.
Calculates an objective priority score (0-100+) for incidents and provides exact breakdown details.
"""

from typing import Tuple

def calculate_priority_score(
    severity: str,
    population_affected: int,
    resource_shortage: bool = False,
    hospital_nearby: bool = False,
    road_blocked: bool = False,
    age_minutes: float = 0.0
) -> Tuple[float, str]:
    score = 0.0
    reasons = []

    # 1. Base Severity Score
    sev = severity.upper()
    if sev == "CRITICAL":
        score += 50.0
        reasons.append("Base Severity: CRITICAL (+50 pts)")
    elif sev == "HIGH":
        score += 35.0
        reasons.append("Base Severity: HIGH (+35 pts)")
    elif sev == "MEDIUM":
        score += 20.0
        reasons.append("Base Severity: MEDIUM (+20 pts)")
    else:
        score += 10.0
        reasons.append("Base Severity: LOW (+10 pts)")

    # 2. Population Impact Weight
    if population_affected >= 1000:
        score += 20.0
        reasons.append(f"Population Affected >= 1000 ({population_affected}) (+20 pts)")
    elif population_affected >= 500:
        score += 10.0
        reasons.append(f"Population Affected >= 500 ({population_affected}) (+10 pts)")
    elif population_affected >= 100:
        score += 5.0
        reasons.append(f"Population Affected >= 100 ({population_affected}) (+5 pts)")

    # 3. Resource Shortage Weight
    if resource_shortage:
        score += 10.0
        reasons.append("Available Resource Shortage (+10 pts)")

    # 4. Hospital Proximity Weight
    if hospital_nearby:
        score += 5.0
        reasons.append("Hospital Nearby (< 3km) (+5 pts)")

    # 5. Road Accessibility Weight
    if road_blocked:
        score += 10.0
        reasons.append("Primary Access Road Blocked/Flooded (+10 pts)")

    # 6. Incident Age Weight (1 pt per 10 mins, max +15)
    age_pts = min(15.0, float(int(age_minutes // 10)))
    if age_pts > 0:
        score += age_pts
        reasons.append(f"Unresolved Duration Penalty ({int(age_minutes)} mins) (+{int(age_pts)} pts)")

    reason_str = " | ".join(reasons)
    return round(score, 1), reason_str
