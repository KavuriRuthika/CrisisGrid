import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { CitizenPortalPage } from './pages/CitizenPortalPage';
import { RescueTeamDashboardPage } from './pages/RescueTeamDashboardPage';
import { HospitalDashboardPage } from './pages/HospitalDashboardPage';
import { ShelterDashboardPage } from './pages/ShelterDashboardPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { RoutesPage } from './pages/RoutesPage';
import { SensorsPage } from './pages/SensorsPage';
import { AlertsPage } from './pages/AlertsPage';
import { EvacuationPage } from './pages/EvacuationPage';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { SimulationPage } from './pages/SimulationPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { DemoScenarioRunner } from './components/demo/DemoScenarioRunner';
import { Login } from './pages/Login';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [showDemoRunner, setShowDemoRunner] = useState<boolean>(false);

  if (!user) {
    return <Login />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'command-center':
      case 'incidents':
        return <CommandCenterPage onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'resources':
        return <ResourcesPage />;
      case 'routes':
        return <RoutesPage />;
      case 'evacuation':
        return <EvacuationPage />;
      case 'sensors':
        return <SensorsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'hospitals':
        return <HospitalDashboardPage />;
      case 'shelters':
        return <ShelterDashboardPage />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'simulation':
        return <SimulationPage />;
      case 'audit':
        return <AuditLogPage />;
      case 'citizen-portal':
        return <CitizenPortalPage />;
      case 'rescue-dashboard':
        return <RescueTeamDashboardPage />;
      default:
        return <CommandCenterPage onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar onRunDemo={() => setShowDemoRunner(true)} />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {renderTabContent()}
        </main>
      </div>

      {showDemoRunner && (
        <DemoScenarioRunner onClose={() => setShowDemoRunner(false)} />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <WebSocketProvider>
          <MainLayout />
        </WebSocketProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
