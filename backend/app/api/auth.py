from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, Token, UserCreate, UserOut
from app.auth.security import verify_password, get_password_hash, create_access_token
from app.auth.dependencies import require_current_user
from app.services.audit_service import log_action

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    log_action(db, action="USER_LOGIN", user_id=user.id, username=user.username, role=user.role)
    
    return Token(
        access_token=access_token,
        user_id=user.id,
        username=user.username,
        full_name=user.full_name,
        role=user.role
    )

@router.post("/register", response_model=UserOut)
def register(req: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == req.username) | (User.email == req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    user = User(
        email=req.email,
        username=req.username,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role=req.role.upper(),
        phone=req.phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    log_action(db, action="USER_REGISTERED", user_id=user.id, username=user.username, role=user.role)
    return user

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: User = Depends(require_current_user)):
    return user
