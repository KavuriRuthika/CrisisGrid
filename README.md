<<<<<<< HEAD
# Digital Crisis Command Center — Real-Time Emergency Management Platform

An integrated real-time **Digital Crisis Command Center** that brings fragmented emergency information into one centralized platform. It enables authorities to detect incidents, classify severity, calculate priority rankings, coordinate resources, solve safe emergency routes, manage evacuation plans, communicate multilingual warnings, and monitor response metrics from a single command center.

> [!IMPORTANT]
> **PURE FULL-STACK — NO AI / NO ML**
> Built with **100% deterministic rule engines, mathematical formulas (Haversine distance, Dijkstra routing), relational PostgreSQL/SQLite queries, threshold triggers, and predefined scoring algorithms**. Zero AI/ML libraries, LLMs, or external prediction APIs are used.

---

## 🌟 Key Features

1. **Main Command Center Dashboard**: Real-time operational view with live updating top statistics (Active Incidents, Critical, High Priority, Available Ambulances, Rescue Teams, Hospital Beds, Shelter Capacity).
2. **Interactive Crisis Map**: Leaflet & OpenStreetMap powered interactive map displaying 🔴 Fire, 🔵 Flood, 🟠 Accident, 🟡 Warning, 🏥 Hospitals, 🏠 Shelters, 🚑 Ambulances, 👨‍🚒 Rescue teams, 🚧 Blocked roads, and 📍 Citizen reports with custom filters and popups.
3. **Rule-Based Severity Classification Engine**: Configurable thresholds (`app/rules/severity_rules.py`) determining incident severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
4. **Rule-Based Priority Engine**: Calculates exact priority score (0-100+) based on severity, population affected, resource shortage, hospital proximity, road accessibility, and incident duration.
5. **Resource Management & Nearest Allocator**: Haversine distance solver selecting nearest suitable available response unit.
6. **Emergency Route Management**: Dijkstra graph solver finding shortest safe routes while bypassing blocked and flooded road segments.
7. **Citizen Emergency Reporting Portal**: Mobile-optimized portal for citizens to submit location-based reports.
8. **Automated IoT Sensor Telemetry & Threshold Rules**: Ingests readings from Water Level, Rainfall, Temperature, Smoke, and Gas sensors. Automatically triggers critical alerts and incidents when thresholds are breached.
9. **Hospital & Shelter Management**: Real-time tracking of general beds, ICU beds, oxygen levels, blood units, food kits, water supplies, and automatic status changes (`AVAILABLE`, `NEAR_CAPACITY`, `FULL`).
10. **Evacuation Planning Solver**: Allocates affected population into nearby relief shelters based on available capacity and distance.
11. **Rescue Team Field Task Board**: Mobile execution board with action buttons (`ACCEPT ASSIGNMENT`, `START JOURNEY`, `ARRIVED ON SCENE`, `OPERATION COMPLETED`).
12. **Multilingual Emergency Alert System**: Predefined static translation engine supporting English, Telugu (తెలుగు), and Hindi (हिन्दी).
13. **Digital Crisis Simulation Sandbox**: Physics-based formula sandbox for stress-testing disaster variables (rainfall, water levels, population density).
14. **Crisis Analytics & KPIs**: Recharts dashboards comparing response efficiency metrics before system (18 mins) vs after system (11 mins).
15. **Interactive 29-Step Crisis Demo Scenario**: Built-in automated scenario runner executing an end-to-end flood disaster response lifecycle.

---

## 🏗 Technology Stack

- **Backend**: FastAPI (Python 3.10+), Async WebSockets, SQLAlchemy 2.0 ORM, Pydantic V2, Passlib, PyJWT, Pytest
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet / React-Leaflet, Recharts, Lucide Icons, Axios
- **Database**: PostgreSQL / SQLite (Automatic fallback for zero-dependency local execution)
- **Deployment**: Docker, Docker Compose

---

## 🚀 Quick Start Guide

### Option 1: Direct Execution (Python + Node)

1. **Start Backend Server**:
   ```bash
   python app.py
   ```
   *Backend running at http://127.0.0.1:8000*
   *API documentation at http://127.0.0.1:8000/docs*

2. **Start Frontend Dev Server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend running at http://localhost:5173*

---

### Option 2: Docker Compose Deployment

```bash
docker-compose up --build
```

---

## 🧪 Running Automated Tests

Run the complete backend test suite:
```bash
cd backend
python -m pytest -v
```

---

## 👥 Demo Test Accounts (Role-Based Access)

| Role | Username | Password | Purpose |
|---|---|---|---|
| **AUTHORITY** | `authority` | `auth123` | Full Operations Command Center |
| **RESCUE_TEAM** | `rescueteam` | `rescue123` | Rescue Squad Task Execution Board |
| **HOSPITAL** | `hospital` | `hosp123` | Bed & ICU Capacity Management |
| **SHELTER** | `shelter` | `shelter123` | Relief Shelter Occupancy & Supplies |
| **CITIZEN** | `citizen` | `citizen123` | Citizen Emergency Reporting Portal |
| **ADMIN** | `admin` | `admin123` | System Administrator Access |

---

## 📜 Tagline & Motto

**DETECT. COORDINATE. RESPOND. RESOLVE.**
=======
# CrisisGrid
Real-Time Emergency Response &amp; Coordination Platform
>>>>>>> e7c10ed2a7ed87eb6ce29e7a1455af8eca1d1549
