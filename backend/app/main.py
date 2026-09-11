from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import (
    auth, incidents, citizen_reports, resources, hospitals,
    shelters, sensors, alerts, routes, evacuation, analytics,
    audit, notifications, simulation, rules
)
from app.websocket import manager
from app.seed import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("crisis_command_center")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-Stack Digital Crisis Command Center (Deterministic - Pure Full-Stack - No AI/ML)"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# No-Cache Middleware to force browser to load fresh map JS without caching old CartoDB tiles
@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

# Create tables and seed data on startup if empty
@app.on_event("startup")
def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            from app.models import Incident
            if not db.query(Incident).first():
                seed_database(db)
        except Exception as e:
            logger.error(f"Error seeding database: {e}")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Error during startup_event: {e}")

@app.get("/api")
@app.get("/api/health")
def api_health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "deterministic_fullstack"
    }

# API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(incidents.router, prefix=settings.API_V1_STR)
app.include_router(citizen_reports.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)
app.include_router(hospitals.router, prefix=settings.API_V1_STR)
app.include_router(shelters.router, prefix=settings.API_V1_STR)
app.include_router(sensors.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(routes.router, prefix=settings.API_V1_STR)
app.include_router(evacuation.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(rules.router, prefix=settings.API_V1_STR)

# WebSocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming ping/messages
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Serve pure HTML, CSS, and JS static build from /static
import os
from fastapi.staticfiles import StaticFiles

static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static_assets")
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static_root")


