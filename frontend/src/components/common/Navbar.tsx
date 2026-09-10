import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { analyticsApi } from '../../services/api';
import { AnalyticsKPI, Role } from '../../types';
import { 
  ShieldAlert, Activity, AlertTriangle, Truck, Users, 
  Building2, Home, Globe, Radio, PlayCircle, LogOut, Bell
} from 'lucide-react';

interface NavbarProps {
  onRunDemo?: () => void;
  onOpenQuickAction?: (action: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRunDemo, onOpenQuickAction }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isConnected, notifications, removeNotification } = useWebSocket();
  const [kpis, setKpis] = useState<AnalyticsKPI | null>(null);

  const fetchKpis = async () => {
    try {
      const res = await analyticsApi.getKPIs();
      setKpis(res.data);
    } catch (e) {
      console.error("Error fetching KPIs:", e);
    }
  };

  useEffect(() => {
    fetchKpis();
    const interval = setInterval(fetchKpis, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0b0f19] border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner KPI Counter Bar */}
      <div className="bg-[#0f172a]/90 px-4 py-2 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-6 overflow-x-auto py-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 font-medium">ACTIVE INCIDENTS:</span>
            <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              {kpis?.active_incidents ?? 12}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
            <span className="text-slate-400 font-medium">CRITICAL:</span>
            <span className="font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
              {kpis?.critical_incidents ?? 3}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">HIGH PRIORITY:</span>
            <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              {kpis?.high_priority_incidents ?? 4}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">AMBULANCES:</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              {kpis?.ambulances_available ?? 9}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 font-medium">RESCUE TEAMS:</span>
            <span className="font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
              {kpis?.rescue_teams_available ?? 6}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 font-medium">HOSPITAL BEDS:</span>
            <span className="font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
              {kpis?.hospital_beds_available ?? 48}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400 font-medium">SHELTER CAP:</span>
            <span className="font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50">
              {kpis?.shelter_capacity_available ?? 2400}
            </span>
          </div>
        </div>

        {/* Live WS Status Dot */}
        <div className="flex items-center space-x-2">
          <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-[11px] text-slate-400 font-mono">
            {isConnected ? 'LIVE WS' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Title Brand */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950/80 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-lg shadow-cyan-950">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {t('command_center')}
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                DETERMINISTIC v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 tracking-wider font-mono">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center space-x-4">
          {/* Interactive Demo Button */}
          {onRunDemo && (
            <button
              onClick={onRunDemo}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-amber-950 transition-all transform hover:scale-105"
            >
              <PlayCircle className="w-4 h-4 fill-slate-950" />
              <span>RUN FLOOD DEMO SCENARIO</span>
            </button>
          )}

          {/* Multilingual Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg p-1">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'te' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'hi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          {/* Quick Role Switcher dropdown for testing */}
          <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1">
            <span className="text-[11px] text-slate-400 mr-2 font-medium hidden sm:inline">{t('quick_role_switch')}</span>
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value as Role)}
              className="bg-transparent text-xs text-cyan-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="AUTHORITY" className="bg-slate-900 text-slate-100">AUTHORITY</option>
              <option value="RESCUE_TEAM" className="bg-slate-900 text-slate-100">RESCUE TEAM</option>
              <option value="HOSPITAL" className="bg-slate-900 text-slate-100">HOSPITAL</option>
              <option value="SHELTER" className="bg-slate-900 text-slate-100">SHELTER</option>
              <option value="CITIZEN" className="bg-slate-900 text-slate-100">CITIZEN</option>
              <option value="ADMIN" className="bg-slate-900 text-slate-100">ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Real-Time WS Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className="pointer-events-auto bg-slate-900/95 border border-cyan-500/40 text-slate-100 p-3 rounded-xl shadow-2xl backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-all transform animate-slide-in"
          >
            <div className="flex items-start space-x-2">
              <Bell className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-cyan-400">{n.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};
