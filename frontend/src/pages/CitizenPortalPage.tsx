import React, { useState } from 'react';
import { citizenReportsApi } from '../services/api';
import { CitizenReport } from '../types';
import { ShieldAlert, MapPin, CheckCircle2, Phone, User, FileText, Camera, AlertTriangle } from 'lucide-react';

export const CitizenPortalPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyType, setEmergencyType] = useState('Flood');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Sector 4 River Bank Road');
  const [lat, setLat] = useState(17.3850);
  const [lng, setLng] = useState(78.4867);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CitizenReport | null>(null);

  const emergencyOptions = [
    { type: 'Flood', icon: '🌊', label: 'Flood Emergency' },
    { type: 'Fire', icon: '🔥', label: 'Fire Outbreak' },
    { type: 'Accident', icon: '🚗', label: 'Road Accident' },
    { type: 'Medical Emergency', icon: '🏥', label: 'Medical Crisis' },
    { type: 'Gas Leak', icon: '☣', label: 'Gas Leak hazard' },
    { type: 'Cyclone', icon: '🌪', label: 'Cyclone Storm' },
    { type: 'Other', icon: '⚠️', label: 'Other Hazard' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !description) return;
    setSubmitting(true);
    try {
      const res = await citizenReportsApi.submit({
        citizen_name: name,
        citizen_phone: phone,
        emergency_type: emergencyType,
        description,
        lat,
        lng,
        address
      });
      setSubmittedReport(res.data);
    } catch (err) {
      console.error("Error submitting emergency report:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#131b2e] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl glass-panel text-center">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-cyan-500/40">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">CITIZEN EMERGENCY REPORTING PORTAL</h2>
        <p className="text-xs text-slate-400 mt-1">Direct priority channel to Emergency Command Operations Center</p>
      </div>

      {submittedReport ? (
        <div className="bg-[#131b2e] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-white">REPORT RECEIVED & LOGGED</h3>
          <p className="text-xs text-slate-300">Your emergency report has been dispatched to command authorities for instant verification.</p>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">REPORT CODE:</span>
              <strong className="text-cyan-400">{submittedReport.report_code}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">STATUS:</span>
              <strong className="text-emerald-400">{submittedReport.status}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">EMERGENCY TYPE:</span>
              <strong className="text-white">{submittedReport.emergency_type}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LOGGED TIME:</span>
              <span className="text-slate-300">{new Date(submittedReport.created_at).toLocaleTimeString()}</span>
            </div>
          </div>

          <button
            onClick={() => setSubmittedReport(null)}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            REPORT ANOTHER EMERGENCY
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-xl glass-panel space-y-5">
          {/* Emergency Category Selection Grid */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              SELECT EMERGENCY TYPE
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {emergencyOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setEmergencyType(opt.type)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    emergencyType === opt.type
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-950 scale-105'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl mb-1">{opt.icon}</span>
                  <span>{opt.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">YOUR FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Srinivas Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">PHONE NUMBER</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">EMERGENCY DESCRIPTION</label>
            <textarea
              required
              rows={3}
              placeholder="Describe situation, trapped citizens, or visible hazards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Location Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-slate-400">GPS EMERGENCY LOCATION</label>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="text-[11px] text-cyan-400 font-bold hover:underline"
              >
                Use Device GPS Location
              </button>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-red-950 transform hover:scale-[1.01] transition-all"
          >
            {submitting ? 'DISPATCHING REPORT...' : '🚨 SUBMIT EMERGENCY REPORT NOW'}
          </button>
        </form>
      )}
    </div>
  );
};
