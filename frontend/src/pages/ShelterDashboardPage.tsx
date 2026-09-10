import React, { useState, useEffect } from 'react';
import { sheltersApi } from '../services/api';
import { Shelter } from '../types';
import { Home, Users, Package, Droplets, HeartPulse } from 'lucide-react';

export const ShelterDashboardPage: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);

  const fetchShelters = async () => {
    try {
      const res = await sheltersApi.getAll();
      setShelters(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShelter) return;
    try {
      await sheltersApi.update(editingShelter.id, {
        current_occupancy: editingShelter.current_occupancy,
        food_kits: editingShelter.food_kits,
        water_liters: editingShelter.water_liters,
        medical_kits: editingShelter.medical_kits
      });
      setEditingShelter(null);
      fetchShelters();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#131b2e] border border-teal-500/30 rounded-2xl p-6 shadow-2xl glass-panel flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/40">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">SHELTER RELIEF MANAGEMENT</h2>
            <p className="text-xs text-slate-400">Real-time Occupancy & Emergency Supply Tracking</p>
          </div>
        </div>
      </div>

      {/* Grid of Shelter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shelters.map((s) => (
          <div key={s.id} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">{s.code}</span>
                <h3 className="text-sm font-bold text-white mt-1">{s.name}</h3>
              </div>
              <button
                onClick={() => setEditingShelter(s)}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Update Occupancy
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">OCCUPANCY</span>
                <strong className="text-teal-400 text-sm">{s.current_occupancy} / {s.max_capacity}</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">STATUS</span>
                <strong className="text-cyan-400 text-xs uppercase">{s.status}</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">FOOD KITS</span>
                <strong className="text-amber-400 text-sm">{s.food_kits} Units</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">WATER SUPPLY</span>
                <strong className="text-cyan-400 text-sm">{s.water_liters} L</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingShelter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdate} className="bg-[#131b2e] border border-slate-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Update Shelter Occupancy — {editingShelter.name}</h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">CURRENT OCCUPANCY</label>
              <input
                type="number"
                value={editingShelter.current_occupancy}
                onChange={(e) => setEditingShelter({ ...editingShelter, current_occupancy: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">FOOD KITS</label>
              <input
                type="number"
                value={editingShelter.food_kits}
                onChange={(e) => setEditingShelter({ ...editingShelter, food_kits: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditingShelter(null)} className="px-4 py-2 bg-slate-800 text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl">Save Status</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
