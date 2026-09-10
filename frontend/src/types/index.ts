export type Role = 'ADMIN' | 'AUTHORITY' | 'RESCUE_TEAM' | 'HOSPITAL' | 'SHELTER' | 'CITIZEN';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: Role;
  phone?: string;
  is_active: boolean;
}

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'REPORTED'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'DISPATCHED'
  | 'IN_PROGRESS'
  | 'UNDER_CONTROL'
  | 'RESOLVED'
  | 'CLOSED';

export interface IncidentCreate {
  title: string;
  description?: string;
  incident_type: string;
  lat: number;
  lng: number;
  address?: string;
  population_affected?: number;
  water_level_m?: number;
  gas_ppm?: number;
  casualties?: number;
  structural_damage?: boolean;
  severity?: Severity;
}

export interface IncidentUpdate {
  title?: string;
  description?: string;
  incident_type?: string;
  severity?: Severity;
  status?: string;
  population_affected?: number;
  water_level_m?: number;
  gas_ppm?: number;
  casualties?: number;
  structural_damage?: boolean;
}

export interface IncidentTimeline {
  id: number;
  timestamp: string;
  title: string;
  description?: string;
  status_from?: string;
  status_to?: string;
  action_by: string;
}

export interface Incident {
  id: number;
  incident_code: string;
  title: string;
  description?: string;
  incident_type: string;
  severity: Severity;
  priority_score: number;
  priority_reason?: string;
  status: IncidentStatus;
  lat: number;
  lng: number;
  address?: string;
  population_affected: number;
  water_level_m: number;
  gas_ppm: number;
  casualties: number;
  structural_damage: boolean;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  timeline_entries: IncidentTimeline[];
}

export interface CitizenReport {
  id: number;
  report_code: string;
  citizen_name: string;
  citizen_phone: string;
  emergency_type: string;
  description: string;
  status: 'SUBMITTED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  lat: number;
  lng: number;
  address?: string;
  photo_url?: string;
  incident_id?: number;
  created_at: string;
}

export type ResourceStatus = 'AVAILABLE' | 'ASSIGNED' | 'EN_ROUTE' | 'ON_SCENE' | 'UNAVAILABLE' | 'MAINTENANCE';

export interface Resource {
  id: number;
  code: string;
  name: string;
  resource_type: string;
  status: ResourceStatus;
  lat: number;
  lng: number;
  contact_phone?: string;
  capacity: number;
  current_incident_id?: number;
  last_updated: string;
}

export interface Hospital {
  id: number;
  code: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
  total_beds: number;
  available_beds: number;
  icu_total: number;
  icu_available: number;
  doctors_available: number;
  ambulances_count: number;
  oxygen_available_liters: number;
  blood_units: number;
  incoming_patients: number;
  status: string;
  last_updated: string;
}

export interface Shelter {
  id: number;
  code: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  phone?: string;
  max_capacity: number;
  current_occupancy: number;
  food_kits: number;
  water_liters: number;
  medical_kits: number;
  status: 'AVAILABLE' | 'NEAR_CAPACITY' | 'FULL';
  last_updated: string;
}

export interface IoTSensor {
  id: number;
  sensor_code: string;
  sensor_type: 'WATER_LEVEL' | 'RAINFALL' | 'TEMPERATURE' | 'SMOKE' | 'GAS';
  location_name: string;
  lat: number;
  lng: number;
  current_value: number;
  unit: string;
  warning_threshold: number;
  critical_threshold: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  last_updated: string;
}

export interface Alert {
  id: number;
  alert_code: string;
  title: string;
  message_en: string;
  message_te?: string;
  message_hi?: string;
  severity: Severity;
  affected_zone_name?: string;
  center_lat?: number;
  center_lng?: number;
  radius_km?: number;
  status: string;
  created_at: string;
}

export interface RouteOption {
  route_id: string;
  name: string;
  distance_km: number;
  eta_minutes: number;
  status: string;
  is_recommended: boolean;
  warnings: string[];
  coordinates: number[][];
}

export interface ShelterAllocationItem {
  shelter_id: number;
  shelter_name: string;
  allocated_count: number;
  distance_km: number;
}

export interface EvacuationPlanResponse {
  plan_code: string;
  zone_name: string;
  target_population: number;
  total_allocated: number;
  shelters: ShelterAllocationItem[];
  status: string;
}

export interface AnalyticsKPI {
  active_incidents: number;
  critical_incidents: number;
  high_priority_incidents: number;
  ambulances_available: number;
  rescue_teams_available: number;
  hospital_beds_available: number;
  shelter_capacity_available: number;
  avg_response_time_minutes: number;
  avg_resolution_time_minutes: number;
  resource_utilization_pct: number;
  hospital_utilization_pct: number;
  shelter_utilization_pct: number;
  incidents_by_type: Record<string, number>;
  incidents_by_severity: Record<string, number>;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user_id?: number;
  username?: string;
  role?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: string;
  ip_address?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  severity: string;
  is_read: boolean;
  incident_id?: number;
  created_at: string;
}
