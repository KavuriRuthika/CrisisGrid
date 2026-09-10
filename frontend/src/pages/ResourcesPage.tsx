import React, { useState, useEffect } from 'react';
import { resourcesApi } from '../services/api';
import { Resource } from '../types';
import { Truck, MapPin, Phone, CheckCircle2, AlertCircle, Plus, Filter } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchResources = async () => {
    try {
      const res = await resourcesApi.getAll();
      setResources(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await resourcesApi.updateStatus(id, newStatus);
      fetchResources();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = resources.filter(r => {
    const typeMatch = filterType === 'ALL' || r.resource_type.includes(filterType);
    const statusMatch = filterStatus === 'ALL' || r.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#131b2e] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">EMERGENCY RESOURCE FLEET DIRECTORY</h2>
            <p className="text-xs text-slate-400">Real-time status management & nearest-neighbor allocation dispatch</p>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-4 shadow-xl glass-panel flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-cyan-400" />
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">TYPE:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white px-2.5 py-1 rounded-lg"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="AMBULANCE">AMBULANCE</option>
              <option value="RESCUE">RESCUE SQUAD</option>
              <option value="FIRE">FIRE ENGINE</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">STATUS:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white px-2.5 py-1 rounded-lg"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="EN_ROUTE">EN ROUTE</option>
              <option value="ON_SCENE">ON SCENE</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400">Total Fleet Units: {filtered.length}</span>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">{r.code}</span>
                <h3 className="text-sm font-bold text-white mt-1">{r.name}</h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                r.status === 'AVAILABLE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="text-xs text-slate-300 font-mono space-y-1">
              <div>Type: <strong className="text-white">{r.resource_type}</strong></div>
              <div>Capacity: <strong className="text-cyan-400">{r.capacity} Personnel</strong></div>
              <div>Phone: <span className="text-slate-400">{r.contact_phone}</span></div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-500">TOGGLE STATUS:</span>
              <button
                onClick={() => handleStatusChange(r.id, r.status === 'AVAILABLE' ? 'ASSIGNED' : 'AVAILABLE')}
                className="text-xs font-bold text-cyan-400 hover:underline font-mono"
              >
                Mark as {r.status === 'AVAILABLE' ? 'ASSIGNED' : 'AVAILABLE'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
