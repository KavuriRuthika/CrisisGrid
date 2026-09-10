from sqlalchemy.orm import Session
from app.models import AuditLog

def log_action(
    db: Session,
    action: str,
    user_id: int = None,
    username: str = "System",
    role: str = "SYSTEM",
    target_type: str = None,
    target_id: str = None,
    details: str = None,
    ip_address: str = "127.0.0.1"
):
    audit = AuditLog(
        user_id=user_id,
        username=username,
        role=role,
        action=action,
        target_type=target_type,
        target_id=str(target_id) if target_id else None,
        details=details,
        ip_address=ip_address
    )
    db.add(audit)
    db.commit()
    return audit
