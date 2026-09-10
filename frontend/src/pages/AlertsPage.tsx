import React, { useState, useEffect } from 'react';
import { alertsApi } from '../services/api';
import { Alert } from '../types';
import { Megaphone, Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [title, setTitle] = useState('');
  const [messageEn, setMessageEn] = useState('');
  const [severity, setSeverity] = useState('CRITICAL');
  const [affectedZone, setAffectedZone] = useState('Zone 3 River Bank');
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await alertsApi.getAll();
      setAlerts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await alertsApi.create({
        title,
        message_en: messageEn,
        severity,
        affected_zone_name: affectedZone
      });
      setTitle('');
      setMessageEn('');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Form */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-2xl glass-panel space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
            <Megaphone className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">MULTILINGUAL EMERGENCY ALERT BROADCAST</h2>
            <p className="text-xs text-slate-400">Targeted Geo-Based Warnings & Predefined Multilingual Templates</p>
          </div>
        </div>

        <form onSubmit={handleCreateAlert} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">ALERT HEADLINE TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. CRITICAL FLOOD EVACUATION WARNING"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">SEVERITY LEVEL</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
              >
                <option value="CRITICAL">🔴 CRITICAL</option>
                <option value="HIGH">🟠 HIGH</option>
                <option value="MEDIUM">🟡 MEDIUM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">ENGLISH MESSAGE CONTENT</label>
            <textarea
              required
              rows={2}
              placeholder="Enter warning message details and shelter instructions..."
              value={messageEn}
              onChange={(e) => setMessageEn(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            📢 BROADCAST MULTILINGUAL ALERT NOW
          </button>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">ACTIVE EMERGENCY BROADCASTS</h3>
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div key={alt.id} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-amber-400">{alt.alert_code}</span>
                <span className="text-[10px] font-mono text-slate-400">{new Date(alt.created_at).toLocaleString()}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{alt.title}</h4>
              <p className="text-xs text-slate-300">{alt.message_en}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">TELUGU (తెలుగు)</span>
                  <p className="text-slate-300 text-xs">{alt.message_te}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">HINDI (हिन्दी)</span>
                  <p className="text-slate-300 text-xs">{alt.message_hi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
