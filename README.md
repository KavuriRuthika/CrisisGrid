# CrisisGrid: Real-Time Emergency Response & Coordination Platform

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
14. **Crisis Analytics & KPIs**: Dashboards comparing response efficiency metrics before system (18 mins) vs after system (11 mins).
15. **Interactive 29-Step Crisis Demo Scenario**: Built-in automated scenario runner executing an end-to-end flood disaster response lifecycle.

---

## 🏗 Technology Stack

- **Backend**: FastAPI (Python 3.10+), Async WebSockets, SQLAlchemy 2.0 ORM, Pydantic V2
- **Frontend**: HTML5, Vanilla JavaScript, CSS3, Leaflet.js
- **Database**: PostgreSQL / SQLite (Automatic fallback for zero-dependency local execution)

---

## 🚀 Quick Start Guide

### Direct Execution

1. **Start Backend Server**:
   ```bash
   python app.py
   ```
   *Backend running at http://127.0.0.1:8000*

---

## 📜 Tagline & Motto

**DETECT. COORDINATE. RESPOND. RESOLVE.**
