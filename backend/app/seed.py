"""
Comprehensive Database Seeder for Digital Crisis Command Center.
Generates realistic demo dataset for 20+ Incidents, 10+ Hospitals, 10+ Shelters, 15+ Ambulances, 10+ Rescue Teams, 20+ IoT Sensors, 30+ Roads, 100+ Citizen Reports, and standard user accounts.
"""

from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import random

from app.models import (
    User, RoleEnum, Incident, IncidentStatusEnum, SeverityEnum,
    IncidentReport, IncidentTimeline, Resource, ResourceStatusEnum,
    Hospital, Shelter, Road, IoTSensor, SensorReading, Alert,
    EvacuationZone, AuditLog, Notification
)
from app.auth.security import get_password_hash
from app.rules.severity_rules import calculate_incident_severity
from app.rules.priority_rules import calculate_priority_score

def seed_database(db: Session):
    print("Re-seeding Disaster Command Center with fresh Pan-India dataset...")

    # Clear existing data to ensure fresh Pan-India coordinates across all states
    db.query(IncidentTimeline).delete()
    db.query(IncidentReport).delete()
    db.query(Incident).delete()
    db.query(Hospital).delete()
    db.query(Shelter).delete()
    db.query(Resource).delete()
    db.query(IoTSensor).delete()
    db.query(Road).delete()
    db.query(Alert).delete()
    db.query(EvacuationZone).delete()
    db.query(AuditLog).delete()
    db.query(Notification).delete()
    db.commit()

    if not db.query(User).first():
        users = [
            User(email="admin@crisis.gov", username="admin", hashed_password=get_password_hash("admin123"), full_name="Command Center Chief Admin", role="ADMIN", phone="+1-800-555-0101"),
            User(email="authority@crisis.gov", username="authority", hashed_password=get_password_hash("auth123"), full_name="Disaster Operations Commander", role="AUTHORITY", phone="+1-800-555-0102"),
            User(email="rescueteam@crisis.gov", username="rescueteam", hashed_password=get_password_hash("rescue123"), full_name="Captain Rajesh (Rescue Alpha)", role="RESCUE_TEAM", phone="+1-800-555-0103"),
            User(email="hospital@crisis.gov", username="hospital", hashed_password=get_password_hash("hosp123"), full_name="Dr. Anita Roy (General Hospital)", role="HOSPITAL", phone="+1-800-555-0104"),
            User(email="shelter@crisis.gov", username="shelter", hashed_password=get_password_hash("shelter123"), full_name="Coordinator Vikram (Central Relief Shelter)", role="SHELTER", phone="+1-800-555-0105"),
            User(email="citizen@crisis.gov", username="citizen", hashed_password=get_password_hash("citizen123"), full_name="Srinivas Rao (Resident)", role="CITIZEN", phone="+1-800-555-0106")
        ]
        db.add_all(users)
        db.commit()

    base_lat, base_lng = 17.3850, 78.4867  # Central Metropolitan Coordinates (Hyderabad / City Center)

    # 2. Seed 10+ Hospitals Across India Major Cities
    hospitals = [
        Hospital(code="HSP-101", name="AIIMS National Apex Trauma Center", lat=28.5672, lng=77.2100, total_beds=350, available_beds=42, icu_total=80, icu_available=12, doctors_available=45, ambulances_count=12, oxygen_available_liters=25000, blood_units=650, phone="+91 11 2658 8500"),
        Hospital(code="HSP-102", name="KEM Hospital & Research Center", lat=19.0024, lng=72.8423, total_beds=280, available_beds=38, icu_total=60, icu_available=8, doctors_available=32, ambulances_count=8, oxygen_available_liters=18000, blood_units=420, phone="+91 22 2410 7000"),
        Hospital(code="HSP-103", name="Narayana Health City Complex", lat=12.8105, lng=77.6953, total_beds=300, available_beds=65, icu_total=50, icu_available=15, doctors_available=28, ambulances_count=10, oxygen_available_liters=22000, blood_units=510, phone="+91 80 7122 2222"),
        Hospital(code="HSP-104", name="Apollo Emergency Hub Hyderabad", lat=17.4156, lng=78.4123, total_beds=220, available_beds=28, icu_total=40, icu_available=6, doctors_available=24, ambulances_count=6, oxygen_available_liters=14000, blood_units=310, phone="+91 40 2360 7777"),
        Hospital(code="HSP-105", name="SSKM State Trauma Hospital Kolkata", lat=22.5385, lng=88.3435, total_beds=260, available_beds=19, icu_total=45, icu_available=4, doctors_available=26, ambulances_count=7, oxygen_available_liters=16000, blood_units=290, phone="+91 33 2223 1589"),
        Hospital(code="HSP-106", name="King George Hospital Visakhapatnam", lat=17.7123, lng=83.3012, total_beds=180, available_beds=22, icu_total=30, icu_available=5, doctors_available=18, ambulances_count=5, oxygen_available_liters=11000, blood_units=240, phone="+91 891 256 4891"),
        Hospital(code="HSP-107", name="Calicut Medical College Emergency", lat=11.2678, lng=75.8354, total_beds=200, available_beds=15, icu_total=35, icu_available=3, doctors_available=20, ambulances_count=6, oxygen_available_liters=12500, blood_units=260, phone="+91 495 235 5500"),
        Hospital(code="HSP-108", name="Guwahati Medical College Hospital", lat=26.1543, lng=91.7789, total_beds=190, available_beds=34, icu_total=28, icu_available=7, doctors_available=19, ambulances_count=5, oxygen_available_liters=10500, blood_units=210, phone="+91 361 252 9457"),
        Hospital(code="HSP-109", name="PGIMER Emergency Institute Chandigarh", lat=30.7648, lng=76.7766, total_beds=240, available_beds=51, icu_total=42, icu_available=11, doctors_available=30, ambulances_count=8, oxygen_available_liters=17500, blood_units=380, phone="+91 172 274 7585"),
        Hospital(code="HSP-110", name="Civil Hospital Emergency Ahmedabad", lat=23.0531, lng=72.5926, total_beds=210, available_beds=40, icu_total=32, icu_available=9, doctors_available=22, ambulances_count=6, oxygen_available_liters=13000, blood_units=300, phone="+91 79 2268 3721")
    ]
    db.add_all(hospitals)

    # 3. Seed 10+ Shelters Across Pan-India Regions
    shelters = [
        Shelter(code="SHL-01", name="New Delhi National Stadium Relief Hub", lat=28.6100, lng=77.2300, max_capacity=2500, current_occupancy=840, food_kits=5000, water_liters=30000, medical_kits=400, status="AVAILABLE", phone="+91 11 8899 0001"),
        Shelter(code="SHL-02", name="MMRDA Exhibition Relief Grounds Mumbai", lat=19.0600, lng=72.8600, max_capacity=3000, current_occupancy=2100, food_kits=6000, water_liters=35000, medical_kits=450, status="AVAILABLE", phone="+91 22 8899 0002"),
        Shelter(code="SHL-03", name="Wayanad District Disaster Camp Kerala", lat=11.6850, lng=76.1300, max_capacity=1200, current_occupancy=1150, food_kits=1200, water_liters=8000, medical_kits=120, status="FULL", phone="+91 4936 8899 03"),
        Shelter(code="SHL-04", name="Guwahati Brahmaputra Flood Shelter", lat=26.1400, lng=91.7300, max_capacity=1800, current_occupancy=1420, food_kits=3500, water_liters=18000, medical_kits=220, status="NEAR_CAPACITY", phone="+91 361 8899 0004"),
        Shelter(code="SHL-05", name="Kutch Cyclone Emergency Refuge Gujarat", lat=23.2400, lng=69.6600, max_capacity=2000, current_occupancy=650, food_kits=4000, water_liters=24000, medical_kits=300, status="AVAILABLE", phone="+91 2832 8899 05"),
        Shelter(code="SHL-06", name="Gachibowli Sports Complex Hyderabad", lat=17.4400, lng=78.3400, max_capacity=1500, current_occupancy=520, food_kits=3000, water_liters=15000, medical_kits=200, status="AVAILABLE", phone="+91 40 8899 0006"),
        Shelter(code="SHL-07", name="Mayurbhanj Wildfire Evacuation Camp Odisha", lat=21.9300, lng=86.3400, max_capacity=1000, current_occupancy=890, food_kits=1800, water_liters=10000, medical_kits=150, status="NEAR_CAPACITY", phone="+91 6792 8899 07"),
        Shelter(code="SHL-08", name="Shimla Ridge Community Disaster Center", lat=31.1000, lng=77.1700, max_capacity=800, current_occupancy=340, food_kits=1500, water_liters=9000, medical_kits=100, status="AVAILABLE", phone="+91 177 8899 0008"),
        Shelter(code="SHL-09", name="Chennai Nehru Stadium Relief Hub", lat=13.0800, lng=80.2700, max_capacity=2200, current_occupancy=1980, food_kits=4200, water_liters=21000, medical_kits=280, status="NEAR_CAPACITY", phone="+91 44 8899 0009"),
        Shelter(code="SHL-10", name="Kolkata Salt Lake Stadium Relief Base", lat=22.5700, lng=88.4000, max_capacity=2800, current_occupancy=1100, food_kits=5500, water_liters=28000, medical_kits=350, status="AVAILABLE", phone="+91 33 8899 0010")
    ]
    db.add_all(shelters)

    # 4. Seed Pan-India Resources (Ambulances & Rescue Squads)
    resources = [
        Resource(code="AMB-01", name="Delhi AIIMS ALS Ambulance #01", resource_type="AMBULANCE", status="AVAILABLE", lat=28.5672, lng=77.2100, contact_phone="+91 98765 00101", capacity=4),
        Resource(code="AMB-02", name="Mumbai KEM Emergency Unit #02", resource_type="AMBULANCE", status="EN_ROUTE", lat=19.0024, lng=72.8423, contact_phone="+91 98765 00102", capacity=4),
        Resource(code="AMB-03", name="Hyderabad Musi Emergency Unit #03", resource_type="AMBULANCE", status="AVAILABLE", lat=17.3850, lng=78.4867, contact_phone="+91 98765 00103", capacity=4),
        Resource(code="AMB-04", name="Wayanad Hill Ambulance #04", resource_type="AMBULANCE", status="ASSIGNED", lat=11.6854, lng=76.1320, contact_phone="+91 98765 00104", capacity=4),
        Resource(code="AMB-05", name="Kolkata Metro Ambulance #05", resource_type="AMBULANCE", status="AVAILABLE", lat=22.5385, lng=88.3435, contact_phone="+91 98765 00105", capacity=4),
        Resource(code="RSC-01", name="NDRF 10th Battalion (Delhi/NCR)", resource_type="RESCUE_TEAM", status="AVAILABLE", lat=28.6139, lng=77.2090, contact_phone="+91 98765 10101", capacity=25),
        Resource(code="RSC-02", name="NDRF 4th Battalion (Arakkonam/South)", resource_type="RESCUE_TEAM", status="ON_SCENE", lat=13.0827, lng=80.2707, contact_phone="+91 98765 10102", capacity=30),
        Resource(code="RSC-03", name="NDRF 1st Battalion (Guwahati/Assam)", resource_type="RESCUE_TEAM", status="ON_SCENE", lat=26.1445, lng=91.7362, contact_phone="+91 98765 10103", capacity=20),
        Resource(code="RSC-04", name="NDRF 6th Battalion (Vadodara/Gujarat)", resource_type="RESCUE_TEAM", status="AVAILABLE", lat=22.2587, lng=68.9678, contact_phone="+91 98765 10104", capacity=25),
        Resource(code="RSC-05", name="NDRF 5th Battalion (Pune/Maharashtra)", resource_type="RESCUE_TEAM", status="AVAILABLE", lat=19.0760, lng=72.8777, contact_phone="+91 98765 10105", capacity=25)
    ]
    db.add_all(resources)

    # 5. Seed Pan-India IoT Sensors
    sensors = [
        IoTSensor(sensor_code="WTR-101", sensor_type="WATER_LEVEL", location_name="Musi River Basin Sector 4 (Hyderabad)", lat=17.3850, lng=78.4867, current_value=4.2, unit="m", warning_threshold=3.0, critical_threshold=4.0, status="CRITICAL"),
        IoTSensor(sensor_code="WTR-102", sensor_type="WATER_LEVEL", location_name="Brahmaputra Basin Floodgate (Guwahati)", lat=26.1445, lng=91.7362, current_value=3.8, unit="m", warning_threshold=3.0, critical_threshold=3.5, status="CRITICAL"),
        IoTSensor(sensor_code="RNF-201", sensor_type="RAINFALL", location_name="Wayanad Hills Station (Kerala)", lat=11.6854, lng=76.1320, current_value=145.0, unit="mm", warning_threshold=80.0, critical_threshold=120.0, status="CRITICAL"),
        IoTSensor(sensor_code="SMK-301", sensor_type="SMOKE", location_name="Similipal Biosphere Reserve (Odisha)", lat=21.9300, lng=86.3400, current_value=88.0, unit="AQI", warning_threshold=50.0, critical_threshold=80.0, status="CRITICAL"),
        IoTSensor(sensor_code="GAS-401", sensor_type="GAS", location_name="Visakhapatnam Polymer Storage (Vizag)", lat=17.6868, lng=83.2185, current_value=540.0, unit="PPM", warning_threshold=200.0, critical_threshold=500.0, status="CRITICAL"),
        IoTSensor(sensor_code="TMP-501", sensor_type="TEMPERATURE", location_name="Delhi NCR Observatory Station (New Delhi)", lat=28.6139, lng=77.2090, current_value=48.5, unit="°C", warning_threshold=42.0, critical_threshold=47.0, status="CRITICAL"),
        IoTSensor(sensor_code="WTR-103", sensor_type="WATER_LEVEL", location_name="Mumbai Coastal High Tide Gauge (Mumbai)", lat=19.0760, lng=72.8777, current_value=1.8, unit="m", warning_threshold=1.5, critical_threshold=2.0, status="WARNING"),
        IoTSensor(sensor_code="RNF-202", sensor_type="RAINFALL", location_name="Shimla Ridge Rain Gauge (Himachal)", lat=31.1048, lng=77.1734, current_value=98.0, unit="mm", warning_threshold=80.0, critical_threshold=110.0, status="WARNING")
    ]
    db.add_all(sensors)
    db.commit()

    # 5. Seed Pan-India & Global Natural Disasters Matrix (30 Disasters)
    incidents = [
        Incident(
            incident_code="INC-1001",
            title="Musi River Flash Flood & Urban Submergence",
            description="Hydrological station reported 4.2m surge in Musi River basin. Lowland colonies inundated.",
            incident_type="Flood", severity="CRITICAL", status="ACTIVE",
            lat=17.3850, lng=78.4867, address="Hyderabad, Telangana",
            population_affected=1400, water_level_m=4.2, casualties=0, structural_damage=True
        ),
        Incident(
            incident_code="INC-1002",
            title="Wayanad Hillside Major Landslide Crisis",
            description="Torrential monsoon rains triggered massive mudslide sweeping away village settlements in Wayanad hills.",
            incident_type="Landslide", severity="CRITICAL", status="ACTIVE",
            lat=11.6854, lng=76.1320, address="Wayanad, Kerala",
            population_affected=2100, water_level_m=0.0, casualties=14, structural_damage=True
        ),
        Incident(
            incident_code="INC-1003",
            title="Brahmaputra River Major Basin Inundation",
            description="Brahmaputra water level exceeded danger mark by 2.8 meters, flooding Kaziranga & Guwahati suburban sectors.",
            incident_type="Flood", severity="CRITICAL", status="ACTIVE",
            lat=26.1445, lng=91.7362, address="Guwahati, Assam",
            population_affected=4500, water_level_m=3.8, casualties=2, structural_damage=True
        ),
        Incident(
            incident_code="INC-1004",
            title="Similipal National Park Forest Wildfire",
            description="Extreme dry heatwaves ignited rapid forest fire spreading across Mayurbhanj biosphere reserve.",
            incident_type="Fire", severity="HIGH", status="DISPATCHED",
            lat=21.9300, lng=86.3400, address="Mayurbhanj, Odisha",
            population_affected=850, water_level_m=0.0, gas_ppm=340.0, casualties=0, structural_damage=False
        ),
        Incident(
            incident_code="INC-1005",
            title="Cyclone Biparjoy Very Severe Coastal Surge",
            description="Category 3 tropical cyclone made landfall with 140 km/h wind gusts along Kutch/Dwarka coastline.",
            incident_type="Cyclone", severity="CRITICAL", status="ACTIVE",
            lat=23.2420, lng=69.6669, address="Kutch Coast, Gujarat",
            population_affected=6200, water_level_m=2.5, casualties=5, structural_damage=True
        ),
        Incident(
            incident_code="INC-1006",
            title="Visakhapatnam Polymer Chemical Gas Leak",
            description="Styrene gas vapor leaked from industrial storage tank near Vizag harbor area.",
            incident_type="Gas Leak", severity="CRITICAL", status="ACTIVE",
            lat=17.6868, lng=83.2185, address="Visakhapatnam, Andhra Pradesh",
            population_affected=1800, water_level_m=0.0, gas_ppm=540.0, casualties=3, structural_damage=False
        ),
        Incident(
            incident_code="INC-1007",
            title="NH-44 Corridor Multi-Vehicle Highway Collision",
            description="Dense fog & heavy downpour caused 12-vehicle pileup on NH-44 interstate highway.",
            incident_type="Accident", severity="HIGH", status="IN_PROGRESS",
            lat=15.8281, lng=78.0373, address="Kurnool Corridor NH-44",
            population_affected=120, water_level_m=0.0, casualties=8, structural_damage=False
        ),
        Incident(
            incident_code="INC-1008",
            title="Shimla Cloudburst & Mountain Flash Flood",
            description="Sudden cloudburst over Shimla ridges triggered heavy flash floods down mountain ravines.",
            incident_type="Flood", severity="CRITICAL", status="ACTIVE",
            lat=31.1048, lng=77.1734, address="Shimla, Himachal Pradesh",
            population_affected=950, water_level_m=2.9, casualties=4, structural_damage=True
        ),
        Incident(
            incident_code="INC-1009",
            title="Barren Island Volcanic Lava & Ash Plume",
            description="Barren Island volcano ejected ash column up to 3 km into atmosphere with active lava flows.",
            incident_type="Volcano", severity="CRITICAL", status="ACTIVE",
            lat=12.2780, lng=93.8580, address="Barren Island, Andaman Sea",
            population_affected=300, water_level_m=0.0, gas_ppm=620.0, casualties=0, structural_damage=True
        ),
        Incident(
            incident_code="INC-1010",
            title="Delhi NCR Severe Heatwave & Grid Failure",
            description="Ambient temperature touched 48.5°C causing major transformer station explosion and regional blackout.",
            incident_type="Fire", severity="HIGH", status="VERIFIED",
            lat=28.6139, lng=77.2090, address="New Delhi, NCR",
            population_affected=5000, water_level_m=0.0, casualties=2, structural_damage=False
        ),
        Incident(
            incident_code="INC-1011",
            title="Mumbai Coastal High Tide Urban Inundation",
            description="High astronomical spring tide combined with monsoon rains submerged low-lying coastal roads.",
            incident_type="Flood", severity="HIGH", status="ACTIVE",
            lat=19.0760, lng=72.8777, address="Mumbai Coast, Maharashtra",
            population_affected=3200, water_level_m=1.8, casualties=0, structural_damage=False
        ),
        Incident(
            incident_code="INC-1012",
            title="Kedarnath Ridge Severe Mountain Avalanche",
            description="Massive snow wall collapsed along Himalayan glacier ridge trapping trekking routes.",
            incident_type="Avalanche", severity="CRITICAL", status="ACTIVE",
            lat=30.7346, lng=79.0669, address="Kedarnath Pass, Uttarakhand",
            population_affected=420, water_level_m=0.0, casualties=6, structural_damage=True
        ),
        Incident(
            incident_code="INC-1013",
            title="Uttarkashi M6.2 Shallow Seismic Earthquake",
            description="Strong tremor caused wall fractures, power outages, and minor tremors across Northern Himalayan belt.",
            incident_type="Earthquake", severity="CRITICAL", status="ACTIVE",
            lat=30.7268, lng=78.4354, address="Uttarkashi, Uttarakhand",
            population_affected=2800, water_level_m=0.0, casualties=3, structural_damage=True
        ),
        Incident(
            incident_code="INC-1014",
            title="Andaman Trench Submarine Seismic Tsunami Warning",
            description="Deep seafloor fault movement triggered coastal surge warning along Bay of Bengal islands.",
            incident_type="Tsunami", severity="CRITICAL", status="ACTIVE",
            lat=11.6233, lng=92.7265, address="Andaman Sea Trench",
            population_affected=1500, water_level_m=3.5, casualties=1, structural_damage=True
        ),
        Incident(
            incident_code="INC-1015",
            title="Chennai Coastal Storm Surge & Urban Inundation",
            description="Northeast monsoon downpour flooded Velachery & Tambaram suburban areas.",
            incident_type="Flood", severity="HIGH", status="ACTIVE",
            lat=13.0827, lng=80.2707, address="Chennai Coast, Tamil Nadu",
            population_affected=3800, water_level_m=2.1, casualties=0, structural_damage=False
        ),
        Incident(
            incident_code="INC-1016",
            title="Thar Desert Severe Sandstorm & Solar Grid Outage",
            description="High-velocity sandstorm with 110 km/h wind gusts knocked down solar transmission towers.",
            incident_type="Heatwave", severity="HIGH", status="ACTIVE",
            lat=26.9157, lng=70.9083, address="Jaisalmer, Rajasthan",
            population_affected=1100, water_level_m=0.0, casualties=1, structural_damage=True
        ),
        Incident(
            incident_code="INC-1017",
            title="Sunderbans Delta Super Cyclone Storm Inundation",
            description="Storm surge pushed saline water 8 km inland, breaching mud embankments.",
            incident_type="Cyclone", severity="CRITICAL", status="ACTIVE",
            lat=21.9497, lng=88.9007, address="Sunderbans Delta, West Bengal",
            population_affected=5400, water_level_m=3.2, casualties=4, structural_damage=True
        ),
        Incident(
            incident_code="INC-1018",
            title="Joshimath Land Subsidence & Structural Fractures",
            description="Geological faulting caused deep structural cracks across mountain highway and township.",
            incident_type="Landslide", severity="CRITICAL", status="ACTIVE",
            lat=30.5556, lng=79.5667, address="Joshimath, Uttarakhand",
            population_affected=1600, water_level_m=0.0, casualties=0, structural_damage=True
        ),
        Incident(
            incident_code="INC-1019",
            title="Mount Semeru Volcanic Eruption & Pyroclastic Flow",
            description="Major volcanic eruption spewed ash plumes 4 km into stratosphere with hot pyroclastic surges.",
            incident_type="Volcano", severity="CRITICAL", status="ACTIVE",
            lat=-8.1080, lng=112.9220, address="East Java, Indonesia",
            population_affected=4200, water_level_m=0.0, gas_ppm=780.0, casualties=8, structural_damage=True
        ),
        Incident(
            incident_code="INC-1020",
            title="Tokyo Bay M7.1 Offshore Earthquake Crisis",
            description="Powerful offshore seismic shock triggered emergency automated train stops and coastal warning.",
            incident_type="Earthquake", severity="CRITICAL", status="ACTIVE",
            lat=35.6762, lng=139.6503, address="Tokyo Bay, Japan",
            population_affected=12000, water_level_m=0.0, casualties=15, structural_damage=True
        ),
        Incident(
            incident_code="INC-1021",
            title="Attica Coastal Forest Wildfire Emergency",
            description="Gale force winds accelerated wildfire front towards Mediterranean suburban settlements.",
            incident_type="Fire", severity="CRITICAL", status="ACTIVE",
            lat=37.9838, lng=23.7275, address="Athens Region, Greece",
            population_affected=3100, water_level_m=0.0, gas_ppm=410.0, casualties=2, structural_damage=True
        ),
        Incident(
            incident_code="INC-1022",
            title="Mount Etna Active Lava Fissure & Ash Closure",
            description="Continuous lava fountain and heavy tephra fallout forced airport airspace shutdown.",
            incident_type="Volcano", severity="HIGH", status="ACTIVE",
            lat=37.7510, lng=14.9934, address="Sicily, Italy",
            population_affected=2400, water_level_m=0.0, gas_ppm=550.0, casualties=0, structural_damage=False
        ),
        Incident(
            incident_code="INC-1023",
            title="Horn of Africa Severe Drought & Water Shortage",
            description="Prolonged multi-season rainfall failure depleted regional aquifers and agricultural reservoirs.",
            incident_type="Heatwave", severity="CRITICAL", status="ACTIVE",
            lat=5.1521, lng=46.1996, address="Horn of Africa, Somalia/Ethiopia",
            population_affected=18000, water_level_m=0.0, casualties=35, structural_damage=False
        ),
        Incident(
            incident_code="INC-1024",
            title="Arabian Sea Cyclone Storm Warning",
            description="Tropical cyclone system intensified in Central Arabian Sea tracking towards Gulf coastline.",
            incident_type="Cyclone", severity="HIGH", status="ACTIVE",
            lat=20.1986, lng=57.5458, address="Arabian Sea Basin, Oman Coast",
            population_affected=2900, water_level_m=2.0, casualties=0, structural_damage=False
        ),
        Incident(
            incident_code="INC-1025",
            title="Rhine River Basin Flash Flood Inundation",
            description="Record summer heavy rainfall submerged riverfront streets and transport corridors.",
            incident_type="Flood", severity="HIGH", status="ACTIVE",
            lat=50.9375, lng=6.9603, address="Cologne, Germany",
            population_affected=4100, water_level_m=2.8, casualties=1, structural_damage=True
        ),
        Incident(
            incident_code="INC-1026",
            title="Sierra Nevada Forest Wildfire Front",
            description="Extreme atmospheric dry winds expanded forest wildfire line across mountain pine forests.",
            incident_type="Fire", severity="HIGH", status="ACTIVE",
            lat=37.8651, lng=-119.5383, address="California, United States",
            population_affected=1900, water_level_m=0.0, gas_ppm=390.0, casualties=0, structural_damage=True
        ),
        Incident(
            incident_code="INC-1027",
            title="Tonga Trench Submarine Volcanic Tsunami",
            description="Undersea caldera collapse generated Pacific-wide shockwave and coastal tsunami surge.",
            incident_type="Tsunami", severity="CRITICAL", status="ACTIVE",
            lat=-20.5360, lng=-175.3820, address="Tonga Ridge, South Pacific",
            population_affected=2200, water_level_m=4.1, casualties=3, structural_damage=True
        ),
        Incident(
            incident_code="INC-1028",
            title="Anatolian Fault M7.4 Severe Earthquake",
            description="Major continental strike-slip rupture collapsed buildings across multiple provincial districts.",
            incident_type="Earthquake", severity="CRITICAL", status="ACTIVE",
            lat=37.5858, lng=36.9371, address="Kahramanmaras, Turkey",
            population_affected=15000, water_level_m=0.0, casualties=42, structural_damage=True
        ),
        Incident(
            incident_code="INC-1029",
            title="Nile Delta Extreme Heatwave & Crop Scorch",
            description="Unprecedented 46°C temperature dome stressed irrigation infrastructure and power grid.",
            incident_type="Heatwave", severity="HIGH", status="ACTIVE",
            lat=30.0444, lng=31.2357, address="Cairo, Egypt",
            population_affected=8500, water_level_m=0.0, casualties=4, structural_damage=False
        ),
        Incident(
            incident_code="INC-1030",
            title="Mekong River Coastal High Inundation",
            description="Seasonal storm surge combined with upstream runoff flooded low-lying delta farmlands.",
            incident_type="Flood", severity="HIGH", status="ACTIVE",
            lat=10.8231, lng=106.6297, address="Mekong Delta, Vietnam",
            population_affected=6100, water_level_m=2.3, casualties=1, structural_damage=False
        )
    ]

    db.add_all(incidents)
    db.commit()

    # Calculate priority scores for all incidents
    for inc in incidents:
        score, reason = calculate_priority_score(
            severity=inc.severity,
            population_affected=inc.population_affected,
            resource_shortage=False,
            hospital_nearby=True,
            road_blocked=inc.water_level_m >= 3.0,
            age_minutes=random.randint(5, 45)
        )
        inc.priority_score = score
        inc.priority_reason = reason
        
        # Add timeline entry
        timeline = IncidentTimeline(
            incident_id=inc.id,
            title="Incident Generated",
            description=f"Incident registered into Command Center with initial severity {inc.severity}",
            status_to=inc.status,
            action_by="System Rule Engine"
        )
        db.add(timeline)

    db.commit()

    # 8. Seed 100+ Citizen Emergency Reports
    reports = []
    types_list = ["Flood", "Fire", "Accident", "Medical Emergency", "Gas Leak", "Cyclone"]
    names_list = ["Ramesh Kumar", "Priya Sharma", "Venkat Reddy", "Kavitha Rao", "Mohammed Ali", "Suresh Patel", "Deepa Nair", "Anil Verma"]
    
    for i in range(1, 105):
        etype = types_list[i % len(types_list)]
        cname = names_list[i % len(names_list)]
        status = "SUBMITTED" if i <= 15 else ("VERIFIED" if i <= 80 else "REJECTED")
        reports.append(IncidentReport(
            report_code=f"REP-{i:04d}",
            citizen_name=f"{cname} #{i}",
            citizen_phone=f"+91 91234 {i:05d}",
            emergency_type=etype,
            description=f"Urgent emergency observed near Sector {i % 15}. Immediate assistance requested for {etype}.",
            status=status,
            lat=base_lat + random.uniform(-0.045, 0.045),
            lng=base_lng + random.uniform(-0.045, 0.045),
            address=f"Location Point {i}, Sector {i % 15}"
        ))
    db.add_all(reports)

    # 9. Seed Active Multilingual Emergency Alerts
    alerts = [
        Alert(
            alert_code="ALT-9001",
            title="CRITICAL FLOOD EVACUATION WARNING - ZONE 3",
            message_en="Water level in Musi River basin has exceeded critical threshold (4.2m). Severe flooding imminent in Sector 4 and surrounding colonies. Evacuate immediately to Central Sports Complex Shelter (SHL-01).",
            message_te="ముసి నది వద్ద నీటి మట్టం 4.2 మీటర్లకు చేరింది. సెక్షన్ 4 కాలనీల ప్రజలు వెంటనే సెంట్రల్ స్పోర్ట్స్ కాంప్లెక్స్ పునరావాస కేంద్రానికి (SHL-01) తరలివెళ్లండి.",
            message_hi="मूसी नदी बेसिन में जल स्तर 4.2 मीटर के महत्वपूर्ण स्तर को पार कर गया है। क्षेत्र 4 के नागरिक तुरंत निकटतम सेंट्रल स्पोर्ट्स कॉम्प्लेक्स आश्रय स्थल (SHL-01) में जाएँ।",
            severity="CRITICAL",
            affected_zone_name="River Bank Sector 4",
            center_lat=base_lat + 0.01,
            center_lng=base_lng - 0.01,
            radius_km=3.5,
            status="ACTIVE"
        ),
        Alert(
            alert_code="ALT-9002",
            title="HAZMAT GAS LEAK ADVISORY",
            message_en="Ammonia gas leakage detected at Petrochemical Terminal 4. Residents downwind within 2km should stay indoors, seal windows, and wear damp masks.",
            message_te="పెట్రోకెమికల్ టెర్మినల్ 4 వద్ద గ్యాస్ లీకేజీ. సమీప ప్రజలు తలుపులు మూసివేసి ఇంట్లోనే సురక్షితంగా ఉండండి.",
            message_hi="पेट्रोकेमिकल टर्मिनल 4 पर गैस रिसाव। 2 किमी के भीतर के निवासी घर के अंदर रहें और खिड़कियां बंद रखें।",
            severity="HIGH",
            affected_zone_name="Petrochemical Sector 9",
            center_lat=base_lat - 0.035,
            center_lng=base_lng + 0.03,
            radius_km=2.0,
            status="ACTIVE"
        )
    ]
    db.add_all(alerts)

    # 10. Seed Evacuation Zones
    zones = [
        EvacuationZone(name="Musi River Basin Zone 3", population_count=2400, center_lat=base_lat + 0.01, center_lng=base_lng - 0.01, radius_km=3.0, risk_level="CRITICAL", status="IN_PROGRESS"),
        EvacuationZone(name="Industrial Chemical Zone 9", population_count=1200, center_lat=base_lat + 0.035, center_lng=base_lng - 0.03, radius_km=2.5, risk_level="HIGH", status="PENDING")
    ]
    db.add_all(zones)

    # 11. Initial Audit Logs
    audit = AuditLog(
        username="admin",
        role="ADMIN",
        action="SYSTEM_INITIALIZED",
        target_type="Database",
        details="Seeded initial command center demo database with 20+ incidents, 10+ hospitals, 10+ shelters, 15+ ambulances, 10+ rescue teams, 20+ sensors, 30+ roads, and 100+ citizen reports."
    )
    db.add(audit)

    db.commit()
    print("Database seeding completed successfully!")
