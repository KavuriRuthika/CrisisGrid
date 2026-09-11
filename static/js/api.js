/* Pure JavaScript API & WebSocket Client for Command Center */

const API_BASE = '/api';

// In-Memory & LocalStorage persistent fallback for static deployments (Netlify/Vercel/GitHub Pages)
const MockStore = {
  get(key, defaultValue) {
    try {
      const stored = localStorage.getItem('crisisgrid_' + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('crisisgrid_' + key, JSON.stringify(value));
    } catch (e) {}
  }
};

// Initial Mock Datasets
const defaultIncidents = [
  { id: 1, incident_code: "INC-1001", title: "Musi River Submerged Houses Flood", disaster_type: "FLOOD", severity: "CRITICAL", priority_score: 85.0, status: "ACTIVE", lat: 17.3850, lng: 78.4866, location_name: "Musi River Bank, Sector 4", description: "Water level rose 4.2m inundating residential houses.", affected_population: 1200 },
  { id: 2, incident_code: "INC-1002", title: "Industrial Chemical Tanker Leak", disaster_type: "ACCIDENT", severity: "HIGH", priority_score: 72.5, status: "ACTIVE", lat: 17.4400, lng: 78.3480, location_name: "HITEC Industrial Corridor", description: "Tanker spill blocking main access highway.", affected_population: 450 },
  { id: 3, incident_code: "INC-1003", title: "Commercial Complex Electrical Fire", disaster_type: "FIRE", severity: "HIGH", priority_score: 68.0, status: "ACTIVE", lat: 17.4440, lng: 78.4680, location_name: "Begumpet Commercial Zone", description: "Transformer blast causing structure fire.", affected_population: 300 },
  { id: 4, incident_code: "INC-1004", title: "Old City Structural Collapse Warning", disaster_type: "WARNING", severity: "MEDIUM", priority_score: 45.0, status: "ACTIVE", lat: 17.3616, lng: 78.4747, location_name: "Charminar Heritage Area", description: "Dilapidated building walls showing deep cracks.", affected_population: 150 }
];

const defaultHospitals = [
  { id: 1, name: "Osmania General Hospital", lat: 17.3730, lng: 78.4750, available_beds: 18, icu_beds: 4, status: "AVAILABLE" },
  { id: 2, name: "Gandhi Hospital", lat: 17.4240, lng: 78.5030, available_beds: 30, icu_beds: 8, status: "AVAILABLE" },
  { id: 3, name: "NIMS Punjagutta", lat: 17.4245, lng: 78.4520, available_beds: 12, icu_beds: 2, status: "AVAILABLE" },
  { id: 4, name: "Apollo Hospitals Jubilee Hills", lat: 17.4160, lng: 78.4110, available_beds: 25, icu_beds: 6, status: "AVAILABLE" }
];

const defaultShelters = [
  { id: 1, name: "Gachibowli Indoor Stadium Relief Center", lat: 17.4430, lng: 78.3480, capacity: 1000, current_occupancy: 420, status: "AVAILABLE" },
  { id: 2, name: "LB Stadium Relief Camp", lat: 17.3970, lng: 78.4750, capacity: 800, current_occupancy: 310, status: "AVAILABLE" },
  { id: 3, name: "Begumpet High School Relief Center", lat: 17.4440, lng: 78.4680, capacity: 600, current_occupancy: 150, status: "AVAILABLE" }
];

const defaultResources = [
  { id: 1, name: "NDRF Rescue Squad T01", resource_type: "RESCUE_TEAM", status: "AVAILABLE", lat: 17.3900, lng: 78.4800 },
  { id: 2, name: "NDRF Rescue Squad T02", resource_type: "RESCUE_TEAM", status: "AVAILABLE", lat: 17.4300, lng: 78.4500 },
  { id: 3, name: "Emergency Ambulance AMB-01", resource_type: "AMBULANCE", status: "AVAILABLE", lat: 17.3750, lng: 78.4730 },
  { id: 4, name: "Emergency Ambulance AMB-04", resource_type: "AMBULANCE", status: "AVAILABLE", lat: 17.4200, lng: 78.5000 }
];

const defaultSensors = [
  { id: 1, sensor_code: "WTR-101", sensor_type: "WATER_LEVEL", location_name: "Musi River Basin Sector 4", current_value: 4.2, status: "CRITICAL" },
  { id: 2, sensor_code: "RNF-202", sensor_type: "RAINFALL", location_name: "Hyderabad Urban Region", current_value: 128.5, status: "WARNING" },
  { id: 3, sensor_code: "TMP-303", sensor_type: "TEMPERATURE", location_name: "HITEC Industrial Area", current_value: 38.4, status: "NORMAL" }
];

const defaultAlerts = [
  { id: 1, alert_code: "ALT-9001", title: "Musi River Flash Flood Emergency", severity: "CRITICAL", disaster_type: "FLOOD", message: "Water level 4.2m reached. Evacuate Sector 4 low-lying areas immediately." },
  { id: 2, alert_code: "ALT-9002", title: "Heavy Downpour Urban Waterlogging", severity: "WARNING", disaster_type: "RAINFALL", message: "Expect severe waterlogging on Mehdipatnam-Tolichowki stretch." }
];

const defaultCitizenReports = [
  { id: 1, report_code: "REP-0042", citizen_name: "Srinivas Rao", citizen_phone: "+91 98765 43210", emergency_type: "Flood", description: "Water level rose 4 feet inundating houses near river bank.", address: "Sector 4 Musi River Bank", status: "VERIFIED", lat: 17.3850, lng: 78.4866 }
];

async function safeFetch(url, options = {}, mockFallback = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    }
  } catch (e) {
    // Backend offline or running on static host (e.g. Netlify)
  }

  // Fallback to mock logic if provided
  if (typeof mockFallback === 'function') {
    return mockFallback();
  }
  return { status: 'fallback', message: 'Executed in offline fallback mode' };
}

const CrisisAPI = {
  async login(username, password) {
    return safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }, () => ({ token: "demo-jwt-token", user: { username, role: "AUTHORITY" } }));
  },

  async getIncidents() {
    return safeFetch(`${API_BASE}/incidents`, {}, () => MockStore.get('incidents', defaultIncidents));
  },

  async createIncident(data) {
    return safeFetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const incidents = MockStore.get('incidents', defaultIncidents);
      const newInc = {
        id: incidents.length + 1,
        incident_code: `INC-${1000 + incidents.length + 1}`,
        title: data.title || "Emergency Incident",
        disaster_type: data.disaster_type || "OTHER",
        severity: data.severity || "HIGH",
        priority_score: data.priority_score || 75.0,
        status: "ACTIVE",
        lat: parseFloat(data.lat) || 17.385,
        lng: parseFloat(data.lng) || 78.486,
        location_name: data.location_name || "Hyderabad Command Center Zone",
        description: data.description || "Reported disaster incident.",
        affected_population: parseInt(data.affected_population) || 250
      };
      incidents.unshift(newInc);
      MockStore.set('incidents', incidents);
      return newInc;
    });
  },

  async updateIncident(id, data) {
    return safeFetch(`${API_BASE}/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const incidents = MockStore.get('incidents', defaultIncidents);
      const idx = incidents.findIndex(i => i.id === parseInt(id));
      if (idx !== -1) {
        incidents[idx] = { ...incidents[idx], ...data };
        MockStore.set('incidents', incidents);
        return incidents[idx];
      }
      return data;
    });
  },

  async assignResource(incidentId, resourceId, notes = '') {
    return safeFetch(`${API_BASE}/incidents/${incidentId}/assign-resource`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource_id: resourceId, notes })
    }, () => ({ status: "SUCCESS", message: `Resource ${resourceId} dispatched to Incident ${incidentId}` }));
  },

  async getHospitals() {
    return safeFetch(`${API_BASE}/hospitals`, {}, () => MockStore.get('hospitals', defaultHospitals));
  },

  async getShelters() {
    return safeFetch(`${API_BASE}/shelters`, {}, () => MockStore.get('shelters', defaultShelters));
  },

  async getResources() {
    return safeFetch(`${API_BASE}/resources`, {}, () => MockStore.get('resources', defaultResources));
  },

  async getRecommendedResources(lat, lng, typeFilter = null) {
    return safeFetch(`${API_BASE}/resources/recommend?lat=${lat}&lng=${lng}`, {}, () => {
      const res = MockStore.get('resources', defaultResources);
      return typeFilter ? res.filter(r => r.resource_type === typeFilter) : res;
    });
  },

  async getSensors() {
    return safeFetch(`${API_BASE}/sensors`, {}, () => MockStore.get('sensors', defaultSensors));
  },

  async ingestSensorReading(sensorCode, currentValue) {
    return safeFetch(`${API_BASE}/sensors/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensor_code: sensorCode, current_value: currentValue })
    }, () => {
      const sensors = MockStore.get('sensors', defaultSensors);
      const s = sensors.find(item => item.sensor_code === sensorCode);
      if (s) {
        s.current_value = currentValue;
        s.status = currentValue >= 4.0 ? 'CRITICAL' : currentValue >= 3.0 ? 'WARNING' : 'NORMAL';
        MockStore.set('sensors', sensors);
      }
      return { status: "INGESTED", sensor_code: sensorCode, current_value: currentValue };
    });
  },

  async getAlerts() {
    return safeFetch(`${API_BASE}/alerts`, {}, () => MockStore.get('alerts', defaultAlerts));
  },

  async createAlert(data) {
    return safeFetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const alerts = MockStore.get('alerts', defaultAlerts);
      const newAlert = {
        id: alerts.length + 1,
        alert_code: `ALT-${9000 + alerts.length + 1}`,
        title: data.title || "Emergency Alert",
        severity: data.severity || "WARNING",
        disaster_type: data.disaster_type || "FLOOD",
        message: data.message || "Emergency notification broadcasted."
      };
      alerts.unshift(newAlert);
      MockStore.set('alerts', alerts);
      return newAlert;
    });
  },

  async calculateRoute(startLat, startLng, endLat, endLng, vehicleType = 'AMBULANCE') {
    return safeFetch(`${API_BASE}/routes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_lat: startLat, start_lng: startLng, end_lat: endLat, end_lng: endLng, vehicle_type: vehicleType })
    }, () => {
      const sLat = parseFloat(startLat) || 17.385;
      const sLng = parseFloat(startLng) || 78.486;
      const eLat = parseFloat(endLat) || 17.424;
      const eLng = parseFloat(endLng) || 78.503;
      const midLat = (sLat + eLat) / 2 + 0.008;
      const midLng = (sLng + eLng) / 2 - 0.008;

      return {
        route_id: `RTE-${Math.floor(Math.random()*9000)+1000}`,
        vehicle_type: vehicleType,
        distance_km: 6.4,
        estimated_time_mins: 12.5,
        avoided_hazards_count: 2,
        path_coordinates: [
          [sLat, sLng],
          [midLat, midLng],
          [eLat, eLng]
        ]
      };
    });
  },

  async createEvacuationPlan(zoneId, targetPopulation) {
    return safeFetch(`${API_BASE}/evacuation/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone_id: zoneId, target_population: targetPopulation })
    }, () => ({
      plan_id: `EVC-${Math.floor(Math.random()*9000)+1000}`,
      status: "ACTIVE",
      total_evacuated: targetPopulation || 500,
      assigned_shelter: "Gachibowli Relief Center",
      message: "Evacuation plan generated and dispatched."
    }));
  },

  async getKPIs() {
    return safeFetch(`${API_BASE}/analytics/kpis`, {}, () => {
      const incidents = MockStore.get('incidents', defaultIncidents);
      const active = incidents.filter(i => i.status === 'ACTIVE').length;
      const critical = incidents.filter(i => i.severity === 'CRITICAL' && i.status === 'ACTIVE').length;
      const high = incidents.filter(i => i.severity === 'HIGH' && i.status === 'ACTIVE').length;

      return {
        active_incidents: active || 12,
        critical_incidents: critical || 3,
        high_priority_incidents: high || 4,
        available_ambulances: 9,
        available_rescue_teams: 6,
        hospital_beds: 48,
        shelter_capacity: 2400
      };
    });
  },

  async runSimulation(disasterType, rainfall, waterLevel, population) {
    return safeFetch(`${API_BASE}/simulation/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        disaster_type: disasterType,
        rainfall_mm: rainfall,
        water_level_m: waterLevel,
        population_density: population
      })
    }, () => ({
      simulation_id: `SIM-${Math.floor(Math.random()*9000)+1000}`,
      risk_level: waterLevel >= 4.0 || rainfall >= 100 ? "CRITICAL" : "HIGH",
      estimated_affected: Math.round((waterLevel || 3) * (population || 1000) * 0.4),
      required_rescue_teams: Math.ceil((population || 1000) / 250),
      recommended_evacuation_routes: 2
    }));
  },

  async getAuditLogs() {
    return safeFetch(`${API_BASE}/audit-logs`, {}, () => [
      { id: 1, action: "SYSTEM_INITIALIZED", user: "SYSTEM", timestamp: new Date().toISOString() },
      { id: 2, action: "INCIDENT_DISPATCHED", user: "authority", timestamp: new Date().toISOString() }
    ]);
  },

  async submitCitizenReport(data) {
    return safeFetch(`${API_BASE}/citizen-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const reports = MockStore.get('citizen_reports', defaultCitizenReports);
      const newReport = {
        id: reports.length + 1,
        report_code: `REP-${Math.floor(Math.random()*9000)+1000}`,
        citizen_name: data.citizen_name || "Anonymous Citizen",
        citizen_phone: data.citizen_phone || "+91 99999 00000",
        emergency_type: data.emergency_type || "Emergency",
        description: data.description || "No description provided.",
        address: data.address || "Hyderabad",
        status: "SUBMITTED",
        created_at: new Date().toISOString()
      };
      reports.unshift(newReport);
      MockStore.set('citizen_reports', reports);
      return newReport;
    });
  },

  async getCitizenReports() {
    return safeFetch(`${API_BASE}/citizen-reports`, {}, () => MockStore.get('citizen_reports', defaultCitizenReports));
  }
};

/* Real-Time WebSocket Manager with Zero-Crash Fallback */
class CrisisWebSocket {
  constructor(onMessageCallback) {
    this.callback = onMessageCallback;
    this.socket = null;
    this.init();
  }

  init() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        const statusElem = document.querySelector('[data-i18n="live_ws"]');
        if (statusElem) statusElem.innerText = "LIVE WEBSOCKETS";
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.callback) this.callback(data);
        } catch (e) {}
      };

      this.socket.onerror = () => {
        const statusElem = document.querySelector('[data-i18n="live_ws"]');
        if (statusElem) statusElem.innerText = "STANDALONE / DEMO MODE";
      };

      this.socket.onclose = () => {
        const statusElem = document.querySelector('[data-i18n="live_ws"]');
        if (statusElem) statusElem.innerText = "STANDALONE / DEMO MODE";
      };
    } catch (e) {
      const statusElem = document.querySelector('[data-i18n="live_ws"]');
      if (statusElem) statusElem.innerText = "STANDALONE / DEMO MODE";
    }
  }
}
