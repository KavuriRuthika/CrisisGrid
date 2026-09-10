import React, { useState } from 'react';
import { incidentsApi } from '../../services/api';
import { ShieldAlert, X } from 'lucide-react';

interface IncidentCreateModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export const IncidentCreateModal: React.FC<IncidentCreateModalProps> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState('Flood');
  const [address, setAddress] = useState('Sector 4 Main Avenue');
  const [lat, setLat] = useState(17.3850);
  const [lng, setLng] = useState(78.4867);
  const [population, setPopulation] = useState(500);
  const [waterLevel, setWaterLevel] = useState(3.2);
  const [gasPpm, setGasPpm] = useState(0.0);
  const [casualties, setCasualties] = useState(0);
  const [structuralDamage, setStructuralDamage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await incidentsApi.create({
        title,
        description,
        incident_type: incidentType,
        lat,
        lng,
        address,
        population_affected: population,
        water_level_m: waterLevel,
        gas_ppm: gasPpm,
        casualties,
        structural_damage: structuralDamage
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#131b2e] border border-cyan-500/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="text-base font-bold text-white">REGISTER NEW EMERGENCY INCIDENT</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">INCIDENT TITLE</label>
            <input
              type="text"
              required
              placeholder="e.g. Flash Flood Cut Off in Sector 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">DISASTER TYPE</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              >
                <option value="Flood">🌊 Flood</option>
                <option value="Fire">🔥 Fire</option>
                <option value="Accident">🚗 Accident</option>
                <option value="Medical Emergency">🏥 Medical</option>
                <option value="Gas Leak">☣ Gas Leak</option>
                <option value="Cyclone">🌪 Cyclone</option>
                <option value="Building Collapse">🏛 Collapse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">AFFECTED POPULATION</label>
              <input
                type="number"
                value={population}
                onChange={(e) => setPopulation(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">LOCATION ADDRESS</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">WATER LEVEL (M)</label>
              <input
                type="number"
                step="0.1"
                value={waterLevel}
                onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">GAS PPM</label>
              <input
                type="number"
                value={gasPpm}
                onChange={(e) => setGasPpm(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">CASUALTIES</label>
              <input
                type="number"
                value={casualties}
                onChange={(e) => setCasualties(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">DESCRIPTION & SITUATION REPORT</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              {submitting ? 'Registering...' : 'REGISTER & CALCULATE PRIORITY'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
