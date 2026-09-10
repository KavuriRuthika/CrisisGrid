import React, { useState, useEffect } from 'react';
import { Incident, Resource } from '../../types';
import { resourcesApi, incidentsApi } from '../../services/api';
import { Truck, CheckCircle2, MapPin, Clock, Phone, AlertCircle, X } from 'lucide-react';

interface ResourceAllocatorModalProps {
  incident: Incident | null;
  onClose: () => void;
  onAssigned?: () => void;
}

export const ResourceAllocatorModal: React.FC<ResourceAllocatorModalProps> = ({
  incident,
  onClose,
  onAssigned
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    if (!incident) return;
    setLoading(true);
    resourcesApi.getRecommended(incident.lat, incident.lng)
      .then(res => {
        setRecommendations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching recommended resources:", err);
        setLoading(false);
      });
  }, [incident]);

  if (!incident) return null;

  const handleAssign = async (resourceId: number) => {
    setSubmitting(resourceId);
    try {
      await incidentsApi.assignResource(incident.id, resourceId, `Dispatched via Resource Allocator Engine to ${incident.title}`);
      if (onAssigned) onAssigned();
      onClose();
    } catch (e) {
      console.error("Error assigning resource:", e);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl p-6 max-w-2xl w-full shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
              NEAREST-NEIGHBOR RESOURCE ALLOCATOR
            </span>
            <h3 className="text-base font-bold text-white mt-1">{incident.title}</h3>
            <p className="text-xs text-slate-400">Incident Code: {incident.incident_code} | Severity: {incident.severity}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4 flex items-center gap-3 text-xs text-slate-300">
          <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span>
            Resource allocation algorithm scans available units, computes exact Haversine geographical distance, checks road accessibility, and ranks nearest candidates automatically (Zero AI/ML).
          </span>
        </div>

        {/* Recommendation Cards */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            Calculating nearest available response units...
          </div>
        ) : recommendations.length === 0 ? (
          <div className="py-8 text-center text-amber-400 bg-amber-950/30 rounded-xl border border-amber-800/40 text-xs">
            No AVAILABLE matching emergency resources found nearby. All units deployed.
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {recommendations.map((rec, idx) => (
              <div
                key={rec.resource_id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  idx === 0
                    ? 'bg-cyan-950/40 border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {idx === 0 && (
                      <span className="text-[10px] uppercase font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded">
                        RECOMMENDED #1
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-white">{rec.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{rec.code}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-300 font-mono">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      {rec.distance_km} km away
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      ETA: {rec.eta_minutes} mins
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                      {rec.contact_phone}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAssign(rec.resource_id)}
                  disabled={submitting === rec.resource_id}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex-shrink-0"
                >
                  {submitting === rec.resource_id ? 'Assigning...' : 'ASSIGN & DISPATCH'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
