import React, { useState } from 'react';
import { routesApi } from '../../services/api';
import { RouteOption } from '../../types';
import { Navigation, Route as RouteIcon, Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RouteSolverUIProps {
  onSelectRoute?: (route: RouteOption) => void;
}

export const RouteSolverUI: React.FC<RouteSolverUIProps> = ({ onSelectRoute }) => {
  const [startLat, setStartLat] = useState<number>(17.3850);
  const [startLng, setStartLng] = useState<number>(78.4867);
  const [endLat, setEndLat] = useState<number>(17.4100);
  const [endLng, setEndLng] = useState<number>(78.5100);
  const [vehicleType, setVehicleType] = useState<string>('AMBULANCE');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await routesApi.calculate(startLat, startLng, endLat, endLng, vehicleType);
      setRoutes(res.data.routes);
      if (res.data.routes.length > 0 && onSelectRoute) {
        onSelectRoute(res.data.routes.find(r => r.is_recommended) || res.data.routes[0]);
      }
    } catch (err) {
      console.error("Error calculating routes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            DETERMINISTIC EMERGENCY ROUTE CALCULATOR
          </h3>
          <p className="text-xs text-slate-400">Dijkstra & Haversine pathfinder evaluating road hazards, blockages & flooded segments</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">RESOURCE LAT</label>
          <input
            type="number"
            step="any"
            value={startLat}
            onChange={(e) => setStartLat(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">RESOURCE LNG</label>
          <input
            type="number"
            step="any"
            value={startLng}
            onChange={(e) => setStartLng(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">EMERGENCY DEST LAT</label>
          <input
            type="number"
            step="any"
            value={endLat}
            onChange={(e) => setEndLat(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">EMERGENCY DEST LNG</label>
          <input
            type="number"
            step="any"
            value={endLng}
            onChange={(e) => setEndLng(parseFloat(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            {loading ? 'SOLVING...' : 'CALCULATE SAFE ROUTES'}
          </button>
        </div>
      </form>

      {/* Calculated Route Cards */}
      {routes.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            CALCULATED EMERGENCY ROUTES ({routes.length} OPTIONS)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((rt) => (
              <div
                key={rt.route_id}
                onClick={() => onSelectRoute && onSelectRoute(rt)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  rt.is_recommended
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/30'
                    : rt.status === 'BLOCKED'
                    ? 'bg-red-950/20 border-red-900/50 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{rt.route_id}</span>
                  {rt.is_recommended ? (
                    <span className="text-[10px] uppercase font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded shadow">
                      ★ RECOMMENDED
                    </span>
                  ) : (
                    <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                      rt.status === 'BLOCKED' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rt.status}
                    </span>
                  )}
                </div>

                <h5 className="text-xs font-bold text-white mb-2">{rt.name}</h5>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3 bg-slate-950/60 p-2 rounded-lg">
                  <div>
                    <span className="text-slate-500 text-[10px] block">DISTANCE</span>
                    <strong className="text-cyan-400">{rt.distance_km} km</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">EST. ETA</span>
                    <strong className="text-emerald-400">{rt.eta_minutes} mins</strong>
                  </div>
                </div>

                {rt.warnings.length > 0 && (
                  <div className="text-[11px] text-amber-400 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{rt.warnings[0]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
