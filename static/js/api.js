/* Pure JavaScript API & WebSocket Client for Command Center */

const API_BASE = '/api';

const CrisisAPI = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async getIncidents() {
    const res = await fetch(`${API_BASE}/incidents`);
    return res.json();
  },

  async createIncident(data) {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateIncident(id, data) {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async assignResource(incidentId, resourceId, notes = '') {
    const res = await fetch(`${API_BASE}/incidents/${incidentId}/assign-resource`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource_id: resourceId, notes })
    });
    return res.json();
  },

  async getHospitals() {
    const res = await fetch(`${API_BASE}/hospitals`);
    return res.json();
  },

  async getShelters() {
    const res = await fetch(`${API_BASE}/shelters`);
    return res.json();
  },

  async getResources() {
    const res = await fetch(`${API_BASE}/resources`);
    return res.json();
  },

  async getRecommendedResources(lat, lng, typeFilter = null) {
    let url = `${API_BASE}/resources/recommend?lat=${lat}&lng=${lng}`;
    if (typeFilter) url += `&resource_type=${encodeURIComponent(typeFilter)}`;
    const res = await fetch(url);
    return res.json();
  },

  async getSensors() {
    const res = await fetch(`${API_BASE}/sensors`);
    return res.json();
  },

  async ingestSensorReading(sensorCode, currentValue) {
    const res = await fetch(`${API_BASE}/sensors/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensor_code: sensorCode, current_value: currentValue })
    });
    return res.json();
  },

  async getAlerts() {
    const res = await fetch(`${API_BASE}/alerts`);
    return res.json();
  },

  async createAlert(data) {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async calculateRoute(startLat, startLng, endLat, endLng, vehicleType = 'AMBULANCE') {
    const res = await fetch(`${API_BASE}/routes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_lat: startLat, start_lng: startLng, end_lat: endLat, end_lng: endLng, vehicle_type: vehicleType })
    });
    return res.json();
  },

  async createEvacuationPlan(zoneId, targetPopulation) {
    const res = await fetch(`${API_BASE}/evacuation/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone_id: zoneId, target_population: targetPopulation })
    });
    return res.json();
  },

  async getKPIs() {
    const res = await fetch(`${API_BASE}/analytics/kpis`);
    return res.json();
  },

  async runSimulation(disasterType, rainfall, waterLevel, population) {
    const res = await fetch(`${API_BASE}/simulation/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        disaster_type: disasterType,
        rainfall_mm: rainfall,
        water_level_m: waterLevel,
        population_density: population
      })
    });
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  async submitCitizenReport(data) {
    const res = await fetch(`${API_BASE}/citizen-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getCitizenReports() {
    const res = await fetch(`${API_BASE}/citizen-reports`);
    return res.json();
  }
};

/* Real-Time WebSocket Manager */
class CrisisWebSocket {
  constructor(onMessageCallback) {
    this.callback = onMessageCallback;
    this.socket = null;
    this.init();
  }

  init() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.callback) this.callback(data);
      } catch (e) {
        console.error("WS Parse error:", e);
      }
    };

    this.socket.onclose = () => {
      setTimeout(() => this.init(), 4000);
    };
  }
}
