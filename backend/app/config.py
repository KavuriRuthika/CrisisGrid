import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Digital Crisis Command Center"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "CRISIS_COMMAND_CENTER_SECRET_KEY_SUPER_SECURE_2026_NO_AI"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database: SQLite fallback for local running, PostgreSQL for production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./crisis_command.db")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
