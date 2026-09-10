import React, { useState } from 'react';
import { Incident } from '../../types';
import { incidentsApi } from '../../services/api';
import { ShieldAlert, Clock, MapPin, Users, Activity, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onRefresh?: () => void;
  onDispatchClick?: (inc: Incident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onRefresh,
  onDispatchClick
}) => {
  const [updating, setUpdating] = useState(false);

  if (!incident) return null;

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await incidentsApi.update(incident.id, { status: newStatus });
      if (onRefresh) onRefresh();
      onClose();
    } catch (e) {
      console.error("Error updating incident status:", e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl p-6 max-w-3xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-7 h-7 text-cyan-400" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-400">{incident.incident_code}</span>
                <span className="text-xs font-mono font-bold bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">
                  {incident.severity}
                </span>
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                  Priority Score: {incident.priority_score}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{incident.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Priority Breakdown Reasoning Banner */}
        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 mb-6 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Activity className="w-4 h-4" />
            PRIORITY ENGINE CALCULATION BREAKDOWN
          </h4>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            {incident.priority_reason || 'Base Severity + Population Weight + Resource Availability'}
          </p>
        </div>

        {/* Incident Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">STATUS</div>
            <div className="text-xs font-bold text-cyan-400 mt-1">{incident.status}</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">AFFECTED POPULATION</div>
            <div className="text-xs font-bold text-white mt-1">{incident.population_affected} Citizens</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">WATER LEVEL</div>
            <div className="text-xs font-bold text-cyan-400 mt-1">{incident.water_level_m} meters</div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">CASUALTIES</div>
            <div className="text-xs font-bold text-red-400 mt-1">{incident.casualties} Reported</div>
          </div>
        </div>

        {/* Timeline History Section */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            REAL-TIME INCIDENT TIMELINE
          </h4>

          <div className="space-y-3 relative pl-4 border-l-2 border-slate-800">
            {incident.timeline_entries && incident.timeline_entries.length > 0 ? (
              incident.timeline_entries.map((t) => (
                <div key={t.id} className="relative pl-3 space-y-1">
                  <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-900"></div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{t.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300">{t.description}</p>
                  <div className="text-[10px] font-mono text-cyan-400">Logged by: {t.action_by}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 font-mono py-2">No timeline logs recorded yet.</div>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap gap-2">
            {incident.status !== 'RESOLVED' && (
              <button
                onClick={() => handleStatusChange('RESOLVED')}
                disabled={updating}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                MARK RESOLVED
              </button>
            )}
            {incident.status !== 'IN_PROGRESS' && (
              <button
                onClick={() => handleStatusChange('IN_PROGRESS')}
                disabled={updating}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                MARK IN PROGRESS
              </button>
            )}
          </div>

          {onDispatchClick && (
            <button
              onClick={() => {
                onClose();
                onDispatchClick(incident);
              }}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              DISPATCH RESOURCES
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
