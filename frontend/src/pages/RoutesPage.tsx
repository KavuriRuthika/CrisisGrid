import React from 'react';
import { RouteSolverUI } from '../components/routes/RouteSolverUI';
import { Navigation } from 'lucide-react';

export const RoutesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#131b2e] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl glass-panel flex items-center space-x-3">
        <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/40">
          <Navigation className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">EMERGENCY ROUTE NAVIGATION SOLVER</h2>
          <p className="text-xs text-slate-400">Dijkstra pathfinder computing safe corridors avoiding blocked and flooded roads</p>
        </div>
      </div>

      <RouteSolverUI />
    </div>
  );
};
