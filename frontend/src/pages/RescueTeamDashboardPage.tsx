import React, { useState, useEffect } from 'react';
import { incidentsApi } from '../services/api';
import { Incident } from '../types';
import { LifeBuoy, MapPin, Navigation, Clock, CheckCircle2, Play, Flag, ShieldAlert } from 'lucide-react';

export const RescueTeamDashboardPage: React.FC = () => {
  const [assignedIncidents, setAssignedIncidents] = useState<Incident[]>([]);

  const fetchIncidents = async () => {
    try {
      const res = await incidentsApi.getAll({ status: 'DISPATCHED' });
      const activeRes = await incidentsApi.getAll({ status: 'IN_PROGRESS' });
      setAssignedIncidents([...res.data, ...activeRes.data]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleUpdateStatus = async (incidentId: number, status: string) => {
    try {
      await incidentsApi.update(incidentId, { status });
      fetchIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#131b2e] border border-blue-500/30 rounded-2xl p-6 shadow-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/40">
            <LifeBuoy className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RESCUE TEAM FIELD OPERATION BOARD</h2>
            <p className="text-xs text-slate-400">NDRF Squad T01 — Active Duty Emergency Task Execution</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
          <span className="text-slate-400">TEAM STATUS:</span>
          <span className="text-emerald-400">DEPLOYED ON SCENE</span>
        </div>
      </div>

      {/* Assigned Incidents Execution Cards */}
      <div className="space-y-4">
        {assignedIncidents.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 font-mono text-xs">
            No active emergency assignments pending for your rescue squad. Standby for dispatch.
          </div>
        ) : (
          assignedIncidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 glass-panel"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">
                    {inc.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    Priority #{inc.priority_score}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Status: {inc.status}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">Code: {inc.incident_code}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{inc.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{inc.description}</p>
              </div>

              {/* Specs & Destinations Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">LOCATION</span>
                  <strong className="text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {inc.address}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">RECOMMENDED ROUTE</span>
                  <strong className="text-cyan-400 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" />
                    ROUTE-2 (Bypass)
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">TARGET SHELTER</span>
                  <strong className="text-teal-400">SHL-01 (Sports Complex)</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">DESTINATION HOSPITAL</span>
                  <strong className="text-purple-400">HSP-101 (Apex Trauma)</strong>
                </div>
              </div>

              {/* Action Buttons Workflow */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleUpdateStatus(inc.id, 'DISPATCHED')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  ACCEPT ASSIGNMENT
                </button>
                <button
                  onClick={() => handleUpdateStatus(inc.id, 'IN_PROGRESS')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  START JOURNEY
                </button>
                <button
                  onClick={() => handleUpdateStatus(inc.id, 'UNDER_CONTROL')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Flag className="w-3.5 h-3.5" />
                  ARRIVED ON SCENE
                </button>
                <button
                  onClick={() => handleUpdateStatus(inc.id, 'RESOLVED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  OPERATION COMPLETED
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
