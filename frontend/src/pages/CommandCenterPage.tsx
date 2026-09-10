import React, { useState, useEffect } from 'react';
import { CrisisMap } from '../components/map/CrisisMap';
import { QuickActionsPanel } from '../components/common/QuickActionsPanel';
import { IncidentList } from '../components/incidents/IncidentList';
import { IncidentDetailModal } from '../components/incidents/IncidentDetailModal';
import { IncidentCreateModal } from '../components/incidents/IncidentCreateModal';
import { ResourceAllocatorModal } from '../components/incidents/ResourceAllocatorModal';
import { RouteSolverUI } from '../components/routes/RouteSolverUI';
import { incidentsApi, hospitalsApi, sheltersApi, resourcesApi, sensorsApi, citizenReportsApi } from '../services/api';
import { Incident, Hospital, Shelter, Resource, IoTSensor, RouteOption, CitizenReport } from '../types';

interface CommandCenterPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({ onNavigateTab }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sensors, setSensors] = useState<IoTSensor[]>([]);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>([]);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [dispatchIncident, setDispatchIncident] = useState<Incident | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);

  const fetchAllData = async () => {
    try {
      const [incRes, hospRes, shlRes, resRes, snsRes, repRes] = await Promise.all([
        incidentsApi.getAll(),
        hospitalsApi.getAll(),
        sheltersApi.getAll(),
        resourcesApi.getAll(),
        sensorsApi.getAll(),
        citizenReportsApi.getAll()
      ]);
      setIncidents(incRes.data);
      setHospitals(hospRes.data);
      setShelters(shlRes.data);
      setResources(resRes.data);
      setSensors(snsRes.data);
      setCitizenReports(repRes.data);
    } catch (e) {
      console.error("Error fetching command center data:", e);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case 'REPORT_INCIDENT':
        setShowCreateModal(true);
        break;
      case 'SEND_ALERT':
        if (onNavigateTab) onNavigateTab('alerts');
        break;
      case 'DISPATCH_AMBULANCE':
      case 'DISPATCH_RESCUE':
        if (incidents.length > 0) {
          setDispatchIncident(incidents[0]);
        } else if (onNavigateTab) {
          onNavigateTab('resources');
        }
        break;
      case 'CONTACT_HOSPITAL':
        if (onNavigateTab) onNavigateTab('hospitals');
        break;
      case 'ACTIVATE_SHELTER':
        if (onNavigateTab) onNavigateTab('shelters');
        break;
      case 'FIND_ROUTE':
        if (onNavigateTab) onNavigateTab('routes');
        break;
      case 'START_EVACUATION':
        if (onNavigateTab) onNavigateTab('evacuation');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Operations Dispatch Panel */}
      <QuickActionsPanel onActionClick={handleQuickAction} />

      {/* Main Crisis Map Display */}
      <CrisisMap
        incidents={incidents}
        hospitals={hospitals}
        shelters={shelters}
        resources={resources}
        sensors={sensors}
        citizenReports={citizenReports}
        activeRoute={activeRoute}
        onSelectIncident={(inc) => setSelectedIncident(inc)}
        onAssignResource={(incId) => {
          const inc = incidents.find(i => i.id === incId);
          if (inc) setDispatchIncident(inc);
        }}
      />

      {/* Incident List Directory & Emergency Route Solver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentList
          incidents={incidents}
          onSelectIncident={(inc) => setSelectedIncident(inc)}
          onDispatchClick={(inc) => setDispatchIncident(inc)}
          onCreateClick={() => setShowCreateModal(true)}
        />
        <RouteSolverUI onSelectRoute={(route) => setActiveRoute(route)} />
      </div>

      {/* Register New Incident Modal */}
      {showCreateModal && (
        <IncidentCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchAllData}
        />
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onRefresh={fetchAllData}
          onDispatchClick={(inc) => setDispatchIncident(inc)}
        />
      )}

      {/* Resource Allocator Modal */}
      {dispatchIncident && (
        <ResourceAllocatorModal
          incident={dispatchIncident}
          onClose={() => setDispatchIncident(null)}
          onAssigned={fetchAllData}
        />
      )}
    </div>
  );
};
