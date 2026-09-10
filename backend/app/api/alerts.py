from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import random

from app.database import get_db
from app.models import Alert
from app.schemas import AlertCreate, AlertOut
from app.services.audit_service import log_action
from app.websocket import manager

router = APIRouter(prefix="/alerts", tags=["Emergency Alerts"])

@router.get("", response_model=List[AlertOut])
def get_alerts(status: Optional[str] = "ACTIVE", db: Session = Depends(get_db)):
    query = db.query(Alert)
    if status:
        query = query.filter(Alert.status == status.upper())
    return query.order_by(Alert.created_at.desc()).all()

@router.post("", response_model=AlertOut)
async def create_alert(
    req: AlertCreate,
    db: Session = Depends(get_db)
):
    code = f"ALT-{random.randint(1000, 9999)}"
    
    # Predefined translations if omitted
    te_msg = req.message_te or f"అత్యవసర హెచ్చరిక: {req.title}. దయచేసి సమీపంలోని రక్షణ స్థావరానికి వెళ్లండి."
    hi_msg = req.message_hi or f"आपातकालीन चेतावनी: {req.title}। कृपया निकटतम सुरक्षित आश्रय स्थल पर जाएँ।"

    alert = Alert(
        alert_code=code,
        title=req.title,
        message_en=req.message_en,
        message_te=te_msg,
        message_hi=hi_msg,
        severity=req.severity.upper(),
        affected_zone_name=req.affected_zone_name or "Emergency Operations Radius",
        center_lat=req.center_lat,
        center_lng=req.center_lng,
        radius_km=req.radius_km or 2.0,
        status="ACTIVE"
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    log_action(db, action="CREATE_EMERGENCY_ALERT", target_type="Alert", target_id=str(alert.id), details=f"Alert: {alert.title}")

    await manager.broadcast("EMERGENCY_ALERT_BROADCAST", {
        "id": alert.id,
        "alert_code": alert.alert_code,
        "title": alert.title,
        "message_en": alert.message_en,
        "message_te": alert.message_te,
        "message_hi": alert.message_hi,
        "severity": alert.severity,
        "affected_zone": alert.affected_zone_name
    })

    return alert

@router.delete("/{id}")
async def cancel_alert(id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "CANCELLED"
    db.commit()
    log_action(db, action="CANCEL_ALERT", target_type="Alert", target_id=str(alert.id))
    return {"message": "Alert cancelled successfully"}
