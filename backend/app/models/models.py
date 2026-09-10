from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum

from app.database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    AUTHORITY = "AUTHORITY"
    RESCUE_TEAM = "RESCUE_TEAM"
    HOSPITAL = "HOSPITAL"
    SHELTER = "SHELTER"
    CITIZEN = "CITIZEN"

class IncidentStatusEnum(str, enum.Enum):
    REPORTED = "REPORTED"
    VERIFIED = "VERIFIED"
    ACTIVE = "ACTIVE"
    DISPATCHED = "DISPATCHED"
    IN_PROGRESS = "IN_PROGRESS"
    UNDER_CONTROL = "UNDER_CONTROL"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class SeverityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ResourceStatusEnum(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    ASSIGNED = "ASSIGNED"
    EN_ROUTE = "EN_ROUTE"
    ON_SCENE = "ON_SCENE"
    UNAVAILABLE = "UNAVAILABLE"
    MAINTENANCE = "MAINTENANCE"

class RoadStatusEnum(str, enum.Enum):
    OPEN = "OPEN"
    BLOCKED = "BLOCKED"
    FLOODED = "FLOODED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default=RoleEnum.CITIZEN.value, nullable=False)
    phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(50), unique=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    incident_type = Column(String(100), nullable=False)  # Flood, Fire, Accident, Medical, Cyclone, Gas Leak, etc.
    severity = Column(String(50), default=SeverityEnum.MEDIUM.value)
    priority_score = Column(Float, default=0.0)
    priority_reason = Column(Text, nullable=True)
    status = Column(String(50), default=IncidentStatusEnum.REPORTED.value)
    
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    
    population_affected = Column(Integer, default=0)
    water_level_m = Column(Float, default=0.0)
    gas_ppm = Column(Float, default=0.0)
    casualties = Column(Integer, default=0)
    structural_damage = Column(Boolean, default=False)
    
    reported_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    timeline_entries = relationship("IncidentTimeline", back_populates="incident", cascade="all, delete-orphan")
    resource_assignments = relationship("ResourceAssignment", back_populates="incident")

class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_code = Column(String(50), unique=True, index=True)
    citizen_name = Column(String(255), nullable=False)
    citizen_phone = Column(String(50), nullable=False)
    emergency_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="SUBMITTED")  # SUBMITTED, PENDING_VERIFICATION, VERIFIED, REJECTED
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    photo_url = Column(String(500), nullable=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class IncidentTimeline(Base):
    __tablename__ = "incident_timeline"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status_from = Column(String(50), nullable=True)
    status_to = Column(String(50), nullable=True)
    action_by = Column(String(255), default="System")

    incident = relationship("Incident", back_populates="timeline_entries")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(255), nullable=False)
    resource_type = Column(String(100), nullable=False)  # AMBULANCE, RESCUE_TEAM, FIRE_ENGINE, POLICE_VEHICLE, etc.
    status = Column(String(50), default=ResourceStatusEnum.AVAILABLE.value)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    contact_phone = Column(String(50), nullable=True)
    capacity = Column(Integer, default=4)
    current_incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class ResourceAssignment(Base):
    __tablename__ = "resource_assignments"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    assigned_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(50), default="ASSIGNED")
    notes = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="resource_assignments")
    resource = relationship("Resource")

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    total_beds = Column(Integer, default=100)
    available_beds = Column(Integer, default=20)
    icu_total = Column(Integer, default=20)
    icu_available = Column(Integer, default=5)
    doctors_available = Column(Integer, default=10)
    ambulances_count = Column(Integer, default=3)
    oxygen_available_liters = Column(Float, default=5000.0)
    blood_units = Column(Integer, default=150)
    incoming_patients = Column(Integer, default=0)
    status = Column(String(50), default="OPERATIONAL")
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    max_capacity = Column(Integer, default=500)
    current_occupancy = Column(Integer, default=0)
    food_kits = Column(Integer, default=1000)
    water_liters = Column(Float, default=5000.0)
    medical_kits = Column(Integer, default=50)
    status = Column(String(50), default="AVAILABLE")  # AVAILABLE, NEAR_CAPACITY, FULL
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Road(Base):
    __tablename__ = "roads"

    id = Column(Integer, primary_key=True, index=True)
    road_name = Column(String(255), nullable=False)
    from_node = Column(String(100), nullable=False)
    to_node = Column(String(100), nullable=False)
    distance_km = Column(Float, nullable=False)
    status = Column(String(50), default=RoadStatusEnum.OPEN.value)  # OPEN, BLOCKED, FLOODED
    water_depth_m = Column(Float, default=0.0)
    speed_limit_kmh = Column(Float, default=50.0)
    lat1 = Column(Float, nullable=False)
    lng1 = Column(Float, nullable=False)
    lat2 = Column(Float, nullable=False)
    lng2 = Column(Float, nullable=False)

class IoTSensor(Base):
    __tablename__ = "iot_sensors"

    id = Column(Integer, primary_key=True, index=True)
    sensor_code = Column(String(50), unique=True, index=True)
    sensor_type = Column(String(50), nullable=False)  # WATER_LEVEL, RAINFALL, TEMPERATURE, SMOKE, GAS
    location_name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)
    unit = Column(String(20), default="m")
    warning_threshold = Column(Float, default=3.0)
    critical_threshold = Column(Float, default=4.0)
    status = Column(String(50), default="NORMAL")  # NORMAL, WARNING, CRITICAL
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("iot_sensors.id"), nullable=False)
    value = Column(Float, nullable=False)
    status = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(50), unique=True, index=True)
    title = Column(String(255), nullable=False)
    message_en = Column(Text, nullable=False)
    message_te = Column(Text, nullable=True)
    message_hi = Column(Text, nullable=True)
    severity = Column(String(50), default=SeverityEnum.HIGH.value)
    affected_zone_name = Column(String(255), nullable=True)
    center_lat = Column(Float, nullable=True)
    center_lng = Column(Float, nullable=True)
    radius_km = Column(Float, nullable=True)
    status = Column(String(50), default="ACTIVE")  # ACTIVE, CANCELLED, RESOLVED
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class EvacuationZone(Base):
    __tablename__ = "evacuation_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    population_count = Column(Integer, default=1000)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    radius_km = Column(Float, default=2.0)
    risk_level = Column(String(50), default="HIGH")
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED

class EvacuationPlan(Base):
    __tablename__ = "evacuation_plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_code = Column(String(50), unique=True, index=True)
    zone_id = Column(Integer, ForeignKey("evacuation_zones.id"), nullable=False)
    target_population = Column(Integer, nullable=False)
    assigned_shelter_data = Column(Text, nullable=False)  # JSON string of allocated shelters
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, nullable=True)
    username = Column(String(100), nullable=True)
    role = Column(String(50), nullable=True)
    action = Column(String(255), nullable=False)
    target_type = Column(String(100), nullable=True)
    target_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role_target = Column(String(50), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="INFO")
    incident_id = Column(Integer, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class EmergencyRule(Base):
    __tablename__ = "emergency_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String(255), nullable=False)
    incident_type = Column(String(100), nullable=False)
    water_level_threshold = Column(Float, nullable=True)
    population_threshold = Column(Integer, nullable=True)
    gas_ppm_threshold = Column(Float, nullable=True)
    structural_threat_req = Column(Boolean, default=False)
    severity_output = Column(String(50), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
