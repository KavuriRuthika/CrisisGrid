import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Map, ShieldAlert, Truck, Navigation, Route, Radio, 
  AlertOctagon, Building2, Home, BarChart3, Cpu, History, 
  UserCheck, LifeBuoy
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { id: 'command-center', label: t('live_map'), icon: Map, roles: ['ADMIN', 'AUTHORITY', 'RESCUE_TEAM'] },
    { id: 'incidents', label: t('incident_list'), icon: ShieldAlert, roles: ['ADMIN', 'AUTHORITY', 'RESCUE_TEAM'] },
    { id: 'resources', label: t('resources'), icon: Truck, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'routes', label: t('find_route'), icon: Navigation, roles: ['ADMIN', 'AUTHORITY', 'RESCUE_TEAM'] },
    { id: 'evacuation', label: t('evacuation'), icon: Route, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'sensors', label: t('iot_sensors'), icon: Radio, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'alerts', label: t('alerts'), icon: AlertOctagon, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'hospitals', label: 'Hospitals', icon: Building2, roles: ['ADMIN', 'AUTHORITY', 'HOSPITAL'] },
    { id: 'shelters', label: 'Shelters', icon: Home, roles: ['ADMIN', 'AUTHORITY', 'SHELTER'] },
    { id: 'analytics', label: t('analytics'), icon: BarChart3, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'simulation', label: t('simulation'), icon: Cpu, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'audit', label: t('audit_logs'), icon: History, roles: ['ADMIN', 'AUTHORITY'] },
    { id: 'citizen-portal', label: 'Citizen Portal', icon: UserCheck, roles: ['CITIZEN', 'ADMIN', 'AUTHORITY'] },
    { id: 'rescue-dashboard', label: 'Rescue Team Board', icon: LifeBuoy, roles: ['RESCUE_TEAM', 'ADMIN', 'AUTHORITY'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role) || role === 'ADMIN' || role === 'AUTHORITY');

  return (
    <aside className="w-64 bg-[#0d1322] border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-80px)] sticky top-[80px]">
      <div className="py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
          COMMAND OPERATIONS
        </div>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Role Indicator Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Active Mode:</span>
          <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            {role}
          </span>
        </div>
      </div>
    </aside>
  );
};
