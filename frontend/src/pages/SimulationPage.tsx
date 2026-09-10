import React, { useState } from 'react';
import { simulationApi } from '../services/api';
import { Cpu, AlertTriangle, Activity } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const [disasterType, setDisasterType] = useState('Flood');
  const [rainfall, setRainfall] = useState(150);
  const [waterLevel, setWaterLevel] = useState(4.2);
  const [populationDensity, setPopulationDensity] = useState(1500);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await simulationApi.run({
        disaster_type: disasterType,
        rainfall_mm: rainfall,
        water_level_m: waterLevel,
        population_density: populationDensity
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Form */}
      <div className="bg-[#131b2e] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl glass-panel space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/40">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">DIGITAL CRISIS SIMULATION SANDBOX</h2>
            <p className="text-xs text-slate-400">Pure Formula-Based Disaster Impact Calculator (Zero AI/ML)</p>
          </div>
        </div>

        <form onSubmit={handleRun} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">DISASTER TYPE</label>
            <select
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
            >
              <option value="Flood">🌊 Flood</option>
              <option value="Cyclone">🌪 Cyclone</option>
              <option value="Fire">🔥 Fire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">RAINFALL INTENSITY (MM)</label>
            <input
              type="number"
              value={rainfall}
              onChange={(e) => setRainfall(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">WATER LEVEL (METERS)</label>
            <input
              type="number"
              step="0.1"
              value={waterLevel}
              onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">POPULATION DENSITY</label>
            <input
              type="number"
              value={populationDensity}
              onChange={(e) => setPopulationDensity(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          <div className="lg:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              {loading ? 'CALCULATING FORMULAS...' : 'RUN DISASTER IMPACT SIMULATION'}
            </button>
          </div>
        </form>
      </div>

      {/* Result Cards */}
      {result && (
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 glass-panel animate-scale-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Simulated Impact Output Summary</h3>
            <span className="text-xs font-mono font-bold bg-red-950 text-red-400 px-3 py-1 rounded-xl border border-red-800">
              CALCULATED SEVERITY: {result.calculated_severity}
            </span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono">
            {result.risk_summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">AFFECTED POPULATION</span>
              <strong className="text-white text-base">{result.affected_population}</strong>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">BLOCKED ROADS</span>
              <strong className="text-amber-400 text-base">{result.blocked_roads_count}</strong>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">RESCUE SQUADS</span>
              <strong className="text-cyan-400 text-base">{result.required_rescue_teams}</strong>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">AMBULANCES</span>
              <strong className="text-emerald-400 text-base">{result.required_ambulances}</strong>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">SHELTER BEDS</span>
              <strong className="text-teal-400 text-base">{result.shelter_demand_beds}</strong>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">HOSPITAL BEDS</span>
              <strong className="text-purple-400 text-base">{result.hospital_demand_beds}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
