from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import EmergencyRule

router = APIRouter(prefix="/rules", tags=["Emergency Rule Engine Configuration"])

@router.get("")
def get_emergency_rules(db: Session = Depends(get_db)):
    rules = db.query(EmergencyRule).all()
    if not rules:
        # Default rules stored for admin review
        return [
            {
                "rule_name": "Critical Flood Threshold",
                "incident_type": "Flood",
                "water_level_m": ">= 4.0m",
                "population_affected": ">= 1000",
                "severity_output": "CRITICAL"
            },
            {
                "rule_name": "High Flood Threshold",
                "incident_type": "Flood",
                "water_level_m": ">= 3.0m",
                "population_affected": ">= 500",
                "severity_output": "HIGH"
            },
            {
                "rule_name": "Structural Fire Threat",
                "incident_type": "Fire",
                "structural_threat": True,
                "severity_output": "CRITICAL"
            },
            {
                "rule_name": "Gas Contamination Critical",
                "incident_type": "Gas Leak",
                "gas_ppm": ">= 500 ppm",
                "severity_output": "CRITICAL"
            }
        ]
    return rules
