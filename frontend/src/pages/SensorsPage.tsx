import React, { useState, useEffect } from 'react';
import { sensorsApi } from '../services/api';
import { IoTSensor } from '../types';
import { Radio, AlertTriangle, Activity, Sliders } from 'lucide-react';

export const SensorsPage: React.FC = () => {
  const [sensors, setSensors] = useState<IoTSensor[]>([]);
  const [testValue, setTestValue] = useState<number>(4.2);
  const [selectedSensorCode, setSelectedSensorCode] = useState<string>('WTR-101');

  const fetchSensors = async () => {
    try {
      const res = await sensorsApi.getAll();
      setSensors(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleSimulateTelemetry = async () => {
    try {
      await sensorsApi.ingestReading(selectedSensorCode, testValue);
      fetchSensors();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner & Simulator Control */}
      <div className="bg-[#131b2e] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl glass-panel space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/40">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">IOT TELEMETRY & AUTOMATED RULE ENGINE</h2>
              <p className="text-xs text-slate-400">Automated sensor threshold monitoring & alert trigger pipeline</p>
            </div>
          </div>
        </div>

        {/* Telemetry Simulator Box */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase">SIMULATE TELEMETRY INGESTION</h4>
            <p className="text-xs text-slate-400">Send test sensor reading to evaluate deterministic threshold rules</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedSensorCode}
              onChange={(e) => setSelectedSensorCode(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-white p-2 rounded-xl"
            >
              {sensors.map(s => (
                <option key={s.sensor_code} value={s.sensor_code}>{s.sensor_code} ({s.location_name})</option>
              ))}
            </select>

            <input
              type="number"
              step="0.1"
              value={testValue}
              onChange={(e) => setTestValue(parseFloat(e.target.value))}
              className="w-24 bg-slate-950 border border-slate-700 text-xs text-white p-2 rounded-xl font-mono"
            />

            <button
              onClick={handleSimulateTelemetry}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              INGEST TELEMETRY
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((s) => (
          <div
            key={s.id}
            className={`p-5 rounded-2xl border transition-all ${
              s.status === 'CRITICAL'
                ? 'bg-red-950/30 border-red-500/50 shadow-xl shadow-red-950/40 ring-1 ring-red-500/30'
                : s.status === 'WARNING'
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-[#131b2e] border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{s.sensor_code}</span>
                <h4 className="text-xs font-bold text-white mt-1">{s.sensor_type}</h4>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                s.status === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' : 'bg-slate-900 text-emerald-400'
              }`}>
                {s.status}
              </span>
            </div>

            <div className="text-xs text-slate-300 font-medium mb-3">{s.location_name}</div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 text-[10px] block">CURRENT VALUE</span>
                <strong className={`text-base ${s.status === 'CRITICAL' ? 'text-red-400 font-extrabold' : 'text-cyan-400'}`}>
                  {s.current_value} {s.unit}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">CRITICAL THRESHOLD</span>
                <strong className="text-slate-300 text-sm">{s.critical_threshold} {s.unit}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
