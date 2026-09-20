import React from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { SurveillanceMap } from '../components/dashboard/SurveillanceMap';
import { ActiveIncidentPanel } from '../components/dashboard/ActiveIncidentPanel';
import { IncidentsTable } from '../components/dashboard/IncidentsTable';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import type { Incident, Vessel, MaritimeAlert } from '../types/maritime';


interface CommandCenterViewProps {
  activeIncident: Incident;
  onSelectIncident: (incident: Incident) => void;
  onSelectVessel: (vessel: Vessel) => void;
  onSelectAlert: (alert: MaritimeAlert) => void;
  onViewIncidentModal: (incident: Incident) => void;
  onAnalyzeSource: (incident: Incident) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  activeIncident,
  onSelectIncident,
  onSelectVessel,
  onSelectAlert,
  onViewIncidentModal,
  onAnalyzeSource,
}) => {
  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-[1920px] mx-auto">
      {/* 1. KPI Cards Bar */}
      <KPICards />

      {/* 2. Main Surveillance Map & Active Incident Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Large Maritime Surveillance Map (8 cols on lg, 9 cols on xl) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col">
          <SurveillanceMap
            highlightedIncidentId={activeIncident.id}
            onSelectIncident={onSelectIncident}
            onSelectVessel={onSelectVessel}
          />
        </div>

        {/* Active Incident Spotlight Panel (4 cols on lg) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
          <ActiveIncidentPanel
            incident={activeIncident}
            onViewIncident={onViewIncidentModal}
            onAnalyzeSource={onAnalyzeSource}
          />
        </div>
      </div>

      {/* 3. Lower Operational Section: Recent Incidents Table & Compact Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Incidents Table (8 cols on lg) */}
        <div className="lg:col-span-8 xl:col-span-8">
          <IncidentsTable
            onSelectIncident={onSelectIncident}
            selectedIncidentId={activeIncident.id}
          />
        </div>

        {/* Compact Recent Alerts Panel (4 cols on lg) */}
        <div className="lg:col-span-4 xl:col-span-4">
          <AlertPanelWrapper onSelectAlert={onSelectAlert} />
        </div>
      </div>
    </div>
  );
};

// Re-export wrapper
const AlertPanelWrapper = AlertsPanel;

export default CommandCenterView;
