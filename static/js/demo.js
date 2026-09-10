/* Pure JavaScript 29-Step Flood Emergency Demo Runner */

const scenarioStepsList = [
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

let currentDemoStep = 0;
let isDemoRunning = false;

function openDemoModal() {
  document.getElementById('demo-modal').style.display = 'flex';
  updateDemoUI();
}

function closeDemoModal() {
  document.getElementById('demo-modal').style.display = 'none';
}

function updateDemoUI() {
  document.getElementById('demo-step-text').innerText = scenarioStepsList[currentDemoStep];
  document.getElementById('demo-step-num').innerText = `Step ${currentDemoStep + 1} of ${scenarioStepsList.length}`;
  const pct = Math.round(((currentDemoStep + 1) / scenarioStepsList.length) * 100);
  document.getElementById('demo-progress-pct').innerText = `${pct}% Completed`;
  document.getElementById('demo-progress-bar').style.width = `${pct}%`;
}

async function nextDemoStep() {
  if (currentDemoStep < scenarioStepsList.length - 1) {
    currentDemoStep++;
    updateDemoUI();

    // Trigger REST API calls at key milestones
    if (currentDemoStep === 1) {
      await CrisisAPI.ingestSensorReading('WTR-101', 4.2);
    } else if (currentDemoStep === 7) {
      await CrisisAPI.submitCitizenReport({
        citizen_name: "Srinivas Rao",
        citizen_phone: "+91 98765 43210",
        emergency_type: "Flood",
        description: "Water level rose 4 feet in Sector 4.",
        lat: 17.385, lng: 78.486, address: "Sector 4 Musi River Bank"
      });
    } else if (currentDemoStep === 18) {
      await CrisisAPI.createEvacuationPlan(1, 1000);
    }

    if (window.loadDashboardData) window.loadDashboardData();
  }
}

function autoPlayDemo() {
  isDemoRunning = true;
  document.getElementById('btn-auto-demo').innerText = 'PLAYING...';
  const timer = setInterval(() => {
    if (currentDemoStep < scenarioStepsList.length - 1) {
      nextDemoStep();
    } else {
      clearInterval(timer);
      isDemoRunning = false;
      document.getElementById('btn-auto-demo').innerText = 'AUTO-PLAY DEMO';
    }
  }, 1200);
}
