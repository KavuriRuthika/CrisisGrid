import React, { useState } from 'react';
import { 
  ShieldAlert, Megaphone, Truck, Users, 
  Building2, Home, Navigation, Route, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QuickActionsPanelProps {
  onActionClick: (actionKey: string) => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onActionClick }) => {
  const { t } = useLanguage();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const actions = [
    { key: 'REPORT_INCIDENT', label: t('report_emergency'), icon: ShieldAlert, color: 'from-red-600 to-rose-700', critical: false },
    { key: 'SEND_ALERT', label: t('send_alert'), icon: Megaphone, color: 'from-amber-600 to-orange-700', critical: true },
    { key: 'DISPATCH_AMBULANCE', label: t('dispatch_ambulance'), icon: Truck, color: 'from-emerald-600 to-teal-700', critical: false },
    { key: 'DISPATCH_RESCUE', label: t('dispatch_rescue'), icon: Users, color: 'from-blue-600 to-indigo-700', critical: false },
    { key: 'CONTACT_HOSPITAL', label: t('contact_hospital'), icon: Building2, color: 'from-purple-600 to-fuchsia-700', critical: false },
    { key: 'ACTIVATE_SHELTER', label: t('activate_shelter'), icon: Home, color: 'from-teal-600 to-cyan-700', critical: false },
    { key: 'FIND_ROUTE', label: t('find_route'), icon: Navigation, color: 'from-cyan-600 to-blue-700', critical: false },
    { key: 'START_EVACUATION', label: t('start_evacuation'), icon: Route, color: 'from-rose-600 to-red-800', critical: true },
  ];

  const handleTrigger = (action: any) => {
    if (action.critical) {
      setConfirmAction(action.key);
    } else {
      onActionClick(action.key);
    }
  };

  const handleConfirm = () => {
    if (confirmAction) {
      onActionClick(confirmAction);
      setConfirmAction(null);
    }
  };

  return (
    <>
      <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            EMERGENCY COMMAND QUICK ACTIONS
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">1-CLICK OPERATION DISPATCH</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.key}
                onClick={() => handleTrigger(act)}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br ${act.color} text-white font-bold text-xs shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all duration-200 border border-white/10`}
              >
                <Icon className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] text-center line-clamp-1">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Critical Action Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131b2e] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center space-x-3 text-red-500 mb-4">
              <AlertCircle className="w-8 h-8 flex-shrink-0 animate-bounce" />
              <div>
                <h3 className="text-base font-bold text-white">Confirm Critical Action</h3>
                <p className="text-xs text-slate-400">Authorization required for high-impact operation</p>
              </div>
            </div>

            <p className="text-sm text-slate-200 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              Are you sure you want to execute <strong className="text-cyan-400">{confirmAction.replace('_', ' ')}</strong>? This will trigger real-time broadcast notifications to all field personnel.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950"
              >
                Authorize & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
