import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Role } from '../types';
import { ShieldAlert, KeyRound, User, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('authority');
  const [password, setPassword] = useState('auth123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(username, password);
      login(res.data.access_token, {
        id: res.data.user_id,
        username: res.data.username,
        full_name: res.data.full_name,
        role: res.data.role as Role,
        email: `${res.data.username}@crisis.gov`,
        is_active: true
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogins = [
    { role: 'AUTHORITY', u: 'authority', p: 'auth123', label: 'Disaster Operations Commander' },
    { role: 'RESCUE_TEAM', u: 'rescueteam', p: 'rescue123', label: 'NDRF Rescue Squad Lead' },
    { role: 'HOSPITAL', u: 'hospital', p: 'hosp123', label: 'Trauma Center Coordinator' },
    { role: 'SHELTER', u: 'shelter', p: 'shelter123', label: 'Relief Shelter Manager' },
    { role: 'CITIZEN', u: 'citizen', p: 'citizen123', label: 'Resident Citizen' },
    { role: 'ADMIN', u: 'admin', p: 'admin123', label: 'System Administrator' },
  ];

  const handleQuickLogin = async (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setLoading(true);
    try {
      const res = await authApi.login(u, p);
      login(res.data.access_token, {
        id: res.data.user_id,
        username: res.data.username,
        full_name: res.data.full_name,
        role: res.data.role as Role,
        email: `${res.data.username}@crisis.gov`,
        is_active: true
      });
    } catch (err: any) {
      setError('Quick login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40 shadow-xl shadow-cyan-950">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">DIGITAL CRISIS COMMAND CENTER</h1>
          <p className="text-xs text-slate-400 font-mono">DETERMINISTIC REAL-TIME EMERGENCY PLATFORM</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 glass-panel">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">USERNAME</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER COMMAND CENTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Role Login Shortcuts */}
        <div className="bg-[#131b2e]/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
            1-CLICK DEMO TEST ACCOUNTS
          </span>
          <div className="grid grid-cols-2 gap-2">
            {quickLogins.map((ql) => (
              <button
                key={ql.role}
                onClick={() => handleQuickLogin(ql.u, ql.p)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-cyan-400">{ql.role}</div>
                <div className="text-[10px] text-slate-400 truncate">{ql.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
