import React, { useState, useEffect } from 'react';
import { hospitalsApi } from '../services/api';
import { Hospital } from '../types';
import { Building2 as HospitalIcon, Bed, Activity, HeartPulse, Phone } from 'lucide-react';

export const HospitalDashboardPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

  const fetchHospitals = async () => {
    try {
      const res = await hospitalsApi.getAll();
      setHospitals(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    try {
      await hospitalsApi.update(editingHospital.id, {
        available_beds: editingHospital.available_beds,
        icu_available: editingHospital.icu_available,
        doctors_available: editingHospital.doctors_available,
        blood_units: editingHospital.blood_units,
        oxygen_available_liters: editingHospital.oxygen_available_liters
      });
      setEditingHospital(null);
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#131b2e] border border-purple-500/30 rounded-2xl p-6 shadow-2xl glass-panel flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/40">
            <HospitalIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">HOSPITAL CAPACITY MANAGEMENT</h2>
            <p className="text-xs text-slate-400">Real-time Emergency & ICU Bed Availability Sync</p>
          </div>
        </div>
      </div>

      {/* Grid of Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((h) => (
          <div key={h.id} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">{h.code}</span>
                <h3 className="text-sm font-bold text-white mt-1">{h.name}</h3>
              </div>
              <button
                onClick={() => setEditingHospital(h)}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Update Bed Status
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">AVAIL BEDS</span>
                <strong className="text-purple-400 text-sm">{h.available_beds} / {h.total_beds}</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">ICU BEDS</span>
                <strong className="text-red-400 text-sm">{h.icu_available} / {h.icu_total}</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">DOCTORS</span>
                <strong className="text-emerald-400 text-sm">{h.doctors_available} Duty</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">OXYGEN SUPPLY</span>
                <strong className="text-cyan-400 text-sm">{h.oxygen_available_liters} L</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdate} className="bg-[#131b2e] border border-slate-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Update Bed Capacity — {editingHospital.name}</h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">AVAILABLE GENERAL BEDS</label>
              <input
                type="number"
                value={editingHospital.available_beds}
                onChange={(e) => setEditingHospital({ ...editingHospital, available_beds: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">AVAILABLE ICU BEDS</label>
              <input
                type="number"
                value={editingHospital.icu_available}
                onChange={(e) => setEditingHospital({ ...editingHospital, icu_available: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditingHospital(null)} className="px-4 py-2 bg-slate-800 text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl">Save Capacity</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
