from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    full_name: str
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    role: str = "CITIZEN"
    phone: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    phone: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

# --- Incident Schemas ---
class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    incident_type: str
    lat: float
    lng: float
    address: Optional[str] = None
    population_affected: int = 0
    water_level_m: float = 0.0
    gas_ppm: float = 0.0
    casualties: int = 0
    structural_damage: bool = False
    severity: Optional[str] = None  # If omitted, auto-calculated by rule engine

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    incident_type: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    population_affected: Optional[int] = None
    water_level_m: Optional[float] = None
    gas_ppm: Optional[float] = None
    casualties: Optional[int] = None
    structural_damage: Optional[bool] = None

class IncidentTimelineOut(BaseModel):
    id: int
    timestamp: datetime
    title: str
    description: Optional[str]
    status_from: Optional[str]
    status_to: Optional[str]
    action_by: str

    class Config:
        from_attributes = True

class IncidentOut(BaseModel):
    id: int
    incident_code: str
    title: str
    description: Optional[str]
    incident_type: str
    severity: str
    priority_score: float
    priority_reason: Optional[str]
    status: str
    lat: float
    lng: float
    address: Optional[str]
    population_affected: int
    water_level_m: float
    gas_ppm: float
    casualties: int
    structural_damage: bool
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    timeline_entries: List[IncidentTimelineOut] = []

    class Config:
        from_attributes = True

# --- Citizen Report Schemas ---
class CitizenReportCreate(BaseModel):
    citizen_name: str
    citizen_phone: str
    emergency_type: str
    description: str
    lat: float
    lng: float
    address: Optional[str] = None
    photo_url: Optional[str] = None

class CitizenReportOut(BaseModel):
    id: int
    report_code: str
    citizen_name: str
    citizen_phone: str
    emergency_type: str
    description: str
    status: str
    lat: float
    lng: float
    address: Optional[str]
    photo_url: Optional[str]
    incident_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# --- Resource Schemas ---
class ResourceCreate(BaseModel):
    name: str
    resource_type: str
    lat: float
    lng: float
    contact_phone: Optional[str] = None
    capacity: int = 4

class ResourceOut(BaseModel):
    id: int
    code: str
    name: str
    resource_type: str
    status: str
    lat: float
    lng: float
    contact_phone: Optional[str]
    capacity: int
    current_incident_id: Optional[int]
    last_updated: datetime

    class Config:
        from_attributes = True

class ResourceAssignRequest(BaseModel):
    resource_id: int
    notes: Optional[str] = None

# --- Hospital & Shelter Schemas ---
class HospitalUpdate(BaseModel):
    available_beds: Optional[int] = None
    icu_available: Optional[int] = None
    doctors_available: Optional[int] = None
    ambulances_count: Optional[int] = None
    oxygen_available_liters: Optional[float] = None
    blood_units: Optional[int] = None
    incoming_patients: Optional[int] = None

class HospitalOut(BaseModel):
    id: int
    code: str
    name: str
    lat: float
    lng: float
    address: Optional[str]
    phone: Optional[str]
    total_beds: int
    available_beds: int
    icu_total: int
    icu_available: int
    doctors_available: int
    ambulances_count: int
    oxygen_available_liters: float
    blood_units: int
    incoming_patients: int
    status: str
    last_updated: datetime

    class Config:
        from_attributes = True

class ShelterUpdate(BaseModel):
    current_occupancy: Optional[int] = None
    food_kits: Optional[int] = None
    water_liters: Optional[float] = None
    medical_kits: Optional[int] = None

class ShelterOut(BaseModel):
    id: int
    code: str
    name: str
    lat: float
    lng: float
    address: Optional[str]
    phone: Optional[str]
    max_capacity: int
    current_occupancy: int
    food_kits: int
    water_liters: float
    medical_kits: int
    status: str
    last_updated: datetime

    class Config:
        from_attributes = True

# --- IoT Sensor Schemas ---
class SensorIngest(BaseModel):
    sensor_code: str
    current_value: float

class IoTSensorOut(BaseModel):
    id: int
    sensor_code: str
    sensor_type: str
    location_name: str
    lat: float
    lng: float
    current_value: float
    unit: str
    warning_threshold: float
    critical_threshold: float
    status: str
    last_updated: datetime

    class Config:
        from_attributes = True

class SensorThresholdUpdate(BaseModel):
    warning_threshold: float
    critical_threshold: float

# --- Alert Schemas ---
class AlertCreate(BaseModel):
    title: str
    message_en: str
    message_te: Optional[str] = None
    message_hi: Optional[str] = None
    severity: str = "HIGH"
    affected_zone_name: Optional[str] = None
    center_lat: Optional[float] = None
    center_lng: Optional[float] = None
    radius_km: Optional[float] = None

class AlertOut(BaseModel):
    id: int
    alert_code: str
    title: str
    message_en: str
    message_te: Optional[str]
    message_hi: Optional[str]
    severity: str
    affected_zone_name: Optional[str]
    center_lat: Optional[float]
    center_lng: Optional[float]
    radius_km: Optional[float]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Emergency Route Schemas ---
class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    vehicle_type: str = "AMBULANCE"

class RouteOption(BaseModel):
    route_id: str
    name: str
    distance_km: float
    eta_minutes: float
    status: str  # AVAILABLE, BLOCKED, FLOODED
    is_recommended: bool
    warnings: List[str] = []
    coordinates: List[List[float]] = []  # List of [lat, lng]

class RouteResponse(BaseModel):
    routes: List[RouteOption]

# --- Evacuation Schemas ---
class EvacuationPlanRequest(BaseModel):
    zone_id: int
    target_population: int

class ShelterAllocationItem(BaseModel):
    shelter_id: int
    shelter_name: str
    allocated_count: int
    distance_km: float

class EvacuationPlanResponse(BaseModel):
    plan_code: str
    zone_name: str
    target_population: int
    total_allocated: int
    shelters: List[ShelterAllocationItem]
    status: str

# --- Disaster Simulation Schemas ---
class SimulationRequest(BaseModel):
    disaster_type: str  # Flood, Fire, Cyclone
    rainfall_mm: float = 100.0
    water_level_m: float = 3.2
    population_density: int = 1500

class SimulationResponse(BaseModel):
    disaster_type: str
    affected_population: int
    blocked_roads_count: int
    required_rescue_teams: int
    required_ambulances: int
    shelter_demand_beds: int
    hospital_demand_beds: int
    calculated_severity: str
    risk_summary: str

# --- Analytics & Performance KPI Schemas ---
class AnalyticsKPI(BaseModel):
    active_incidents: int
    critical_incidents: int
    high_priority_incidents: int
    ambulances_available: int
    rescue_teams_available: int
    hospital_beds_available: int
    shelter_capacity_available: int
    avg_response_time_minutes: float
    avg_resolution_time_minutes: float
    resource_utilization_pct: float
    hospital_utilization_pct: float
    shelter_utilization_pct: float
    incidents_by_type: dict
    incidents_by_severity: dict

# --- Audit & Notifications ---
class AuditLogOut(BaseModel):
    id: int
    timestamp: datetime
    user_id: Optional[int]
    username: Optional[str]
    role: Optional[str]
    action: str
    target_type: Optional[str]
    target_id: Optional[str]
    details: Optional[str]
    ip_address: Optional[str]

    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    severity: str
    is_read: bool
    incident_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
