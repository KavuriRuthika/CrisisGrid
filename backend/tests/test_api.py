import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.seed import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    assert "html" in res.text.lower() or "doctype" in res.text.lower()

def test_login_endpoint():
    res = client.post("/api/auth/login", json={"username": "authority", "password": "auth123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "AUTHORITY"

def test_get_incidents():
    res = client.get("/api/incidents")
    assert res.status_code == 200
    incidents = res.json()
    assert len(incidents) > 0

def test_get_hospitals():
    res = client.get("/api/hospitals")
    assert res.status_code == 200
    hospitals = res.json()
    assert len(hospitals) >= 10

def test_get_shelters():
    res = client.get("/api/shelters")
    assert res.status_code == 200
    shelters = res.json()
    assert len(shelters) >= 10

def test_get_analytics_kpis():
    res = client.get("/api/analytics/kpis")
    assert res.status_code == 200
    kpis = res.json()
    assert "active_incidents" in kpis
    assert "hospital_beds_available" in kpis

def test_citizen_report_submission():
    res = client.post("/api/citizen-reports", json={
        "citizen_name": "Test Citizen",
        "citizen_phone": "+91 99999 88888",
        "emergency_type": "Flood",
        "description": "Rising water in street 5",
        "lat": 17.385,
        "lng": 78.486,
        "address": "Street 5"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUBMITTED"
    assert "REP-" in data["report_code"]
