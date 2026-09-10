import React, { useState } from 'react';
import { Play, SkipForward, CheckCircle2, AlertTriangle, Radio, ShieldAlert, X } from 'lucide-react';
import { sensorsApi, citizenReportsApi, incidentsApi, alertsApi, evacuationApi } from '../../services/api';

interface DemoScenarioRunnerProps {
  onClose: () => void;
  onRefreshData?: () => void;
}

const scenarioSteps = [
  "1. Rainfall intensity increases in Musi River Catchment (128.5 mm)",
  "2. IoT Water-Level Sensor WTR-101 registers rising water levels (3.4m -> 4.2m)",
  "3. Sensor crosses WARNING threshold (3.0m)",
  "4. Automated System generates WARNING Alert & notifies duty officer",
  "5. Sensor crosses CRITICAL threshold (4.0m)",
  "6. Automated Sensor Engine generates CRITICAL Flood Emergency (INC-1001)",
  "7. Critical incident appears on Live Command Center Crisis Map",
  "8. Citizen Srinivas Rao submits emergency report REP-0042 (Submerged Houses)",
  "9. Authority Officer verifies Citizen Report REP-0042",
  "10. Rule Engine calculates Severity: CRITICAL (Water >= 4.0m & Pop >= 1000)",
  "11. Priority Engine assigns Score #85.0 (Rank #1 Active Emergency)",
  "12. Allocator Engine scans available NDRF Rescue Teams near Musi River",
  "13. Nearest suitable team RSC-T01 (NDRF Rescue Squad) is selected (2.1 km away)",
  "14. System checks Hospital Emergency Bed Capacity (HSP-101: 18 beds free)",
  "15. System checks Shelter Relief Capacity (SHL-01: 580 beds free)",
  "16. Road Network Engine identifies Sector Highway Link #3 as FLOODED",
  "17. Emergency Router calculates ROUTE-2 (Northern Bypass - 6.1 km, 13 mins)",
  "18. Operations Commander authorizes Zone 3 Evacuation Plan EVC-2026",
  "19. Multilingual Emergency Alert ALT-9001 broadcast in English, Telugu & Hindi",
  "20. Rescue Team RSC-T01 receives & ACCEPTS assignment via Mobile Board",
  "21. Rescue Team RSC-T01 STARTS JOURNEY via ROUTE-2",
  "22. Rescue Team RSC-T01 ARRIVES ON SCENE at Musi River Bank Sector 4",
  "23. Evacuation Operation STARTED - 420 citizens transported to SHL-01",
  "24. Real-time Incident Timeline updates via WebSocket live feed",
  "25. Water level decreases below critical threshold (2.8m)",
  "26. Disaster Operations Commander marks situation UNDER CONTROL",
  "27. Incident INC-1001 marked RESOLVED",
  "28. Final Emergency Incident PDF/CSV Summary Report generated",
  "29. Response Performance analytics records 11.2 min response latency (38% efficiency gain)"
];

export const DemoScenarioRunner: React.FC<DemoScenarioRunnerProps> = ({ onClose, onRefreshData }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  const executeStep = async (stepIndex: number) => {
    const stepText = scenarioSteps[stepIndex];
    setStatusLog(prev => [stepText, ...prev]);

    try {
      if (stepIndex === 1) {
        // Ingest telemetry reading to trigger sensor rules
        await sensorsApi.ingestReading('WTR-101', 4.2);
      } else if (stepIndex === 7) {
        // Citizen report
        await citizenReportsApi.submit({
          citizen_name: "Srinivas Rao",
          citizen_phone: "+91 98765 43210",
          emergency_type: "Flood",
          description: "Water level rose 4 feet. 12 houses cut off near river bank.",
          lat: 17.385,
          lng: 78.486,
          address: "River Bank Colony Sector 4"
        });
      } else if (stepIndex === 18) {
        // Evacuation plan
        await evacuationApi.createPlan(1, 1000);
      } else if (stepIndex === 19) {
        // Broadcast Alert
        await alertsApi.create({
          title: "CRITICAL FLOOD EVACUATION WARNING - ZONE 3",
          message_en: "Water level in Musi River basin has exceeded 4.2m. Evacuate immediately to Central Sports Complex Shelter.",
          severity: "CRITICAL",
          affected_zone_name: "Zone 3 River Bank"
        });
      }
    } catch (e) {
      console.error(`Step ${stepIndex + 1} execution note:`, e);
    }

    if (onRefreshData) onRefreshData();
  };

  const handleNextStep = () => {
    if (currentStep < scenarioSteps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      executeStep(next);
    }
  };

  const handleAutoRun = () => {
    setIsAutoRunning(true);
    let idx = currentStep;
    const interval = setInterval(() => {
      if (idx < scenarioSteps.length - 1) {
        idx++;
        setCurrentStep(idx);
        executeStep(idx);
      } else {
        clearInterval(interval);
        setIsAutoRunning(false);
      }
    }, 1200);
  };

  const progressPercent = Math.round(((currentStep + 1) / scenarioSteps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#131b2e] border border-amber-500/40 rounded-2xl p-6 max-w-2xl w-full shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">29-STEP FLOOD CRISIS DEMO SCENARIO</h3>
              <p className="text-xs text-slate-400">End-to-End Operational Lifecycle Execution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Step {currentStep + 1} of {scenarioSteps.length}</span>
            <span className="text-cyan-400 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step Active Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 mb-4 space-y-2">
          <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
            CURRENT STEP
          </span>
          <h4 className="text-sm font-bold text-white">{scenarioSteps[currentStep]}</h4>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleAutoRun}
            disabled={isAutoRunning || currentStep >= scenarioSteps.length - 1}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            {isAutoRunning ? 'AUTO-PLAYING...' : 'AUTO-PLAY DEMO'}
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStep >= scenarioSteps.length - 1}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            <span>NEXT STEP</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
