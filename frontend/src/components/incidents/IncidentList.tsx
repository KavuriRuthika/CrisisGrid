import React, { useState } from 'react';
import { Incident } from '../../types';
import { ShieldAlert, AlertTriangle, Clock, MapPin, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onDispatchClick: (inc: Incident) => void;
  onCreateClick?: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onSelectIncident,
  onDispatchClick,
  onCreateClick
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = incidents.filter(i => {
    if (filterSeverity === 'ALL') return true;
    return i.severity === filterSeverity;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            INCIDENT OPERATIONS DIRECTORY
          </h3>
          <p className="text-xs text-slate-400">Sorted by deterministic Priority Scoring Engine (Score 0-100+)</p>
        </div>

        <div className="flex items-center space-x-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 text-xs rounded-lg font-bold border transition-all ${
                filterSeverity === s
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-950'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}

          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="ml-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-cyan-950 transition-all"
            >
              + NEW INCIDENT
            </button>
          )}
        </div>
      </div>

      {/* Incident List Cards */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filtered.map((inc, idx) => (
          <div
            key={inc.id}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(inc.severity)}`}>
                  {inc.severity}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  Priority Score: {inc.priority_score}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {inc.status}
                </span>
              </div>

              <h4 
                onClick={() => onSelectIncident(inc)}
                className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors flex items-center gap-2"
              >
                {inc.title}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </h4>

              <p className="text-xs text-slate-300 line-clamp-1">{inc.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {inc.address || 'Central Sector'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {inc.population_affected} Affected
                </span>
                {inc.water_level_m > 0 && (
                  <span className="text-cyan-400 font-bold">
                    Water: {inc.water_level_m}m
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => onSelectIncident(inc)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                View Timeline
              </button>
              <button
                onClick={() => onDispatchClick(inc)}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-cyan-950 transition-all"
              >
                Dispatch Resources
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
