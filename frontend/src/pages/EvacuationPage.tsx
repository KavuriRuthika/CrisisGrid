import React, { useState } from 'react';
import { evacuationApi } from '../services/api';
import { EvacuationPlanResponse } from '../types';
import { Route, Users, Home, CheckCircle2 } from 'lucide-react';

export const EvacuationPage: React.FC = () => {
  const [targetPop, setTargetPop] = useState(2400);
  const [planResult, setPlanResult] = useState<EvacuationPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await evacuationApi.createPlan(1, targetPop);
      setPlanResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#131b2e] border border-rose-500/30 rounded-2xl p-6 shadow-2xl glass-panel space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40">
            <Route className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">DETERMINISTIC EVACUATION PLANNER</h2>
            <p className="text-xs text-slate-400">Automated capacity matching across nearest available shelters</p>
          </div>
        </div>

        <form onSubmit={handleGeneratePlan} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">TARGET EVACUATION POPULATION</label>
            <input
              type="number"
              value={targetPop}
              onChange={(e) => setTargetPop(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-xs text-white p-2.5 rounded-xl font-mono w-48"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg"
          >
            {loading ? 'GENERATING...' : 'GENERATE EVACUATION PLAN'}
          </button>
        </form>
      </div>

      {/* Plan Result Output */}
      {planResult && (
        <div className="bg-[#131b2e] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl glass-panel space-y-4 animate-scale-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                PLAN CODE: {planResult.plan_code}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{planResult.zone_name}</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-800">
              STATUS: {planResult.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">TARGET CITIZENS</span>
              <strong className="text-white text-base">{planResult.target_population} People</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">TOTAL ACCOMMODATED</span>
              <strong className="text-emerald-400 text-base">{planResult.total_allocated} Capacity Beds</strong>
            </div>
          </div>

          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">ALLOCATED SHELTERS BREAKDOWN</h4>
          <div className="space-y-2">
            {planResult.shelters.map((item) => (
              <div key={item.shelter_id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                <div>
                  <strong className="text-white block">{item.shelter_name}</strong>
                  <span className="text-slate-500 text-[10px]">{item.distance_km} km distance</span>
                </div>
                <span className="text-cyan-400 font-bold bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800">
                  {item.allocated_count} Evacuees Assigned
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
