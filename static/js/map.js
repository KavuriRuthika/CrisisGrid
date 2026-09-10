/* Pure JavaScript Leaflet Map Controller - 100% FREE OPEN MAPS (NO API KEYS REQUIRED) */

let mainMap = null;
let tileLayerPolitical = null;
let tileLayerPoliticalVoyager = null;
let tileLayerStreets = null;
let tileLayerDark = null;
let tileLayerSatellite = null;
let activeMapMode = 'STREETS';

let incidentMarkers = [];
let threatCircles = [];
let hospitalMarkers = [];
let shelterMarkers = [];
let sensorMarkers = [];
let resourceMarkers = [];
let routePolyline = null;

// Initial Center: GLOBAL MATRIX (Lat: 20.0, Lng: 50.0 - Matches User Screenshot!)
const INDIA_CENTER = [20.5937, 78.9629];
const GLOBAL_CENTER = [20.0, 50.0];
const DEFAULT_ZOOM = 4; // Global street/country matrix view zoom level

function initCrisisMap() {
  if (mainMap) return;

  mainMap = L.map('crisis-map', {
    center: GLOBAL_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true
  });

  // 1. Dark Map Layer (Esri Canvas Dark - 100% Free, NO API Key)
  tileLayerDark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  });

  // 2. World Streets Map Layer (Esri Street Map - 100% Free, NO API Key)
  tileLayerStreets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong)'
  });

  // 3. World Political Map Layer (Standard OpenStreetMap - 100% Free, NO API Key)
  tileLayerPolitical = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  });

  // 4. Esri Topographic Map Layer (100% Free, NO API Key)
  tileLayerPoliticalVoyager = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom'
  });

  // 5. High-Resolution Satellite Imagery Layer (Esri World Imagery - 100% Free, NO API Key)
  tileLayerSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping'
  });

  // Default Layer: WORLD STREETS MAP (Matches User Screenshot!)
  tileLayerStreets.addTo(mainMap);
}

function setMapLayerMode(mode) {
  activeMapMode = mode;
  [tileLayerDark, tileLayerStreets, tileLayerPolitical, tileLayerPoliticalVoyager, tileLayerSatellite].forEach(l => {
    if (l && mainMap.hasLayer(l)) mainMap.removeLayer(l);
  });

  // Active button styling
  document.querySelectorAll('.bm-btn').forEach(btn => btn.classList.remove('active'));

  if (mode === 'SATELLITE') {
    tileLayerSatellite.addTo(mainMap);
    const b = document.getElementById('btn-bm-satellite');
    if (b) b.classList.add('active');
  } else if (mode === 'STREETS') {
    tileLayerStreets.addTo(mainMap);
    const b = document.getElementById('btn-bm-streets');
    if (b) b.classList.add('active');
  } else if (mode === 'POLITICAL_VOYAGER') {
    tileLayerPoliticalVoyager.addTo(mainMap);
    const b = document.getElementById('btn-bm-voyager');
    if (b) b.classList.add('active');
  } else if (mode === 'POLITICAL') {
    tileLayerPolitical.addTo(mainMap);
    const b = document.getElementById('btn-bm-political');
    if (b) b.classList.add('active');
  } else {
    tileLayerDark.addTo(mainMap);
    const b = document.getElementById('btn-bm-dark');
    if (b) b.classList.add('active');
  }
}

function resetMapToIndia() {
  if (mainMap) {
    mainMap.flyTo(INDIA_CENTER, DEFAULT_ZOOM, { duration: 1.5 });
  }
}

function resetMapToWorld() {
  if (mainMap) {
    mainMap.flyTo([20, 10], 3, { duration: 1.5 });
  }
}

// Marker Icon Generator
function createMarkerHtml(emoji, bgClass, isPulse = false) {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position:relative; width:34px; height:34px; border-radius:50%; background:${bgClass}; display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.8); box-shadow:0 6px 16px rgba(0,0,0,0.5); cursor:pointer;">
        ${isPulse ? '<span style="position:absolute; inset:-4px; border-radius:50%; background:rgba(239,68,68,0.5); animation:ping 1.5s infinite;"></span>' : ''}
        <span style="font-size:16px; z-index:10;">${emoji}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

const mapIcons = {
  FIRE: createMarkerHtml('🔥', '#dc2626', true),
  FLOOD: createMarkerHtml('🌊', '#2563eb', true),
  ACCIDENT: createMarkerHtml('🚗', '#ea580c'),
  MEDICAL: createMarkerHtml('🏥', '#9333ea'),
  GAS_LEAK: createMarkerHtml('☣️', '#059669', true),
  CYCLONE: createMarkerHtml('🌪️', '#0891b2', true),
  VOLCANO: createMarkerHtml('🌋', '#b91c1c', true),
  LANDSLIDE: createMarkerHtml('⛰️', '#d97706', true),
  AVALANCHE: createMarkerHtml('❄️', '#0284c7', true),
  EARTHQUAKE: createMarkerHtml('🏚️', '#78350f', true),
  TSUNAMI: createMarkerHtml('🌊', '#1d4ed8', true),
  HEATWAVE: createMarkerHtml('☀️', '#eab308', true),
  HOSPITAL: createMarkerHtml('🏥', '#6b21a8'),
  SHELTER: createMarkerHtml('🏠', '#0f766e'),
  AMBULANCE: createMarkerHtml('🚑', '#047857'),
  RESCUE: createMarkerHtml('👨‍🚒', '#1d4ed8'),
  SENSOR_CRIT: createMarkerHtml('📡', '#dc2626', true),
  SENSOR_WARN: createMarkerHtml('📡', '#d97706', false),
  SENSOR_OK: createMarkerHtml('📡', '#059669', false)
};

function renderMapIncidents(incidents) {
  incidentMarkers.forEach(m => mainMap.removeLayer(m));
  threatCircles.forEach(c => mainMap.removeLayer(c));
  incidentMarkers = [];
  threatCircles = [];

  const countEl = document.getElementById('count-disasters');
  if (countEl) countEl.innerText = incidents.length;

  incidents.forEach(inc => {
    let icon = mapIcons.FLOOD;
    let circleColor = '#3b82f6'; // Default Blue
    let circleRadius = 40000; // 40km

    const t = (inc.incident_type || '').toUpperCase();
    if (t.includes('FIRE') || t.includes('WILDFIRE')) {
      icon = mapIcons.FIRE;
      circleColor = '#ef4444';
      circleRadius = 60000;
    } else if (t.includes('ACCIDENT')) {
      icon = mapIcons.ACCIDENT;
      circleColor = '#f97316';
      circleRadius = 25000;
    } else if (t.includes('GAS')) {
      icon = mapIcons.GAS_LEAK;
      circleColor = '#10b981';
      circleRadius = 35000;
    } else if (t.includes('CYCLONE') || t.includes('TYPHOON')) {
      icon = mapIcons.CYCLONE;
      circleColor = '#06b6d4';
      circleRadius = 150000;
    } else if (t.includes('VOLCANO')) {
      icon = mapIcons.VOLCANO;
      circleColor = '#b91c1c';
      circleRadius = 80000;
    } else if (t.includes('LANDSLIDE')) {
      icon = mapIcons.LANDSLIDE;
      circleColor = '#d97706';
      circleRadius = 45000;
    } else if (t.includes('AVALANCHE') || t.includes('SNOW')) {
      icon = mapIcons.AVALANCHE;
      circleColor = '#0284c7';
      circleRadius = 50000;
    } else if (t.includes('EARTHQUAKE') || t.includes('QUAKE') || t.includes('SEISMIC')) {
      icon = mapIcons.EARTHQUAKE;
      circleColor = '#9a3412';
      circleRadius = 90000;
    } else if (t.includes('TSUNAMI')) {
      icon = mapIcons.TSUNAMI;
      circleColor = '#1d4ed8';
      circleRadius = 120000;
    } else if (t.includes('HEAT') || t.includes('DROUGHT')) {
      icon = mapIcons.HEATWAVE;
      circleColor = '#eab308';
      circleRadius = 85000;
    }

    // Threat Polygon Circle
    const circle = L.circle([inc.lat, inc.lng], {
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 0.2,
      weight: 2,
      radius: circleRadius
    }).addTo(mainMap);

    threatCircles.push(circle);

    const marker = L.marker([inc.lat, inc.lng], { icon }).addTo(mainMap);
    
    const popupContent = `
      <div style="padding:4px; max-width:280px; font-family:sans-serif;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="background:#991b1b; color:#f87171; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px;">${window.t ? window.t(inc.severity) : inc.severity}</span>
          <span style="color:#22d3ee; font-weight:bold; font-size:11px;">${window.t ? window.t('Priority #') : 'Priority #'}${inc.priority_score || 85}</span>
        </div>
        <h4 style="color:#fff; font-size:13px; font-weight:bold; margin-bottom:4px;">${window.t ? window.t(inc.title) : inc.title}</h4>
        <p style="color:#cbd5e1; font-size:11px; margin-bottom:8px;">${window.t ? window.t(inc.description || '') : (inc.description || '')}</p>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-bottom:8px;">
          <button onclick="openDroneView('${inc.title}', '${inc.incident_type}', ${inc.lat}, ${inc.lng})" style="background:#0891b2; color:#fff; font-weight:bold; font-size:10px; padding:6px; border-radius:6px; border:none; cursor:pointer;">
            ${window.t ? window.t('🛰 DRONE HUD RECON') : '🛰 DRONE HUD RECON'}
          </button>
          <button onclick="openSatelliteView('${inc.title}', '${inc.incident_type}', ${inc.lat}, ${inc.lng})" style="background:#059669; color:#fff; font-weight:bold; font-size:10px; padding:6px; border-radius:6px; border:none; cursor:pointer;">
            ${window.t ? window.t('📡 SATELLITE OVERLAY') : '📡 SATELLITE OVERLAY'}
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    incidentMarkers.push(marker);
  });
}

function renderMapSensors(sensors) {
  sensorMarkers.forEach(m => mainMap.removeLayer(m));
  sensorMarkers = [];

  const countEl = document.getElementById('count-sensors');
  if (countEl) countEl.innerText = sensors.length;

  sensors.forEach(s => {
    let icon = mapIcons.SENSOR_OK;
    if (s.status === 'CRITICAL') icon = mapIcons.SENSOR_CRIT;
    else if (s.status === 'WARNING') icon = mapIcons.SENSOR_WARN;

    let typeEmoji = '📡';
    if (s.sensor_type === 'WATER_LEVEL') typeEmoji = '🌊';
    else if (s.sensor_type === 'RAINFALL') typeEmoji = '🌧️';
    else if (s.sensor_type === 'SMOKE') typeEmoji = '💨';
    else if (s.sensor_type === 'GAS') typeEmoji = '☣️';
    else if (s.sensor_type === 'TEMPERATURE') typeEmoji = '🌡️';

    const customIcon = createMarkerHtml(typeEmoji, s.status === 'CRITICAL' ? '#dc2626' : (s.status === 'WARNING' ? '#d97706' : '#059669'), s.status === 'CRITICAL');

    const marker = L.marker([s.lat, s.lng], { icon: customIcon }).addTo(mainMap);

    const popupContent = `
      <div style="padding:6px; max-width:280px; font-family:sans-serif; color:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span style="font-family:monospace; font-weight:bold; color:#06b6d4; font-size:11px;">${s.sensor_code}</span>
          <span style="font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; ${s.status === 'CRITICAL' ? 'background:rgba(239,68,68,0.3); color:#f87171;' : (s.status === 'WARNING' ? 'background:rgba(245,158,11,0.3); color:#fbbf24;' : 'background:rgba(16,185,129,0.3); color:#34d399;')}">${s.status}</span>
        </div>
        <strong style="font-size:12px; color:#fff;">${typeEmoji} ${s.sensor_type} SENSOR</strong>
        <p style="font-size:11px; color:#94a3b8; margin-top:2px; margin-bottom:6px;">📍 ${s.location_name}</p>
        
        <div style="background:#0f172a; padding:8px; border-radius:8px; border:1px solid #1e293b; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span style="color:#94a3b8;">Reading:</span>
            <strong style="color:${s.status==='CRITICAL'?'#f87171':'#22d3ee'}">${s.current_value} ${s.unit}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b; margin-top:2px;">
            <span>Warn: ${s.warning_threshold} ${s.unit}</span>
            <span>Crit: ${s.critical_threshold} ${s.unit}</span>
          </div>
        </div>

        <form onsubmit="handlePopupSensorIngest(event, '${s.sensor_code}')" style="display:flex; gap:6px;">
          <input type="number" step="0.1" id="popup-input-${s.sensor_code}" value="${s.current_value}" style="width:80px; background:#0f172a; color:#fff; font-size:11px; border:1px solid #334155; border-radius:4px; padding:4px 6px;" />
          <button type="submit" style="background:#06b6d4; color:#0b0f19; font-weight:800; font-size:10px; border:none; border-radius:4px; padding:4px 10px; cursor:pointer;">
            ⚡ INGEST
          </button>
        </form>
      </div>
    `;

    marker.bindPopup(popupContent);
    sensorMarkers.push(marker);
  });
}

function toggleMapLayer(layerName, isVisible) {
  if (layerName === 'disasters') {
    incidentMarkers.forEach(m => isVisible ? mainMap.addLayer(m) : mainMap.removeLayer(m));
  } else if (layerName === 'hospitals') {
    hospitalMarkers.forEach(m => isVisible ? mainMap.addLayer(m) : mainMap.removeLayer(m));
  } else if (layerName === 'shelters') {
    shelterMarkers.forEach(m => isVisible ? mainMap.addLayer(m) : mainMap.removeLayer(m));
  } else if (layerName === 'sensors') {
    sensorMarkers.forEach(m => isVisible ? mainMap.addLayer(m) : mainMap.removeLayer(m));
  } else if (layerName === 'threats') {
    threatCircles.forEach(c => isVisible ? mainMap.addLayer(c) : mainMap.removeLayer(c));
  }
}

function renderMapHospitals(hospitals) {
  hospitalMarkers.forEach(m => mainMap.removeLayer(m));
  hospitalMarkers = [];
  const countEl = document.getElementById('count-hospitals');
  if (countEl) countEl.innerText = hospitals.length;

  hospitals.forEach(h => {
    const marker = L.marker([h.lat, h.lng], { icon: mapIcons.HOSPITAL }).addTo(mainMap);
    marker.bindPopup(`
      <div style="padding:4px; color:#fff;">
        <h4 style="font-size:12px; font-weight:bold;">${h.name}</h4>
        <p style="font-size:11px; color:#c084fc;">Available Beds: <strong>${h.available_beds}/${h.total_beds}</strong></p>
        <p style="font-size:11px; color:#f87171;">ICU Available: <strong>${h.icu_available}</strong></p>
      </div>
    `);
    hospitalMarkers.push(marker);
  });
}

function renderMapShelters(shelters) {
  shelterMarkers.forEach(m => mainMap.removeLayer(m));
  shelterMarkers = [];
  const countEl = document.getElementById('count-shelters');
  if (countEl) countEl.innerText = shelters.length;

  shelters.forEach(s => {
    const marker = L.marker([s.lat, s.lng], { icon: mapIcons.SHELTER }).addTo(mainMap);
    marker.bindPopup(`
      <div style="padding:4px; color:#fff;">
        <h4 style="font-size:12px; font-weight:bold;">${s.name}</h4>
        <p style="font-size:11px; color:#22d3ee;">Capacity Free: <strong>${s.max_capacity - s.current_occupancy}</strong></p>
        <p style="font-size:11px; color:#94a3b8;">Status: ${s.status}</p>
      </div>
    `);
    shelterMarkers.push(marker);
  });
}

function drawRoutePolyline(coordinates) {
  if (routePolyline) mainMap.removeLayer(routePolyline);
  if (!coordinates || coordinates.length === 0) return;

  routePolyline = L.polyline(coordinates, {
    color: '#06b6d4',
    weight: 5,
    opacity: 0.9,
    dashArray: '8, 8'
  }).addTo(mainMap);

  mainMap.fitBounds(routePolyline.getBounds(), { padding: [40, 40] });
}

