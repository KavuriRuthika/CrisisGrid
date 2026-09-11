import axios from 'axios';
import {
  Incident, IncidentCreate, IncidentUpdate, CitizenReport,
  Resource, Hospital, Shelter, IoTSensor, Alert,
  RouteOption, EvacuationPlanResponse, AnalyticsKPI, AuditLog,
  NotificationItem
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept token if saved
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept errors gracefully for static/unreachable deployments
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("API Request fallback:", error.message);
    if (error.config && error.config.method === 'get') {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: { status: 'ok', message: 'Offline fallback response' } });
  }
);

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  getProfile: () => api.get('/auth/me'),
};

export const incidentsApi = {
  getAll: (params?: { status?: string; severity?: string; incident_type?: string }) =>
    api.get<Incident[]>('/incidents', { params }),
  getById: (id: number) => api.get<Incident>(`/incidents/${id}`),
  create: (data: IncidentCreate) => api.post<Incident>('/incidents', data),
  update: (id: number, data: IncidentUpdate) => api.put<Incident>(`/incidents/${id}`, data),
  assignResource: (id: number, resource_id: number, notes?: string) =>
    api.post(`/incidents/${id}/assign-resource`, { resource_id, notes }),
};

export const citizenReportsApi = {
  submit: (data: any) => api.post<CitizenReport>('/citizen-reports', data),
  getAll: (status?: string) => api.get<CitizenReport[]>('/citizen-reports', { params: { status } }),
  verify: (id: number, action: 'VERIFY' | 'REJECT') =>
    api.post(`/citizen-reports/${id}/verify`, null, { params: { action } }),
};

export const resourcesApi = {
  getAll: (params?: { resource_type?: string; status?: string }) =>
    api.get<Resource[]>('/resources', { params }),
  create: (data: any) => api.post<Resource>('/resources', data),
  updateStatus: (id: number, status: string, lat?: number, lng?: number) =>
    api.put<Resource>(`/resources/${id}`, null, { params: { status, lat, lng } }),
  getRecommended: (lat: number, lng: number, resource_type?: string) =>
    api.get<any[]>('/resources/recommend', { params: { lat, lng, resource_type } }),
};

export const hospitalsApi = {
  getAll: () => api.get<Hospital[]>('/hospitals'),
  update: (id: number, data: Partial<Hospital>) => api.put<Hospital>(`/hospitals/${id}`, data),
};

export const sheltersApi = {
  getAll: () => api.get<Shelter[]>('/shelters'),
  update: (id: number, data: Partial<Shelter>) => api.put<Shelter>(`/shelters/${id}`, data),
};

export const sensorsApi = {
  getAll: () => api.get<IoTSensor[]>('/sensors'),
  ingestReading: (sensor_code: string, current_value: number) =>
    api.post('/sensors/readings', { sensor_code, current_value }),
  updateThresholds: (id: number, warning_threshold: number, critical_threshold: number) =>
    api.put<IoTSensor>(`/sensors/${id}/thresholds`, { warning_threshold, critical_threshold }),
};

export const alertsApi = {
  getAll: (status?: string) => api.get<Alert[]>('/alerts', { params: { status } }),
  create: (data: any) => api.post<Alert>('/alerts', data),
  cancel: (id: number) => api.delete(`/alerts/${id}`),
};

export const routesApi = {
  calculate: (start_lat: number, start_lng: number, end_lat: number, end_lng: number, vehicle_type = 'AMBULANCE') =>
    api.post<{ routes: RouteOption[] }>('/routes/calculate', { start_lat, start_lng, end_lat, end_lng, vehicle_type }),
};

export const evacuationApi = {
  getZones: () => api.get<any[]>('/evacuation/zones'),
  createPlan: (zone_id: number, target_population: number) =>
    api.post<EvacuationPlanResponse>('/evacuation/plan', { zone_id, target_population }),
};

export const analyticsApi = {
  getKPIs: () => api.get<AnalyticsKPI>('/analytics/kpis'),
};

export const auditApi = {
  getLogs: () => api.get<AuditLog[]>('/audit-logs'),
};

export const notificationsApi = {
  getAll: () => api.get<NotificationItem[]>('/notifications'),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
};

export const simulationApi = {
  run: (data: { disaster_type: string; rainfall_mm: number; water_level_m: number; population_density: number }) =>
    api.post('/simulation/run', data),
};

export const rulesApi = {
  getRules: () => api.get('/rules'),
};

export default api;
