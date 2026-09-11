/* Main Application Controller in Pure Vanilla JavaScript */

let currentRole = 'AUTHORITY';
let currentLang = 'en';
let currentActiveTab = 'command-center';
let globalIncidents = [];
let globalHospitals = [];
let globalShelters = [];
let globalResources = [];
let globalSensors = [];

// Comprehensive Multilingual Dictionary for Full Webpage Translation
const i18n = {
  en: {
    title: "CrisisGrid: Real-Time Emergency Response & Coordination Platform",
    tagline: "DETECT. COORDINATE. RESPOND. RESOLVE.",
    live_ws: "LIVE WEBSOCKETS",

    kpi_active: "ACTIVE INCIDENTS:",
    kpi_critical: "CRITICAL:",
    kpi_high: "HIGH PRIORITY:",
    kpi_ambulances: "AMBULANCES:",
    kpi_rescue: "RESCUE TEAMS:",
    kpi_beds: "HOSPITAL BEDS:",
    kpi_shelters: "SHELTER CAP:",

    nav_command_center: "🗺️ Live Crisis Map",
    nav_incidents: "🛡️ Incident Operations",
    nav_resources: "🚛 Resource Allocation",
    nav_routes: "↗️ Emergency Route Solver",
    nav_evacuation: "🔄 Evacuation Planner",
    nav_sensors: "📡 IoT Sensor Telemetry",
    nav_alerts: "📢 Emergency Alert Broadcast",
    nav_hospitals: "🏥 Hospital Capacity",
    nav_shelters: "🏠 Relief Shelters",
    nav_analytics: "📊 Crisis Analytics & KPIs",
    nav_simulation: "⚙️ Disaster Simulation",
    nav_audit: "📜 Audit Trail History",
    nav_citizen_portal: "👤 Citizen Reporting Portal",
    nav_rescue_dashboard: "🛟 Rescue Team Board",

    qa_title: "EMERGENCY COMMAND QUICK ACTIONS",
    qa_tag: "1-CLICK OPERATION DISPATCH",
    qa_report: "🛡️ REPORT INCIDENT",
    qa_alert: "📢 SEND ALERT",
    qa_ambulance: "🚑 DISPATCH AMBULANCE",
    qa_rescue: "👨‍🚒 DISPATCH RESCUE",
    qa_hospital: "🏥 CONTACT HOSPITAL",
    qa_shelter: "🏠 ACTIVATE SHELTER",
    qa_route: "🛣 FIND SAFE ROUTE",
    qa_evacuate: "🚨 START EVACUATION",

    map_center_india: "📍 CENTER: INDIA",
    map_center_world: "🌍 WORLD VIEW",
    tactical_layers: "TACTICAL LAYERS",
    layer_disasters: "🚨 Disasters",
    layer_sensors: "📡 IoT Sensors",
    layer_hospitals: "🏥 Hospitals",
    layer_shelters: "⛺ Shelters",
    layer_threats: "🛡️ Threat Polygons",
    basemap_style: "🌐 BASEMAP STYLE:",
    bm_dark: "DARK TACTICAL",
    bm_streets: "WORLD STREETS",
    bm_political: "POLITICAL OSM",
    bm_satellite: "SATELLITE",
    map_status_badge: "PAN-INDIA & GLOBAL NATURAL DISASTER MATRIX ACTIVE",

    inc_dir_title: "INCIDENT OPERATIONS DIRECTORY",
    inc_dir_sub: "Sorted by Priority Score (0-100+)",
    btn_new_inc: "+ NEW INCIDENT",
    route_solver_title: "EMERGENCY ROUTE NAVIGATION SOLVER",
    route_solver_sub: "Dijkstra pathfinder avoiding flooded & blocked road segments",
    label_res_coords: "RESOURCE LAT/LNG",
    label_dest_coords: "EMERGENCY DESTINATION",
    btn_calc_route: "CALCULATE SAFE BYPASS ROUTE",

    iot_header: "IOT TELEMETRY & AUTOMATED RULE ENGINE",
    iot_sub: "Automated sensor threshold monitoring & alert trigger pipeline",
    btn_start_stream: "⚡ START AUTO-LIVE STREAM",
    btn_stop_stream: "⏸ STOP LIVE STREAM",
    label_manual_ingest: "MANUAL INGESTION:",
    btn_ingest: "INGEST TELEMETRY",
    iot_grid_title: "ACTIVE IOT SENSOR TELEMETRY GRID",

    resources_title: "EMERGENCY RESOURCE FLEET DIRECTORY",
    hospitals_title: "HOSPITAL BED & EMERGENCY CAPACITY",
    shelters_title: "RELIEF SHELTER OCCUPANCY & SUPPLIES",
    
    btn_run_demo: "▶ RUN FLOOD DEMO SCENARIO",
    role_label: "ROLE:",
    active_role_prefix: "Active Role:"
  },

  te: {
    title: "CrisisGrid: రియల్-టైమ్ ఎమర్జెన్సీ రెస్పాన్స్ & కోఆర్డినేషన్ ప్లాట్‌ఫాం",
    tagline: "గుర్తించండి. సమన్వయం చేయండి. స్పందించండి. పరిష్కరించండి.",
    live_ws: "లైవ్ వెబ్‌సాకెట్లు",

    kpi_active: "యాక్టివ్ సంఘటనలు:",
    kpi_critical: "కీలక ప్రమాదం:",
    kpi_high: "అధిక ప్రాధాన్యత:",
    kpi_ambulances: "అంబులెన్సులు:",
    kpi_rescue: "రక్షణ బృందాలు:",
    kpi_beds: "ఆసుపత్రి పడకలు:",
    kpi_shelters: "పునరావాస సామర్థ్యం:",

    nav_command_center: "🗺️ లైవ్ క్రిటికల్ మ్యాప్",
    nav_incidents: "🛡️ సంఘటన నిర్వహణ",
    nav_resources: "🚛 వనరుల కేటాయింపు",
    nav_routes: "↗️ అత్యవసర మార్గ నిర్ధారణ",
    nav_evacuation: "🔄 ఖాళీ చేయించే ప్రణాళిక",
    nav_sensors: "📡 ఐఓటి సెన్సార్ సమాచారం",
    nav_alerts: "📢 అత్యవసర హెచ్చరికల ప్రసారం",
    nav_hospitals: "🏥 ఆసుపత్రి సామర్థ్యం",
    nav_shelters: "🏠 పునరావాస కేంద్రాలు",
    nav_analytics: "📊 క్రిటికల్ విశ్లేషణలు",
    nav_simulation: "⚙️ విపత్తు సిమ్యులేషన్",
    nav_audit: "📜 ఆడిట్ చరిత్ర log",
    nav_citizen_portal: "👤 పౌరుల నివేదిక పోర్టల్",
    nav_rescue_dashboard: "🛟 రక్షణ బృందం బోర్డు",

    qa_title: "అత్యవసర కమాండ్ త్వరిత చర్యలు",
    qa_tag: "1-క్లిక్ ఆపరేషన్ డిస్పాచ్",
    qa_report: "🛡️ సంఘటన నమోదు",
    qa_alert: "📢 హెచ్చరిక పంపండి",
    qa_ambulance: "🚑 అంబులెన్స్ పంపండి",
    qa_rescue: "👨‍🚒 రక్షణ దళం పంపండి",
    qa_hospital: "🏥 ఆసుపత్రిని సంప్రదించండి",
    qa_shelter: "🏠 షెల్టర్ యాక్టివేట్ చేయండి",
    qa_route: "🛣 సురక్షిత మార్గం చూడండి",
    qa_evacuate: "🚨 ఖాళీ చేయించడం ప్రారంభించండి",

    map_center_india: "📍 కేంద్రం: భారతదేశం",
    map_center_world: "🌍 ప్రపంచ చిత్రం",
    tactical_layers: "టాక్టికల్ పొరలు",
    layer_disasters: "🚨 విపత్తులు",
    layer_sensors: "📡 ఐఓటి సెన్సార్లు",
    layer_hospitals: "🏥 ఆసుపత్రులు",
    layer_shelters: "⛺ పునరావాస కేంద్రాలు",
    layer_threats: "🛡️ ప్రమాద మండలాలు",
    basemap_style: "🌐 మ్యాప్ శైలి:",
    bm_dark: "డార్క్ టాక్టికల్",
    bm_streets: "వరల్డ్ స్ట్రీట్స్",
    bm_political: "రాజకీయ OSM మ్యాప్",
    bm_satellite: "శాటిలైట్ మ్యాప్",
    map_status_badge: "భారతదేశం మరియు ప్రపంచ విపత్తు మ్యాట్రిక్స్ యాక్టివ్",

    inc_dir_title: "సంఘటనల నిర్వహణ డైరెక్టరీ",
    inc_dir_sub: "ప్రాధాన్యత స్కోరు క్రమంలో అమర్చబడింది (0-100+)",
    btn_new_inc: "+ కొత్త సంఘటన",
    route_solver_title: "అత్యవసర సురక్షిత మార్గ నెవిగేషన్",
    route_solver_sub: "వరదలు మరియు మూసివేసిన రోడ్లను మినహాయించే మార్గం",
    label_res_coords: "వనరుల లొకేషన్ (అక్షాంశం/రేఖాంశం)",
    label_dest_coords: "అత్యవసర గమ్యస్థానం",
    btn_calc_route: "సురక్షిత బైపాస్ మార్గాన్ని లెక్కించండి",

    iot_header: "ఐఓటి టెలిమెట్రీ & ఆటోమేటెడ్ రూల్ ఇంజన్",
    iot_sub: "స్వయంచాలక సెన్సార్ పరిమితుల పరిశీలన & హెచ్చరికల వ్యవస్థ",
    btn_start_stream: "⚡ లైవ్ స్ట్రీమ్ ప్రారంభించండి",
    btn_stop_stream: "⏸ లైవ్ స్ట్రీమ్ ఆపండి",
    label_manual_ingest: "మాన్యువల్ నమోదు:",
    btn_ingest: "డేటా నమోదు చేయండి",
    iot_grid_title: "యాక్టివ్ ఐఓటి సెన్సార్ టెలిమెట్రీ గ్రిడ్",

    resources_title: "అత్యవసర వనరుల జాబితా",
    hospitals_title: "ఆసుపత్రి పడకలు & అత్యవసర సామర్థ్యం",
    shelters_title: "పునరావాస కేంద్రాల సదుపాయాలు",

    btn_run_demo: "▶ వరద డెమో సినారియో రన్ చేయండి",
    role_label: "పాత్ర:",
    active_role_prefix: "ప్రస్తుత పాత్ర:"
  },

  hi: {
    title: "CrisisGrid: रियल-टाइम आपातकालीन प्रतिक्रिया एवं समन्वय मंच",
    tagline: "पहचानें। समन्वय करें। प्रतिक्रिया दें। हल करें।",
    live_ws: "लाइव वेबसॉकेट",

    kpi_active: "सक्रिय घटनाएं:",
    kpi_critical: "गंभीर स्थिति:",
    kpi_high: "उच्च प्राथमिकता:",
    kpi_ambulances: "एम्बुलेंस:",
    kpi_rescue: "बचाव दल:",
    kpi_beds: "अस्पताल बिस्तर:",
    kpi_shelters: "आश्रय क्षमता:",

    nav_command_center: "🗺️ लाइव संकट मानचित्र",
    nav_incidents: "🛡️ घटना संचालन",
    nav_resources: "🚛 संसाधन आवंटन",
    nav_routes: "↗️ आपातकालीन मार्ग समाधान",
    nav_evacuation: "🔄 निकासी योजना",
    nav_sensors: "📡 IoT सेंसर टेलीमेट्री",
    nav_alerts: "📢 आपातकालीन चेतावनी प्रसारण",
    nav_hospitals: "🏥 अस्पताल क्षमता",
    nav_shelters: "🏠 राहत शिविर",
    nav_analytics: "📊 संकट विश्लेषण",
    nav_simulation: "⚙️ आपदा सिमुलेशन",
    nav_audit: "📜 ऑडिट इतिहास लॉग",
    nav_citizen_portal: "👤 नागरिक रिपोर्टिंग पोर्टल",
    nav_rescue_dashboard: "🛟 बचाव दल बोर्ड",

    qa_title: "आपातकालीन कमान त्वरित कार्रवाई",
    qa_tag: "1-क्लिक ऑपरेशन डिस्पैच",
    qa_report: "🛡️ घटना की रिपोर्ट करें",
    qa_alert: "📢 अलर्ट भेजें",
    qa_ambulance: "🚑 एम्बुलेंस भेजें",
    qa_rescue: "👨‍🚒 बचाव दल भेजें",
    qa_hospital: "🏥 अस्पताल से संपर्क करें",
    qa_shelter: "🏠 आश्रय सक्रिय करें",
    qa_route: "🛣 सुरक्षित मार्ग खोजें",
    qa_evacuate: "🚨 निकासी शुरू करें",

    map_center_india: "📍 केंद्र: भारत",
    map_center_world: "🌍 विश्व मानचित्र",
    tactical_layers: "रणनीतिक परतें",
    layer_disasters: "🚨 आपदाएं",
    layer_sensors: "📡 IoT सेंसर",
    layer_hospitals: "🏥 अस्पताल",
    layer_shelters: "⛺ राहत शिविर",
    layer_threats: "🛡️ खतरा क्षेत्र",
    basemap_style: "🌐 मानचित्र शैली:",
    bm_dark: "डार्क टैक्टिकल",
    bm_streets: "वर्ल्ड स्ट्रीट्स",
    bm_political: "राजनीतिक OSM",
    bm_satellite: "सैटेलाइट मैप",
    map_status_badge: "भारत एवं वैश्विक आपदा मैट्रिक्स सक्रिय",

    inc_dir_title: "घटना संचालन निर्देशिका",
    inc_dir_sub: "प्राथमिकता स्कोर के अनुसार क्रमित (0-100+)",
    btn_new_inc: "+ नई घटना",
    route_solver_title: "आपातकालीन मार्ग नेविगेशन",
    route_solver_sub: "बाढ़ और अवरुद्ध सड़कों से बचने वाला मार्ग",
    label_res_coords: "संसाधन स्थान (अक्षांश/देशांतर)",
    label_dest_coords: "आपातकालीन गंतव्य",
    btn_calc_route: "सुरक्षित बाईपास मार्ग की गणना करें",

    iot_header: "IOT टेलीमेट्री और स्वचालित नियम इंजन",
    iot_sub: "स्वचालित सेंसर सीमा निगरानी और चेतावनी प्रणाली",
    btn_start_stream: "⚡ लाइव स्ट्रीम शुरू करें",
    btn_stop_stream: "⏸ लाइव स्ट्रीम रोकें",
    label_manual_ingest: "मैनुअल प्रविष्टि:",
    btn_ingest: "डेटा दर्ज करें",
    iot_grid_title: "सक्रिय IOT सेंसर टेलीमेट्री ग्रिड",

    resources_title: "आपातकालीन संसाधन बेड़ा निर्देशिका",
    hospitals_title: "अस्पताल बिस्तर और आपातकालीन क्षमता",
    shelters_title: "राहत शिविर क्षमता और सुविधाएं",

    btn_run_demo: "▶ बाढ़ डेमो परिदृश्य चलाएं",
    role_label: "भूमिका:",
    active_role_prefix: "सक्रिय भूमिका:"
  }
};

// Global Translation Helper
window.t = function(str) {
  if (!str) return '';
  if (currentLang === 'en') return str;
  const dict = i18n[currentLang] || {};
  return dict[str] || str;
};

// Dynamic Translation Dictionary for seeded disasters & UI elements
i18n.te = Object.assign(i18n.te || {}, {
  "CRITICAL": "కీలక ప్రమాదం",
  "HIGH": "అధిక ప్రాధాన్యత",
  "MEDIUM": "మధ్యమ ప్రాధాన్యత",
  "LOW": "సాధారణ ప్రాధాన్యత",
  "Dispatch Resource": "వనరులను పంపండి",
  "Timeline Log": "టైమ్‌లైన్ లాగ్",
  "Score:": "స్కోర్:",
  "General Beds:": "సాధారణ పడకలు:",
  "ICU:": "ఐసీయూ పడకలు:",
  "Available Capacity:": "అందుబాటులోని సామర్థ్యం:",
  "beds": "పడకలు",
  "Reading:": "రీడింగ్:",
  "Crit Threshold:": "పరిమితి సామర్థ్యం:",
  "Type:": "రకం:",
  "Contact:": "సంప్రదించండి:",
  "cit_sub": "చిరునామా, సంప్రదింపు వివరాలు మరియు సంఘటన వివరాలతో అధికారిక అత్యవసర ఫిర్యాదు నమోదు చేయండి",
  "lbl_cit_name": "పౌరుడి పూర్తి పేరు *",
  "lbl_cit_phone": "ఫోన్ నంబరు *",
  "lbl_cit_cause": "అత్యవసర కారణం / విపత్తు రకం *",
  "lbl_cit_address": "చిరునామా మరియు ల్యాండ్‌మార్క్ *",
  "lbl_cit_desc": "పరిస్థితి వివరాలు & అత్యవసర సహాయం *",
  "btn_submit_complaint": "🛡️ అధికారిక అత్యవసర ఫిర్యాదు నమోదు చేయండి",
  "cit_feed_title": "లైవ్ సమర్పించిన పౌరుల ఫిర్యాదులు",
  "cit_feed_sub": "రియల్-టైమ్ పరిశీలన వ్యవస్థ",
  "SUBMITTED": "ఫిర్యాదు స్వీకరించబడింది",
  "VERIFIED": "పరిశీలించబడింది",

  "Kerala Landslide & Debris Flow": "కేరళ కొండచరియలు & బురద ప్రవాహం",
  "Mumbai Urban Flash Flood": "ముంబై అర్బన్ హఠాత్తు వరదలు",
  "Gujarat Cyclone & Coastal Surge": "గుజరాత్ తుఫాను & తీరప్రాంత ఉప్పెన",
  "Uttarakhand Himalayan Glacial Burst": "ఉత్తరాఖండ్ హిమానీనదం పేలుడు",
  "Chennai Urban Inundation": "చెన్నై అర్బన్ వరద ముంపు",
  "Assam Brahmaputra River Flood": "అస్సాం బ్రహ్మపుత్ర నది వరదలు",
  "Odisha Super Cyclone Biparjoy": "ఒడిశా సూపర్ తుఫాను బిపర్జాయ్",
  "Himachal Avalanche & Snowstorm": "హిమాచల్ మంచు తుఫాను & హిమపాతం",
  "Vizag Chemical Gas Leak Emergency": "విశాఖ రసాయన వాయు లీకేజీ",
  "Bengaluru Tech Corridor Waterlogging": "బెంగళూరు టెక్ కారిడార్ నీటిముంపు",
  "Delhi Yamuna River Crest Surge": "డిల్లీ యమునా నది వరద ఉప్పెన",
  "Japan Tokyo 6.8 Earthquake": "జపాన్ టోక్యో 6.8 భూకంపం",
  "California Wildfire Outbreak": "కాలిఫోర్నియా కార్చిచ్చు",
  "Indonesia Krakatoa Volcanic Eruption": "ఇండోనేషియా క్రకటోవా అగ్నిపర్వతం",
  "Mediterranean Marine Storm Surge": "మెడిటరేనియన్ సముద్ర తుఫాను",
  "East Africa Severe Drought Matrix": "తూర్పు ఆఫ్రికా తీవ్ర కరువు",
  "Iceland Volcanic Fissure Eruption": "ఐస్‌లాండ్ అగ్నిపర్వతం పగుళ్ల పేలుడు",
  "Turkey Gaziantep Aftershock Zone": "టర్కీ గాజియాంటెప్ భూకంప అనంతర తీవ్రత",
  "Chile Andes Landslide Slip": "చిలీ ఆండీస్ కొండచరియలు జారడం",
  "Australia Bushfire Defense Front": "ఆస్ట్రేలియా కార్చిచ్చు నిరోధక దాడి",
  "Pacific Tsunami Early Warning Zone": "పసిఫిక్ సునామీ ముందస్తు హెచ్చరిక",
  "Central India Heatwave Alert": "మధ్య భారతదేశ తీవ్ర వేడిగాలుల హెచ్చరిక",
  "Punjab Agricultural Inundation": "పంజాబ్ వ్యవసాయ భూముల వరదలు",
  "Goa Coastal Wave Surge Alert": "గోవా తీరప్రాంత అలల ఉప్పెన",
  "Sikkim Flash Flood & Bridge Collapse": "సిక్కిం హఠాత్తు వరదలు & వంతెన కూలిపోవడం",
  "Kashmir Snow Avalanche Emergency": "కాశ్మీర్ మంచు హిమపాతం అత్యవసర పరిస్థితి",
  "Yamuna Expressway Multi-Vehicle Collision": "యమునా ఎక్స్‌ప్రెస్‌వే వాహనాల ఢీ",
  "Kolkata Cyclone Storm Readiness": "కోల్‌కతా తుఫాను ముందస్తు సిద్ధత",
  "Bay of Bengal Depression Surge": "బంగాళాఖాతం అల్పపీడన ఉప్పెన",
  "Wayanad Debris Recovery Zone": "వయనాడ్ బురద శోధన మరియు పునరుద్ధరణ"
});

i18n.hi = Object.assign(i18n.hi || {}, {
  "CRITICAL": "गंभीर स्थिति",
  "HIGH": "उच्च प्राथमिकता",
  "MEDIUM": "मध्यम प्राथमिकता",
  "LOW": "कम प्राथमिकता",
  "Dispatch Resource": "संसाधन भेजें",
  "Timeline Log": "टाइमलाइन लॉग",
  "Score:": "स्कोर:",
  "General Beds:": "सामान्य बिस्तर:",
  "ICU:": "आईसीयू बिस्तर:",
  "Available Capacity:": "उपलब्ध क्षमता:",
  "beds": "बिस्तर",
  "Reading:": "रीडिंग:",
  "Crit Threshold:": "सीमा सीमा:",
  "Type:": "प्रकार:",
  "Contact:": "संपर्क:",
  "cit_sub": "पता, संपर्क फोन नंबर और स्थिति विवरण के साथ आधिकारिक आपातकालीन शिकायत दर्ज करें",
  "lbl_cit_name": "नागरिक का पूरा नाम *",
  "lbl_cit_phone": "फोन नंबर *",
  "lbl_cit_cause": "आपातकालीन कारण / आपदा का प्रकार *",
  "lbl_cit_address": "पता और लैंडमार्क *",
  "lbl_cit_desc": "स्थिति विवरण और तत्काल सहायता आवश्यक *",
  "btn_submit_complaint": "🛡️ आधिकारिक आपातकालीन शिकायत दर्ज करें",
  "cit_feed_title": "लाइव दर्ज नागरिक शिकायतों की सूची",
  "cit_feed_sub": "रियल-टाइम सत्यापन प्रणाली",
  "SUBMITTED": "शिकायत प्राप्त",
  "VERIFIED": "सत्यापित",

  "Kerala Landslide & Debris Flow": "केरल भूस्खलन और मलबे का बहाव",
  "Mumbai Urban Flash Flood": "मुंबई शहरी अचानक बाढ़",
  "Gujarat Cyclone & Coastal Surge": "गुजरात चक्रवात और तटीय लहरें",
  "Uttarakhand Himalayan Glacial Burst": "उत्तराखंड हिमालयी ग्लेशियर विस्फोट",
  "Chennai Urban Inundation": "चेन्नई शहरी जलभराव",
  "Assam Brahmaputra River Flood": "असम ब्रह्मपुत्र नदी की बाढ़",
  "Odisha Super Cyclone Biparjoy": "ओडिशा सुपर चक्रवात बिपरजॉय",
  "Himachal Avalanche & Snowstorm": "हिमाचल हिमस्खलन और बर्फबारी",
  "Vizag Chemical Gas Leak Emergency": "विशाखापट्टनम रासायनिक गैस रिसाव",
  "Bengaluru Tech Corridor Waterlogging": "बेंगलुरु टेक कॉरिडोर जलभराव",
  "Delhi Yamuna River Crest Surge": "दिल्ली यमुना नदी बाढ़ का जलस्तर",
  "Japan Tokyo 6.8 Earthquake": "जापान टोक्यो 6.8 भूकंप",
  "California Wildfire Outbreak": "कैलिफोर्निया दावानल (जंगल की आग)",
  "Indonesia Krakatoa Volcanic Eruption": "इंडोनेशिया क्राकाटोआ ज्वालामुखी विस्फोट",
  "Mediterranean Marine Storm Surge": "भूमध्यसागरीय समुद्री तूफान",
  "East Africa Severe Drought Matrix": "पूर्वी अफ्रीका भीषण सूखा",
  "Iceland Volcanic Fissure Eruption": "आइसलैंड ज्वालामुखी दरार विस्फोट",
  "Turkey Gaziantep Aftershock Zone": "तुर्की गाज़ियांतप भूकंप के झटके",
  "Chile Andes Landslide Slip": "चिली एंडीज़ भूस्खलन",
  "Australia Bushfire Defense Front": "ऑस्ट्रेलिया जंगलों की आग",
  "Pacific Tsunami Early Warning Zone": "प्रशांत सुनामी प्रारंभिक चेतावनी",
  "Central India Heatwave Alert": "मध्य भारत भीषण लू की चेतावनी",
  "Punjab Agricultural Inundation": "पंजाब कृषि जलभराव",
  "Goa Coastal Wave Surge Alert": "गोवा तटीय लहरों की चेतावनी",
  "Sikkim Flash Flood & Bridge Collapse": "सिक्किम अचानक बाढ़ और पुल ढहा",
  "Kashmir Snow Avalanche Emergency": "कश्मीर हिमस्खलन आपातकाल",
  "Yamuna Expressway Multi-Vehicle Collision": "यमुना एक्सप्रेसवे बहु-वाहन दुर्घटना",
  "Kolkata Cyclone Storm Readiness": "कोलकाता चक्रवात तूफान तैयारी",
  "Bay of Bengal Depression Surge": "बंगाल की खाड़ी में दबाव का प्रभाव",
  "Wayanad Debris Recovery Zone": "वायनाड मलबा बहाव पुनर्प्राप्ति क्षेत्र"
});

document.addEventListener('DOMContentLoaded', () => {
  initCrisisMap();
  loadDashboardData();
  initWebSocket();
  setupEventListeners();
  setInterval(loadDashboardData, 8000);
});

async function loadDashboardData() {
  try {
    const [inc, hosp, shl, res, sns, kpis] = await Promise.all([
      CrisisAPI.getIncidents(),
      CrisisAPI.getHospitals(),
      CrisisAPI.getShelters(),
      CrisisAPI.getResources(),
      CrisisAPI.getSensors(),
      CrisisAPI.getKPIs()
    ]);

    const safeInc = Array.isArray(inc) ? inc : [];
    const safeHosp = Array.isArray(hosp) ? hosp : [];
    const safeShl = Array.isArray(shl) ? shl : [];
    const safeRes = Array.isArray(res) ? res : [];
    const safeSns = Array.isArray(sns) ? sns : [];

    globalIncidents = safeInc;
    globalHospitals = safeHosp;
    globalShelters = safeShl;
    globalResources = safeRes;
    globalSensors = safeSns;

    updateKPICounters(kpis || {});
    renderMapIncidents(safeInc);
    renderMapHospitals(safeHosp);
    renderMapShelters(safeShl);
    renderMapSensors(safeSns);
    renderIncidentList(safeInc);
    renderResourceList(safeRes);
    renderHospitalList(safeHosp);
    renderShelterList(safeShl);
    renderSensorGrid(safeSns);
    loadCitizenReports();
    applyCurrentLanguage();
  } catch (e) {
    console.error("Error loading dashboard data:", e);
  }
}

async function loadCitizenReports() {
  try {
    const reports = await CrisisAPI.getCitizenReports();
    renderCitizenReportsList(reports);
  } catch (err) {
    console.error("Error loading citizen reports:", err);
  }
}

function renderCitizenReportsList(reports) {
  const container = document.getElementById('citizen-reports-feed-container');
  if (!container) return;

  if (!reports || reports.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; color:#94a3b8; font-size:12px; padding:16px; background:#0f172a; border-radius:10px; border:1px solid #1e293b;">No citizen complaints lodged yet. Lodge a complaint above.</div>`;
    return;
  }

  container.innerHTML = reports.map(r => `
    <div style="padding:14px; background:rgba(15,23,42,0.85); border:1px solid #1e293b; border-radius:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-family:monospace; font-size:11px; font-weight:bold; color:#06b6d4;">${r.report_code || 'REP-001'}</span>
        <span style="font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; ${r.status === 'VERIFIED' ? 'background:rgba(16,185,129,0.2); color:#34d399;' : 'background:rgba(245,158,11,0.2); color:#fbbf24;'}">${window.t(r.status || 'SUBMITTED')}</span>
      </div>
      <h5 style="color:#fff; font-size:13px; font-weight:bold; margin-bottom:4px;">${window.t(r.emergency_type)}</h5>
      <p style="font-size:11px; color:#cbd5e1; margin-bottom:4px;"><strong>👤 ${r.citizen_name}</strong> (${r.citizen_phone})</p>
      <p style="font-size:11px; color:#22d3ee; margin-bottom:6px;">📍 ${r.address || 'Address Not Specified'}</p>
      <p style="font-size:11px; color:#94a3b8; background:#0f172a; padding:8px; border-radius:6px; border:1px solid #1e293b;">${r.description}</p>
    </div>
  `).join('');
}

async function handleCitizenComplaintSubmit(e) {
  if (e) e.preventDefault();
  
  const name = document.getElementById('cit-name')?.value || '';
  const phone = document.getElementById('cit-phone')?.value || '';
  const cause = document.getElementById('cit-cause')?.value || 'Flood / Waterlogging';
  const address = document.getElementById('cit-address')?.value || '';
  const desc = document.getElementById('cit-desc')?.value || '';

  if (!name || !phone || !address || !desc) {
    showToast('⚠️ Missing Information', 'Please fill in your name, phone number, address, and situation details.');
    return;
  }

  try {
    const reportData = {
      citizen_name: name,
      citizen_phone: phone,
      emergency_type: cause,
      address: address,
      description: desc,
      lat: 17.3850,
      lng: 78.4867
    };

    const res = await CrisisAPI.submitCitizenReport(reportData);
    showToast('🛡️ EMERGENCY COMPLAINT SUBMITTED', `Complaint #${res.report_code || 'REP-OK'} registered successfully! Response team alerted.`);

    // Reset form
    if (document.getElementById('cit-name')) document.getElementById('cit-name').value = '';
    if (document.getElementById('cit-phone')) document.getElementById('cit-phone').value = '';
    if (document.getElementById('cit-address')) document.getElementById('cit-address').value = '';
    if (document.getElementById('cit-desc')) document.getElementById('cit-desc').value = '';

    loadCitizenReports();
  } catch (err) {
    showToast('❌ Submission Failed', 'Could not register citizen complaint.');
  }
}

function applyCurrentLanguage() {
  const dict = i18n[currentLang] || i18n['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });
}

function updateKPICounters(kpis) {
  document.getElementById('kpi-active').innerText = kpis.active_incidents || 12;
  document.getElementById('kpi-critical').innerText = kpis.critical_incidents || 3;
  document.getElementById('kpi-high').innerText = kpis.high_priority_incidents || 4;
  document.getElementById('kpi-ambulances').innerText = kpis.ambulances_available || 9;
  document.getElementById('kpi-rescue').innerText = kpis.rescue_teams_available || 6;
  document.getElementById('kpi-beds').innerText = kpis.hospital_beds_available || 48;
  document.getElementById('kpi-shelters').innerText = kpis.shelter_capacity_available || 2400;
}

function renderIncidentList(incidents) {
  const container = document.getElementById('incident-list-container');
  if (!container) return;

  container.innerHTML = incidents.map((inc, idx) => `
    <div class="incident-card" style="padding:12px; background:rgba(15,23,42,0.8); border:1px solid #1e293b; border-radius:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-family:monospace; font-size:11px; font-weight:bold; color:#64748b;">#${idx + 1}</span>
        <span style="font-family:monospace; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; ${getSevStyle(inc.severity)}">${window.t(inc.severity)}</span>
        <span style="font-family:monospace; font-size:11px; font-weight:bold; color:#22d3ee; background:rgba(6,182,212,0.1); padding:2px 6px; border-radius:4px;">${window.t('Score:')} ${inc.priority_score}</span>
      </div>
      <h4 style="color:#fff; font-size:13px; font-weight:bold; cursor:pointer;" onclick="openIncidentDetail(${inc.id})">${window.t(inc.title)}</h4>
      <p style="color:#94a3b8; font-size:11px; margin-top:4px;">${window.t(inc.description || '')}</p>
      
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button onclick="openResourceAllocator(${inc.id})" style="background:#0891b2; color:#0b0f19; font-weight:bold; font-size:11px; padding:6px 12px; border-radius:6px; border:none; cursor:pointer;">
          ${window.t('Dispatch Resource')}
        </button>
        <button onclick="openIncidentDetail(${inc.id})" style="background:#1e293b; color:#f8fafc; font-size:11px; padding:6px 12px; border-radius:6px; border:none; cursor:pointer;">
          ${window.t('Timeline Log')}
        </button>
      </div>
    </div>
  `).join('');
}

function getSevStyle(sev) {
  if (sev === 'CRITICAL') return 'background:rgba(239,68,68,0.2); color:#f87171; border:1px solid rgba(239,68,68,0.4);';
  if (sev === 'HIGH') return 'background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4);';
  return 'background:rgba(16,185,129,0.2); color:#34d399; border:1px solid rgba(16,185,129,0.4);';
}

function renderResourceList(resources) {
  const container = document.getElementById('resource-list-container');
  if (!container) return;
  container.innerHTML = resources.map(r => `
    <div style="padding:12px; background:rgba(15,23,42,0.8); border:1px solid #1e293b; border-radius:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between;">
        <strong style="color:#fff; font-size:12px;">${r.name} (${r.code})</strong>
        <span style="font-size:10px; font-weight:bold; color:#34d399;">${window.t(r.status)}</span>
      </div>
      <p style="font-size:11px; color:#94a3b8; margin-top:4px;">${window.t('Type:')} ${r.resource_type} | ${window.t('Contact:')} ${r.contact_phone}</p>
    </div>
  `).join('');
}

function renderHospitalList(hospitals) {
  const container = document.getElementById('hospital-list-container');
  if (!container) return;
  container.innerHTML = hospitals.map(h => `
    <div style="padding:12px; background:rgba(15,23,42,0.8); border:1px solid #1e293b; border-radius:12px; margin-bottom:10px;">
      <strong style="color:#fff; font-size:12px;">${h.name}</strong>
      <p style="font-size:11px; color:#c084fc; margin-top:4px;">${window.t('General Beds:')} ${h.available_beds}/${h.total_beds} | ${window.t('ICU:')} ${h.icu_available}/${h.icu_total}</p>
    </div>
  `).join('');
}

function renderShelterList(shelters) {
  const container = document.getElementById('shelter-list-container');
  if (!container) return;
  container.innerHTML = shelters.map(s => `
    <div style="padding:12px; background:rgba(15,23,42,0.8); border:1px solid #1e293b; border-radius:12px; margin-bottom:10px;">
      <strong style="color:#fff; font-size:12px;">${s.name}</strong>
      <p style="font-size:11px; color:#22d3ee; margin-top:4px;">${window.t('Available Capacity:')} ${s.max_capacity - s.current_occupancy} ${window.t('beds')}</p>
    </div>
  `).join('');
}

function renderSensorGrid(sensors) {
  const container = document.getElementById('sensor-grid-container');
  const selectEl = document.getElementById('telemetry-sensor-select');
  
  if (selectEl && sensors && sensors.length > 0) {
    const currentVal = selectEl.value;
    selectEl.innerHTML = sensors.map(s => 
      `<option value="${s.sensor_code}">${s.sensor_code} - ${s.sensor_type} (${s.location_name})</option>`
    ).join('');
    if (currentVal) selectEl.value = currentVal;
  }

  if (!container) return;
  container.innerHTML = sensors.map(s => `
    <div style="padding:14px; background:rgba(15,23,42,0.85); border:1px solid #1e293b; border-radius:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color:#fff; font-size:12px;">${s.sensor_type} (${s.sensor_code})</strong>
        <span style="font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; ${s.status === 'CRITICAL' ? 'background:rgba(239,68,68,0.2); color:#f87171; border:1px solid rgba(239,68,68,0.4);' : (s.status === 'WARNING' ? 'background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4);' : 'background:rgba(52,211,153,0.2); color:#34d399; border:1px solid rgba(52,211,153,0.4);')}">${window.t(s.status)}</span>
      </div>
      <p style="font-size:11px; color:#94a3b8; margin-bottom:8px;">📍 ${s.location_name}</p>
      <div style="font-family:monospace; font-size:12px; display:flex; justify-content:space-between; background:#0f172a; padding:8px 10px; border-radius:8px; border:1px solid #1e293b;">
        <span style="color:#94a3b8;">${window.t('Reading:')} <strong style="color:${s.status === 'CRITICAL' ? '#f87171' : '#22d3ee'};">${s.current_value} ${s.unit}</strong></span>
        <span style="color:#64748b;">${window.t('Crit Threshold:')} ${s.critical_threshold} ${s.unit}</span>
      </div>
    </div>
  `).join('');
}

async function handleIngestTelemetrySubmit(e) {
  e.preventDefault();
  const selectEl = document.getElementById('telemetry-sensor-select');
  const inputEl = document.getElementById('telemetry-value-input');
  
  if (!selectEl || !selectEl.value) {
    showToast('⚠️ Select Sensor', 'Please choose an active IoT sensor from the dropdown list.');
    return;
  }
  
  const code = selectEl.value;
  const val = parseFloat(inputEl ? inputEl.value : '4.2');
  
  try {
    const res = await CrisisAPI.ingestSensorReading(code, val);
    showToast(`📡 Telemetry Ingested [${code}]`, `New value: ${val} (${res.status}). ${res.message || ''}`);
    loadDashboardData();
  } catch (err) {
    showToast('❌ Ingestion Failed', 'Could not send sensor reading.');
  }
}

async function handlePopupSensorIngest(e, sensorCode) {
  e.preventDefault();
  const inputEl = document.getElementById(`popup-input-${sensorCode}`);
  if (!inputEl) return;
  const val = parseFloat(inputEl.value);
  try {
    const res = await CrisisAPI.ingestSensorReading(sensorCode, val);
    showToast(`📡 Map Telemetry Ingested`, `Sensor ${sensorCode} updated to ${val} (${res.status})`);
    loadDashboardData();
  } catch (err) {
    showToast('❌ Ingestion Failed', 'Could not update sensor from map popup.');
  }
}

let isAutoLiveStreamRunning = false;
let autoLiveStreamTimer = null;

function toggleAutoLiveStream() {
  isAutoLiveStreamRunning = !isAutoLiveStreamRunning;
  const btnTab = document.getElementById('btn-auto-stream-tab');
  const btnHdr = document.getElementById('btn-auto-stream-hdr');
  
  if (isAutoLiveStreamRunning) {
    if (btnTab) {
      btnTab.innerText = '⏸ STOP LIVE STREAM';
      btnTab.style.background = '#ef4444';
    }
    if (btnHdr) {
      btnHdr.innerText = '⏸ STOP IOT STREAM';
      btnHdr.style.background = '#ef4444';
    }
    showToast('📡 LIVE STREAM ACTIVE', 'Continuous simulated IoT sensor telemetry stream running (3s intervals).');
    runAutoLiveStreamTick();
    autoLiveStreamTimer = setInterval(runAutoLiveStreamTick, 3000);
  } else {
    if (btnTab) {
      btnTab.innerText = '⚡ START AUTO-LIVE STREAM';
      btnTab.style.background = '#059669';
    }
    if (btnHdr) {
      btnHdr.innerText = '⚡ START IOT STREAM';
      btnHdr.style.background = '#059669';
    }
    if (autoLiveStreamTimer) clearInterval(autoLiveStreamTimer);
    showToast('⏸ STREAM PAUSED', 'IoT telemetry simulation stream paused.');
  }
}

async function runAutoLiveStreamTick() {
  if (!globalSensors || globalSensors.length === 0) return;
  const sensor = globalSensors[Math.floor(Math.random() * globalSensors.length)];
  let delta = (Math.random() - 0.45) * 1.2;
  let newVal = Math.max(0.1, parseFloat((sensor.current_value + delta).toFixed(1)));
  
  // Breaching threshold occasionally to trigger rule engine alerts
  if (Math.random() > 0.65) {
    newVal = parseFloat((sensor.critical_threshold + Math.random() * 1.5).toFixed(1));
  }
  
  try {
    const res = await CrisisAPI.ingestSensorReading(sensor.sensor_code, newVal);
    showToast(`📡 Live Telemetry [${sensor.sensor_code}]`, `${sensor.sensor_type} updated to ${newVal} ${sensor.unit} (${res.status})`);
    loadDashboardData();
  } catch (err) {
    console.error("Auto stream tick error:", err);
  }
}

/* Quick Action Dispatcher */
function triggerQuickAction(actionKey) {
  switch (actionKey) {
    case 'REPORT_INCIDENT':
      openCreateIncidentModal();
      break;
    case 'SEND_ALERT':
      switchTab('alerts');
      showToast('📢 EMERGENCY ALERT DISPATCH', 'Switched to Emergency Alert Broadcast panel.');
      break;
    case 'DISPATCH_AMBULANCE':
      if (globalIncidents.length > 0) {
        openResourceAllocator(globalIncidents[0].id);
      } else {
        switchTab('resources');
      }
      showToast('🚑 AMBULANCE DISPATCH', 'Resource Fleet Dispatcher active.');
      break;
    case 'DISPATCH_RESCUE':
      switchTab('rescue-dashboard');
      showToast('👨‍🚒 RESCUE TEAM DISPATCH', 'Switched to Rescue Team Board.');
      break;
    case 'CONTACT_HOSPITAL':
      switchTab('hospitals');
      showToast('🏥 HOSPITAL DIRECTORY', 'Switched to Hospital Emergency Bed Capacity.');
      break;
    case 'ACTIVATE_SHELTER':
      switchTab('shelters');
      showToast('🏠 RELIEF SHELTERS', 'Switched to Relief Shelter Capacity Directory.');
      break;
    case 'FIND_ROUTE':
      switchTab('routes');
      showToast('🛣 SAFE ROUTE SOLVER', 'Switched to Emergency Route Navigation Pathfinder.');
      break;
    case 'START_EVACUATION':
      switchTab('evacuation');
      showToast('🚨 MASS EVACUATION PLANNER', 'Switched to Civilian Evacuation Corridor Planner.');
      break;
  }
}

function handleSendAlert(e) {
  if (e) e.preventDefault();
  const sev = document.getElementById('alert-severity')?.value || 'CRITICAL';
  const region = document.getElementById('alert-region')?.value || 'Pan-India';
  const msg = document.getElementById('alert-message')?.value || 'Emergency Alert';
  showToast(`📢 ${sev} BROADCAST SENT`, `Alert broadcasted to ${region}: ${msg}`);
}

function handleRunSimulation(e) {
  if (e) e.preventDefault();
  const type = document.getElementById('sim-type')?.value || 'Flood';
  const rain = parseFloat(document.getElementById('sim-rainfall')?.value || '150');
  const water = parseFloat(document.getElementById('sim-water')?.value || '4.2');
  const pop = parseInt(document.getElementById('sim-pop')?.value || '1500');

  const affected = Math.round(pop * (water / 5.0) * 1.8);
  const blocked = Math.round(rain / 25.0);
  const rescue = Math.ceil(affected / 250);

  const resEl = document.getElementById('sim-result-container');
  if (resEl) resEl.style.display = 'block';
  const affEl = document.getElementById('sim-affected-pop');
  if (affEl) affEl.innerText = affected.toLocaleString();
  const blkEl = document.getElementById('sim-blocked-roads');
  if (blkEl) blkEl.innerText = `${blocked} road segments`;
  const reqEl = document.getElementById('sim-req-rescue');
  if (reqEl) reqEl.innerText = `${rescue} squads`;

  showToast('⚙️ SIMULATION COMPLETE', `Physics calculation completed for ${type}.`);
}

/* Tab Navigation */
function switchTab(tabId) {
  currentActiveTab = tabId;
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

  const activeLink = document.getElementById(`nav-${tabId}`);
  if (activeLink) activeLink.classList.add('active');

  const activeContent = document.getElementById(`tab-content-${tabId}`);
  if (activeContent) {
    activeContent.style.display = 'block';
    if (tabId === 'command-center' && mainMap) {
      setTimeout(() => { mainMap.invalidateSize(); }, 150);
    }
    setTimeout(() => {
      activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  } else {
    const cmd = document.getElementById('tab-content-command-center');
    if (cmd) {
      cmd.style.display = 'block';
      if (mainMap) setTimeout(() => { mainMap.invalidateSize(); }, 150);
    }
  }
}

/* Role Switcher */
function setRole(roleName) {
  currentRole = roleName;
  document.getElementById('active-role-display').innerText = roleName;
}

/* Multilingual Switcher (Full Page Translation) */
function setLanguage(lang) {
  currentLang = lang;
  const dict = i18n[lang] || i18n['en'];

  // Highlight active language picker button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.style.color = '#94a3b8';
    btn.style.background = 'transparent';
  });
  const activeBtn = document.getElementById(`btn-lang-${lang}`);
  if (activeBtn) {
    activeBtn.style.color = '#fff';
    activeBtn.style.background = '#06b6d4';
    activeBtn.style.borderRadius = '6px';
  }

  // Translate all data-i18n elements on the webpage
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  // Update Title
  const titleEl = document.getElementById('title-text');
  if (titleEl && dict.title) {
    titleEl.innerText = dict.title;
  }
  const taglineEl = document.getElementById('tagline-text');
  if (taglineEl && dict.tagline) {
    taglineEl.innerText = dict.tagline;
  }

  // Update Active Stream Buttons text if active
  const btnTab = document.getElementById('btn-auto-stream-tab');
  const btnHdr = document.getElementById('btn-auto-stream-hdr');
  if (isAutoLiveStreamRunning) {
    if (btnTab) btnTab.innerText = dict.btn_stop_stream || '⏸ STOP LIVE STREAM';
    if (btnHdr) btnHdr.innerText = dict.btn_stop_stream || '⏸ STOP IOT STREAM';
  } else {
    if (btnTab) btnTab.innerText = dict.btn_start_stream || '⚡ START AUTO-LIVE STREAM';
    if (btnHdr) btnHdr.innerText = dict.btn_start_stream || '⚡ START IOT STREAM';
  }

  showToast('🌐 Language Updated', `Command Center switched to ${lang.toUpperCase() === 'TE' ? 'తెలుగు' : (lang.toUpperCase() === 'HI' ? 'हिन्दी' : 'English')}`);

  // Re-render dynamic lists & map popups with new language translations
  if (globalIncidents && globalIncidents.length > 0) {
    renderIncidentList(globalIncidents);
    renderMapIncidents(globalIncidents);
  }
  if (globalResources && globalResources.length > 0) renderResourceList(globalResources);
  if (globalHospitals && globalHospitals.length > 0) renderHospitalList(globalHospitals);
  if (globalShelters && globalShelters.length > 0) renderShelterList(globalShelters);
  if (globalSensors && globalSensors.length > 0) renderSensorGrid(globalSensors);
}

/* Modal Openers */
function openCreateIncidentModal() {
  document.getElementById('create-incident-modal').style.display = 'flex';
}
function closeCreateIncidentModal() {
  document.getElementById('create-incident-modal').style.display = 'none';
}

function openResourceAllocator(incidentId) {
  const inc = globalIncidents.find(i => i.id === incidentId);
  if (!inc) return;
  document.getElementById('allocator-inc-title').innerText = inc.title;
  document.getElementById('allocator-modal').style.display = 'flex';
  
  CrisisAPI.getRecommendedResources(inc.lat, inc.lng).then(recs => {
    const list = document.getElementById('allocator-recs-list');
    list.innerHTML = recs.map((r, idx) => `
      <div style="padding:10px; background:#0f172a; border:1px solid #1e293b; border-radius:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:#fff; font-size:12px;">${r.name} (${r.code})</strong>
          <p style="font-size:11px; color:#22d3ee; margin-top:2px;">${r.distance_km} km away | ETA: ${r.eta_minutes} mins</p>
        </div>
        <button onclick="confirmDispatch(${inc.id}, ${r.resource_id})" style="background:#06b6d4; color:#0b0f19; font-weight:bold; font-size:11px; padding:6px 12px; border-radius:8px; border:none; cursor:pointer;">
          DISPATCH
        </button>
      </div>
    `).join('');
  });
}

function confirmDispatch(incidentId, resourceId) {
  CrisisAPI.assignResource(incidentId, resourceId).then(() => {
    closeAllocatorModal();
    loadDashboardData();
    showToast('🚑 Resource Dispatched', 'Response unit assigned to emergency site.');
  });
}

function closeAllocatorModal() {
  document.getElementById('allocator-modal').style.display = 'none';
}

function openIncidentDetail(id) {
  const inc = globalIncidents.find(i => i.id === id);
  if (!inc) return;
  document.getElementById('detail-inc-title').innerText = inc.title;
  document.getElementById('detail-inc-desc').innerText = inc.description || '';
  document.getElementById('detail-inc-reason').innerText = inc.priority_reason || 'Priority calculated via Rule Engine';
  document.getElementById('detail-modal').style.display = 'flex';
}

function closeDetailModal() {
  document.getElementById('detail-modal').style.display = 'none';
}

/* Satellite & Drone Inspection Modals */
function openDroneView(title, type, lat, lng) {
  document.getElementById('drone-modal-title').innerText = `DRONE AERIAL RECON: ${title}`;
  document.getElementById('drone-telemetry-text').innerText = `LAT: ${lat.toFixed(4)} | LNG: ${lng.toFixed(4)} | ALT: 120m | HAZARD: ${type.toUpperCase()}`;
  document.getElementById('drone-modal').style.display = 'flex';
}
function closeDroneModal() {
  document.getElementById('drone-modal').style.display = 'none';
}

function openSatelliteView(title, type, lat, lng) {
  document.getElementById('satellite-modal-title').innerText = `SATELLITE THERMAL OVERLAY: ${title}`;
  document.getElementById('satellite-modal').style.display = 'flex';
}
function closeSatelliteModal() {
  document.getElementById('satellite-modal').style.display = 'none';
}

/* Form Handlers */
async function handleCreateIncidentSubmit(e) {
  if (e) e.preventDefault();
  const titleEl = document.getElementById('inc-form-title');
  const descEl = document.getElementById('inc-form-desc');
  const typeEl = document.getElementById('inc-form-type');
  const popEl = document.getElementById('inc-form-pop');

  const title = titleEl ? titleEl.value : 'New Emergency Incident';
  const desc = descEl ? descEl.value : '';
  const type = typeEl ? typeEl.value : 'Flood';
  const pop = parseInt(popEl ? popEl.value : '500');

  if (!title) {
    showToast('⚠️ Missing Information', 'Please enter an incident title.');
    return;
  }

  // Generate coordinates across active matrix
  const lat = 15.0 + Math.random() * 12.0;
  const lng = 72.0 + Math.random() * 15.0;

  const data = {
    title: title,
    description: desc,
    incident_type: type,
    population_affected: pop,
    lat: parseFloat(lat.toFixed(4)),
    lng: parseFloat(lng.toFixed(4)),
    address: "Active Emergency Zone"
  };

  try {
    const newInc = await CrisisAPI.createIncident(data);
    closeCreateIncidentModal();

    // Reset form fields
    if (titleEl) titleEl.value = '';
    if (descEl) descEl.value = '';

    await loadDashboardData();
    switchTab('command-center');
    showToast('🚨 Incident Registered & Priority Score Calculated!', `Registered "${title}" with Priority Score ${newInc.priority_score || 85} (${newInc.severity || 'HIGH'})`);
  } catch (err) {
    showToast('❌ Registration Failed', 'Could not register new incident.');
  }
}

async function handleCalculateRoute(e) {
  if (e) e.preventDefault();
  try {
    const res = await CrisisAPI.calculateRoute(17.3850, 78.4867, 17.4100, 78.5100);
    if (res.routes && res.routes.length > 0) {
      // Switch tab to command center main map
      switchTab('command-center');

      // Scroll to main map
      const mapEl = document.getElementById('crisis-map');
      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Draw polyline route on main map
      drawRoutePolyline(res.routes[0].coordinates);

      showToast('🛣 Safe Bypass Route Drawn on Main Map', `Calculated ${res.routes[0].name || 'Bypass Route'} (${res.routes[0].distance_km || 4.2} km, avoiding flooded segments)`);
    } else {
      showToast('🛣 Route Computed', 'Bypass route generated on main map.');
    }
  } catch (err) {
    showToast('❌ Pathfinder Error', 'Could not compute safe route.');
  }
}

async function handleStartEvacuation(e) {
  if (e) e.preventDefault();
  try {
    const plan = await CrisisAPI.createEvacuationPlan(1, 3500);

    // Switch tab to command center main map
    switchTab('command-center');

    // Scroll to main map
    const mapEl = document.getElementById('crisis-map');
    if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Highlight evacuation route on main map
    const evacCoords = [
      [17.3850, 78.4867],
      [17.3950, 78.4950],
      [17.4100, 78.5100]
    ];
    drawRoutePolyline(evacCoords);

    showToast('🚨 MASS EVACUATION FLEET DISPATCHED!', `Plan Code ${plan.plan_code || 'EVC-8842'} active! Transport buses dispatched to evacuate ${plan.target_population || 3500} civilians to safe relief shelters.`);
  } catch (err) {
    showToast('🚨 EVACUATION STARTED', 'Mass evacuation corridor protocol dispatched to emergency response teams.');
  }
}

async function handleRunSimulationSubmit(e) {
  if (e) e.preventDefault();
  const res = await CrisisAPI.runSimulation(
    document.getElementById('sim-type').value,
    parseFloat(document.getElementById('sim-rainfall').value),
    parseFloat(document.getElementById('sim-water').value),
    parseInt(document.getElementById('sim-pop').value)
  );
  document.getElementById('sim-result-container').style.display = 'block';
  document.getElementById('sim-affected-pop').innerText = res.affected_population;
  document.getElementById('sim-blocked-roads').innerText = res.blocked_roads_count;
  document.getElementById('sim-req-rescue').innerText = res.required_rescue_teams;
}

function showToast(title, msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:1000; background:#131b2e; border:1px solid #06b6d4; padding:12px 16px; border-radius:12px; color:#fff; font-size:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5);';
  toast.innerHTML = `<strong style="color:#06b6d4;">${title}</strong><p style="margin-top:2px;">${msg}</p>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function initWebSocket() {
  new CrisisWebSocket((msg) => {
    if (msg.type === 'INCIDENT_CREATED') {
      showToast('🚨 New Incident', msg.data.title);
      loadDashboardData();
    } else if (msg.type === 'EMERGENCY_ALERT_BROADCAST') {
      showToast('📢 EMERGENCY ALERT', msg.data.title);
    } else if (msg.type === 'SENSOR_READING_UPDATED') {
      showToast(`📡 Live Sensor Telemetry`, `Sensor ${msg.data.sensor_code} status: ${msg.data.status} (${msg.data.value})`);
      loadDashboardData();
    }
  });
}

function setupEventListeners() {
  const form = document.getElementById('form-create-incident');
  if (form) form.addEventListener('submit', handleCreateIncidentSubmit);

  const simForm = document.getElementById('form-simulation');
  if (simForm) simForm.addEventListener('submit', handleRunSimulationSubmit);
}
