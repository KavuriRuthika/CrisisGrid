from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Notification
from app.schemas import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationOut])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.created_at.desc()).all()

@router.put("/{id}/read")
def mark_notification_read(id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}
