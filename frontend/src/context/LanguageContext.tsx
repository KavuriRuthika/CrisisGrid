import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'te' | 'hi';

const translations: Record<Language, Record<string, string>> = {
  en: {
    command_center: "Digital Crisis Command Center",
    tagline: "DETECT. COORDINATE. RESPOND. RESOLVE.",
    active_incidents: "Active Incidents",
    critical_incidents: "Critical Incidents",
    high_priority: "High Priority",
    ambulances_available: "Available Ambulances",
    rescue_teams: "Available Rescue Teams",
    hospital_beds: "Hospital Beds Available",
    shelter_capacity: "Shelter Capacity Available",
    report_emergency: "REPORT EMERGENCY",
    send_alert: "SEND EMERGENCY ALERT",
    dispatch_ambulance: "DISPATCH AMBULANCE",
    dispatch_rescue: "DISPATCH RESCUE TEAM",
    contact_hospital: "CONTACT HOSPITAL",
    activate_shelter: "ACTIVATE SHELTER",
    find_route: "FIND SAFE ROUTE",
    start_evacuation: "START EVACUATION",
    live_map: "Live Crisis Map",
    incident_list: "Incident Operations",
    resources: "Resource Allocation",
    evacuation: "Evacuation Planner",
    iot_sensors: "IoT Sensor Telemetry",
    alerts: "Emergency Alert Broadcast",
    analytics: "Crisis Analytics & KPIs",
    simulation: "Disaster Simulation Sandbox",
    audit_logs: "Audit Trail History",
    quick_role_switch: "Switch View Role:",
  },
  te: {
    command_center: "డిజిటల్ విపత్తు కమాండ్ సెంటర్",
    tagline: "గుర్తించండి. సమన్వయం చేయండి. స్పందించండి. పరిష్కరించండి.",
    active_incidents: "యాక్టివ్ అత్యవసర సంఘటనలు",
    critical_incidents: "కీలక ప్రమాదకర సంఘటనలు",
    high_priority: "అధిక ప్రాధాన్యత",
    ambulances_available: "అందుబాటులో ఉన్న అంబులెన్సులు",
    rescue_teams: "అందుబాటులో ఉన్న రక్షణ బృందాలు",
    hospital_beds: "అందుబాటులో ఉన్న ఆసుపత్రి పడకలు",
    shelter_capacity: "పునరావాస కేంద్రాల సామర్థ్యం",
    report_emergency: "అత్యవసర నివేదిక ఇవ్వండి",
    send_alert: "అత్యవసర హెచ్చరిక పంపండి",
    dispatch_ambulance: "అంబులెన్స్ పంపండి",
    dispatch_rescue: "రక్షణ బృందాన్ని పంపండి",
    contact_hospital: "ఆసుపత్రిని సంప్రదించండి",
    activate_shelter: "పునరావాస కేంద్రాన్ని ప్రారంభించండి",
    find_route: "సురక్షిత మార్గం కనుగొనండి",
    start_evacuation: "తరలింపు ప్రారంభించండి",
    live_map: "లైవ్ సంక్షోభ మ్యాప్",
    incident_list: "సంఘటనల జాబితా",
    resources: "వనరుల కేటాయింపు",
    evacuation: "తరలింపు ప్రణాళిక",
    iot_sensors: "IoT సెన్సార్ సమాచారం",
    alerts: "అత్యవసర హెచ్చరికల వ్యవస్థ",
    analytics: "సంక్షోభ విశ్లేషణలు",
    simulation: "విపత్తు అనుకరణ మోడ్",
    audit_logs: "ఆడిట్ ల్యాగ్ రికార్డులు",
    quick_role_switch: "పాత్రను మార్చండి:",
  },
  hi: {
    command_center: "डिजिटल संकट कमान केंद्र",
    tagline: "पहचानें। समन्वय करें। प्रतिक्रिया दें। हल करें।",
    active_incidents: "सक्रिय आपातकालीन घटनाएं",
    critical_incidents: "गंभीर आपात स्थिति",
    high_priority: "उच्च प्राथमिकता",
    ambulances_available: "उपलब्ध एम्बुलेंस",
    rescue_teams: "उपलब्ध बचाव दल",
    hospital_beds: "उपलब्ध अस्पताल बिस्तर",
    shelter_capacity: "उपलब्ध आश्रय क्षमता",
    report_emergency: "आपातकाल की रिपोर्ट करें",
    send_alert: "आपातकालीन चेतावनी भेजें",
    dispatch_ambulance: "एम्बुलेंस भेजें",
    dispatch_rescue: "बचाव दल भेजें",
    contact_hospital: "अस्पताल से संपर्क करें",
    activate_shelter: "आश्रय स्थल सक्रिय करें",
    find_route: "सुरक्षित मार्ग खोजें",
    start_evacuation: "निकासी शुरू करें",
    live_map: "लाइव संकट मानचित्र",
    incident_list: "घटना संचालन",
    resources: "संसाधन आवंटन",
    evacuation: "निकासी योजना",
    iot_sensors: "IoT सेंसर टेलीमेट्री",
    alerts: "आपातकालीन चेतावनी प्रसारण",
    analytics: "संकट विश्लेषण एवं KPIs",
    simulation: "आपदा सिमुलेशन सैंडबॉक्स",
    audit_logs: "ऑडिट ट्रेल इतिहास",
    quick_role_switch: "भूमिका बदलें:",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
