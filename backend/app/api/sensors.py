from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random

from app.database import get_db
from app.models import IoTSensor, SensorReading, Incident, Alert, IncidentTimeline, IncidentStatusEnum
from app.schemas import IoTSensorOut, SensorIngest, SensorThresholdUpdate
from app.rules.sensor_rules import evaluate_sensor_threshold
from app.rules.severity_rules import calculate_incident_severity
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/sensors", tags=["IoT Sensors"])

@router.get("", response_model=List[IoTSensorOut])
def get_all_sensors(db: Session = Depends(get_db)):
    return db.query(IoTSensor).all()

@router.post("/readings")
async def ingest_sensor_reading(
    req: SensorIngest,
    db: Session = Depends(get_db)
):
    sensor = db.query(IoTSensor).filter(IoTSensor.sensor_code == req.sensor_code).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")

    sensor.current_value = req.current_value
    
    new_status, is_warn, is_crit, msg = evaluate_sensor_threshold(
        sensor_type=sensor.sensor_type,
        location_name=sensor.location_name,
        current_value=req.current_value,
        unit=sensor.unit,
        warning_threshold=sensor.warning_threshold,
        critical_threshold=sensor.critical_threshold
    )

    old_status = sensor.status
    sensor.status = new_status

    reading = SensorReading(
        sensor_id=sensor.id,
        value=req.current_value,
        status=new_status
    )
    db.add(reading)
    db.commit()

    # Trigger Automated Crisis Alerts & Incidents if Critical threshold breached
    triggered_incident = None
    if is_crit and old_status != "CRITICAL":
        alert_code = f"ALT-{random.randint(1000, 9999)}"
        alert = Alert(
            alert_code=alert_code,
            title=f"AUTOMATED IOT CRITICAL WARNING: {sensor.sensor_type}",
            message_en=f"Automated Sensor Warning: {msg}. High disaster risk detected.",
            message_te=f"ఆటోమేటిక్ హెచ్చరిక: {sensor.sensor_type} కీలక ప్రమాద స్థాయి దాటింది ({sensor.location_name}).",
            message_hi=f"स्वचालित चेतावनी: {sensor.sensor_type} ने महत्वपूर्ण स्तर पार कर लिया है ({sensor.location_name}).",
            severity="CRITICAL",
            affected_zone_name=sensor.location_name,
            center_lat=sensor.lat,
            center_lng=sensor.lng,
            radius_km=3.0,
            status="ACTIVE"
        )
        db.add(alert)
        db.commit()

        inc_code = f"INC-{random.randint(1000, 9999)}"
        new_inc = Incident(
            incident_code=inc_code,
            title=f"Automated Sensor Alert: {sensor.sensor_type} Critical Level at {sensor.location_name}",
            description=f"IoT Telemetry Triggered Emergency. Sensor {sensor.sensor_code} recorded {req.current_value} {sensor.unit} (Threshold: {sensor.critical_threshold}).",
            incident_type="Flood" if sensor.sensor_type == "WATER_LEVEL" else sensor.sensor_type,
            severity="CRITICAL",
            status=IncidentStatusEnum.ACTIVE.value,
            lat=sensor.lat,
            lng=sensor.lng,
            address=sensor.location_name,
            population_affected=1200,
            water_level_m=req.current_value if sensor.sensor_type == "WATER_LEVEL" else 0.0,
            gas_ppm=req.current_value if sensor.sensor_type == "GAS" else 0.0
        )
        db.add(new_inc)
        db.commit()
        db.refresh(new_inc)
        triggered_incident = new_inc

        timeline = IncidentTimeline(
            incident_id=new_inc.id,
            title="Automated Sensor Breach",
            description=f"Sensor {sensor.sensor_code} crossed critical threshold ({req.current_value} {sensor.unit})",
            status_to="ACTIVE",
            action_by="IoT Automated Sensor Engine"
        )
        db.add(timeline)
        db.commit()

        log_action(db, action="AUTOMATED_SENSOR_ALERT", target_type="IoTSensor", target_id=str(sensor.id), details=msg)

    await manager.broadcast("SENSOR_READING_UPDATED", {
        "sensor_code": sensor.sensor_code,
        "value": sensor.current_value,
        "status": sensor.status,
        "location_name": sensor.location_name,
        "message": msg
    })

    return {
        "sensor_code": sensor.sensor_code,
        "current_value": sensor.current_value,
        "status": sensor.status,
        "triggered_incident_id": triggered_incident.id if triggered_incident else None,
        "message": msg
    }

@router.put("/{id}/thresholds", response_model=IoTSensorOut)
def update_sensor_thresholds(
    id: int,
    req: SensorThresholdUpdate,
    db: Session = Depends(get_db)
):
    sensor = db.query(IoTSensor).filter(IoTSensor.id == id).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")

    sensor.warning_threshold = req.warning_threshold
    sensor.critical_threshold = req.critical_threshold
    db.commit()
    db.refresh(sensor)
    return sensor
