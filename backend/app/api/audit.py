from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import AuditLog
from app.schemas import AuditLogOut

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(limit: int = 100, db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
