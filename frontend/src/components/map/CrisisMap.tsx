import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Incident, Hospital, Shelter, Resource, IoTSensor, RouteOption, CitizenReport } from '../../types';
import { Filter, Layers, Navigation, ShieldAlert, AlertTriangle } from 'lucide-react';

// Custom SVG HTML Map Markers
const createCustomIcon = (emoji: string, bgClass: string, isPulse = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bgClass} shadow-lg border border-white/20 transform hover:scale-110 transition-transform cursor-pointer">
        ${isPulse ? '<span class="absolute inset-0 rounded-full bg-red-500/50 animate-ping"></span>' : ''}
        <span class="text-sm z-10">${emoji}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const icons = {
  FIRE: createCustomIcon('🔴', 'bg-red-600', true),
  FLOOD: createCustomIcon('🔵', 'bg-blue-600', true),
  ACCIDENT: createCustomIcon('🟠', 'bg-orange-600'),
  MEDICAL: createCustomIcon('🏥', 'bg-purple-600'),
  GAS_LEAK: createCustomIcon('☣️', 'bg-emerald-600', true),
  CYCLONE: createCustomIcon('🌪️', 'bg-cyan-600', true),
  WARNING: createCustomIcon('🟡', 'bg-amber-500'),
  HOSPITAL: createCustomIcon('🏥', 'bg-purple-950/90 border-purple-500'),
  SHELTER: createCustomIcon('🏠', 'bg-teal-950/90 border-teal-500'),
  AMBULANCE: createCustomIcon('🚑', 'bg-emerald-900/90 border-emerald-400'),
  RESCUE_TEAM: createCustomIcon('👨‍🚒', 'bg-blue-900/90 border-blue-400'),
  BLOCKED_ROAD: createCustomIcon('🚧', 'bg-slate-800 border-amber-500'),
  CITIZEN_REPORT: createCustomIcon('📍', 'bg-rose-950 border-rose-400')
};

interface CrisisMapProps {
  incidents: Incident[];
  hospitals: Hospital[];
  shelters: Shelter[];
  resources: Resource[];
  sensors: IoTSensor[];
  citizenReports?: CitizenReport[];
  activeRoute?: RouteOption | null;
  onSelectIncident?: (incident: Incident) => void;
  onAssignResource?: (incidentId: number) => void;
  onSendGeoAlert?: (lat: number, lng: number) => void;
}

export const CrisisMap: React.FC<CrisisMapProps> = ({
  incidents,
  hospitals,
  shelters,
  resources,
  sensors,
  citizenReports = [],
  activeRoute,
  onSelectIncident,
  onAssignResource,
  onSendGeoAlert
}) => {
  const centerLat = 17.3850;
  const centerLng = 78.4867;

  // Filter & Layer States
  const [filterType, setFilterType] = useState<string>('ALL');
  const [layers, setLayers] = useState({
    incidents: true,
    hospitals: true,
    shelters: true,
    resources: true,
    sensors: true,
    citizenReports: true
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterType === 'ALL') return true;
    return inc.incident_type.toUpperCase().includes(filterType);
  });

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-2 max-w-2xl bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-xl">
        {/* Incident Type Filter */}
        <div className="flex items-center space-x-1.5 px-2 py-1 bg-slate-900 rounded-lg border border-slate-700/60">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">ALL INCIDENTS</option>
            <option value="FLOOD" className="bg-slate-900">🌊 FLOOD</option>
            <option value="FIRE" className="bg-slate-900">🔥 FIRE</option>
            <option value="ACCIDENT" className="bg-slate-900">🚗 ACCIDENT</option>
            <option value="MEDICAL" className="bg-slate-900">🏥 MEDICAL</option>
            <option value="GAS" className="bg-slate-900">☣ GAS LEAK</option>
            <option value="CYCLONE" className="bg-slate-900">🌪 CYCLONE</option>
          </select>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => toggleLayer('incidents')}
            className={`px-2 py-1 text-[11px] rounded-lg font-bold border ${layers.incidents ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
          >
            INCIDENTS ({filteredIncidents.length})
          </button>
          <button
            onClick={() => toggleLayer('resources')}
            className={`px-2 py-1 text-[11px] rounded-lg font-bold border ${layers.resources ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
          >
            RESOURCES ({resources.length})
          </button>
          <button
            onClick={() => toggleLayer('hospitals')}
            className={`px-2 py-1 text-[11px] rounded-lg font-bold border ${layers.hospitals ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
          >
            HOSPITALS ({hospitals.length})
          </button>
          <button
            onClick={() => toggleLayer('shelters')}
            className={`px-2 py-1 text-[11px] rounded-lg font-bold border ${layers.shelters ? 'bg-teal-500/20 text-teal-400 border-teal-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
          >
            SHELTERS ({shelters.length})
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map */}
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />

        {/* 1. Render Incident Markers & Hazard Circles */}
        {layers.incidents && filteredIncidents.map((inc) => {
          let icon = icons.WARNING;
          const t = inc.incident_type.toUpperCase();
          if (t.includes('FIRE')) icon = icons.FIRE;
          else if (t.includes('FLOOD')) icon = icons.FLOOD;
          else if (t.includes('ACCIDENT')) icon = icons.ACCIDENT;
          else if (t.includes('MEDICAL')) icon = icons.MEDICAL;
          else if (t.includes('GAS')) icon = icons.GAS_LEAK;
          else if (t.includes('CYCLONE')) icon = icons.CYCLONE;

          return (
            <React.Fragment key={`inc-${inc.id}`}>
              <Marker position={[inc.lat, inc.lng]} icon={icon}>
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase bg-red-950 text-red-400 px-1.5 py-0.5 rounded font-bold border border-red-800">
                        {inc.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        Priority #{inc.priority_score}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-tight">{inc.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2">{inc.description}</p>

                    <div className="text-[11px] text-slate-400 font-mono space-y-0.5 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <div>Affected: <strong>{inc.population_affected} citizens</strong></div>
                      {inc.water_level_m > 0 && <div>Water Level: <strong className="text-cyan-400">{inc.water_level_m}m</strong></div>}
                      {inc.gas_ppm > 0 && <div>Gas PPM: <strong className="text-emerald-400">{inc.gas_ppm} ppm</strong></div>}
                      <div>Reason: <span className="text-slate-300">{inc.priority_reason}</span></div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {onAssignResource && (
                        <button
                          onClick={() => onAssignResource(inc.id)}
                          className="w-full text-xs bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-1.5 rounded-lg transition-colors"
                        >
                          Dispatch Nearest Resource
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Hazard Evacuation Radius Circle */}
              {inc.severity === 'CRITICAL' && (
                <Circle
                  center={[inc.lat, inc.lng]}
                  radius={1200}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, dashArray: '5, 10' }}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* 2. Render Hospital Markers */}
        {layers.hospitals && hospitals.map((h) => (
          <Marker key={`hosp-${h.id}`} position={[h.lat, h.lng]} icon={icons.HOSPITAL}>
            <Popup>
              <div className="p-1 space-y-1">
                <h4 className="text-xs font-bold text-white">{h.name} ({h.code})</h4>
                <p className="text-[11px] text-slate-300">Available Beds: <strong className="text-purple-400">{h.available_beds} / {h.total_beds}</strong></p>
                <p className="text-[11px] text-slate-300">ICU Beds: <strong className="text-red-400">{h.icu_available} / {h.icu_total}</strong></p>
                <p className="text-[11px] text-slate-300">Ambulances: <strong>{h.ambulances_count}</strong></p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. Render Shelter Markers */}
        {layers.shelters && shelters.map((s) => (
          <Marker key={`shl-${s.id}`} position={[s.lat, s.lng]} icon={icons.SHELTER}>
            <Popup>
              <div className="p-1 space-y-1">
                <h4 className="text-xs font-bold text-white">{s.name} ({s.code})</h4>
                <p className="text-[11px] text-slate-300">Capacity: <strong className="text-teal-400">{s.max_capacity - s.current_occupancy} available</strong> ({s.current_occupancy}/{s.max_capacity})</p>
                <p className="text-[11px] text-slate-300">Status: <strong className="text-cyan-400">{s.status}</strong></p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. Render Available Resource Markers */}
        {layers.resources && resources.map((r) => (
          <Marker
            key={`res-${r.id}`}
            position={[r.lat, r.lng]}
            icon={r.resource_type === 'AMBULANCE' ? icons.AMBULANCE : icons.RESCUE_TEAM}
          >
            <Popup>
              <div className="p-1 space-y-1">
                <h4 className="text-xs font-bold text-white">{r.name} ({r.code})</h4>
                <p className="text-[11px] text-slate-300">Type: <strong>{r.resource_type}</strong></p>
                <p className="text-[11px] text-slate-300">Status: <strong className="text-emerald-400">{r.status}</strong></p>
                <p className="text-[11px] text-slate-300">Phone: {r.contact_phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5. Render Active Emergency Route Polyline Overlay */}
        {activeRoute && activeRoute.coordinates.length > 0 && (
          <Polyline
            positions={activeRoute.coordinates as [number, number][]}
            pathOptions={{ color: activeRoute.status === 'BLOCKED' ? '#ef4444' : '#06b6d4', weight: 5, opacity: 0.9 }}
          />
        )}
      </MapContainer>
    </div>
  );
};
