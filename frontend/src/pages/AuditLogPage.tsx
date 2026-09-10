import React, { useState, useEffect } from 'react';
import { auditApi } from '../services/api';
import { AuditLog } from '../types';
import { History, ShieldCheck, User } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    auditApi.getLogs().then(res => setLogs(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-2xl glass-panel flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-800 text-cyan-400 rounded-2xl border border-slate-700">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">SYSTEM AUDIT TRAIL & ACCOUNTABILITY LOG</h2>
            <p className="text-xs text-slate-400">Tamper-evident record of all operational dispatches & status alterations</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="py-3 px-4">TIMESTAMP</th>
              <th className="py-3 px-4">OPERATOR</th>
              <th className="py-3 px-4">ROLE</th>
              <th className="py-3 px-4">ACTION</th>
              <th className="py-3 px-4">TARGET</th>
              <th className="py-3 px-4">DETAILS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="py-3 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">{log.username || 'System Engine'}</td>
                <td className="py-3 px-4 text-slate-300 font-bold">{log.role || 'SYSTEM'}</td>
                <td className="py-3 px-4 text-white font-bold">{log.action}</td>
                <td className="py-3 px-4 text-slate-300">{log.target_type} #{log.target_id || ''}</td>
                <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{log.details || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
