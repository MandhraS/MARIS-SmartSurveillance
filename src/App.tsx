import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandCenterView } from './views/CommandCenterView';
import { SpillDetectionView } from './views/SpillDetectionView';
import { SourceAnalysisView } from './views/SourceAnalysisView';
import { PlaceholderView } from './views/PlaceholderView';
import { VesselTrackingView } from './views/VesselTrackingView';
import { AlertsView } from './views/AlertsView';
import { AnalyticsView } from './views/AnalyticsView';
import { IncidentReportView } from './views/IncidentReportView';
import { SurveillanceMap } from './components/dashboard/SurveillanceMap';
import { IncidentModal } from './components/modals/IncidentModal';
import { VesselModal } from './components/modals/VesselModal';
import { mockIncidents, mockVessels } from './data/mockMaritimeData';
import { fetchIncident } from './services/api';
import type { NavigationTab, Incident, Vessel, MaritimeAlert } from './types/maritime';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('command-center');
  const [activeIncident, setActiveIncident] = useState<Incident>(mockIncidents[0]);
  const [modalIncident, setModalIncident] = useState<Incident | null>(null);
  const [modalVessel, setModalVessel] = useState<Vessel | null>(null);

  useEffect(() => {
    let isMounted = true;
    void fetchIncident('MARIS-2026-001').then((incident) => {
      if (isMounted && incident) setActiveIncident(incident);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleSelectIncident = (incident: Incident) => {
    setActiveIncident(incident);
  };

  const handleSelectVessel = (vessel: Vessel) => {
    setModalVessel(vessel);
  };

  const handleSelectAlert = (alert: MaritimeAlert) => {
    if (alert.incidentId) {
      const target = mockIncidents.find((inc) => inc.id === alert.incidentId);
      if (target) {
        setActiveIncident(target);
        setModalIncident(target);
      }
    } else if (alert.vesselName) {
      const targetVessel = mockVessels.find((v) => v.name === alert.vesselName);
      if (targetVessel) {
        setModalVessel(targetVessel);
      }
    }
  };

  const handleViewIncidentModal = (incident: Incident) => {
    setModalIncident(incident);
  };

  const handleAnalyzeSource = (incident: Incident) => {
    setActiveIncident(incident);
    setActiveTab('source-analysis');
  };

  return (
    <div className="flex min-h-screen bg-[#060b14] text-slate-100 overflow-x-hidden font-mono antialiased">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onSelectAlert={handleSelectAlert} />

        {/* Dynamic Page Views */}
        <main className="flex-1 pb-10">
          {activeTab === 'command-center' && (
            <CommandCenterView
              activeIncident={activeIncident}
              onSelectIncident={handleSelectIncident}
              onSelectVessel={handleSelectVessel}
              onSelectAlert={handleSelectAlert}
              onViewIncidentModal={handleViewIncidentModal}
              onAnalyzeSource={handleAnalyzeSource}
            />
          )}

          {activeTab === 'spill-detection' && (
            <SpillDetectionView
              onViewOnMap={() => {
                const target = mockIncidents.find((inc) => inc.id === 'MARIS-2026-001') || mockIncidents[0];
                setActiveIncident(target);
                setActiveTab('command-center');
              }}
              onAnalyzeSource={() => {
                const target = mockIncidents.find((inc) => inc.id === 'MARIS-2026-001') || mockIncidents[0];
                setActiveIncident(target);
                setActiveTab('source-analysis');
              }}
              onGenerateReport={() => {
                const target = mockIncidents.find((inc) => inc.id === 'MARIS-2026-001') || mockIncidents[0];
                setActiveIncident(target);
                setActiveTab('incident-reports');
              }}
            />
          )}

          {activeTab === 'source-analysis' && (
            <SourceAnalysisView
              incident={activeIncident}
              onBackToDashboard={() => setActiveTab('command-center')}
            />
          )}

          {activeTab === 'maritime-map' && (
            <div className="p-3.5 sm:p-5 max-w-[1600px] mx-auto font-mono text-slate-100">
              <div className="mb-4 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">Maritime Surveillance Map</h2>
                <p className="text-xs text-slate-400 mt-1">OpenStreetMap base layer with MARIS prototype overlays and simulated AIS markers.</p>
              </div>
              <SurveillanceMap
                highlightedIncidentId={activeIncident.id}
                onSelectIncident={handleSelectIncident}
                onSelectVessel={handleSelectVessel}
              />
            </div>
          )}

          {activeTab === 'vessel-tracking' && (
            <VesselTrackingView onSelectVessel={handleSelectVessel} />
          )}

          {activeTab === 'alerts' && (
            <AlertsView onSelectAlert={handleSelectAlert} />
          )}

          {activeTab === 'incident-reports' && (
            <IncidentReportView
              incident={activeIncident}
              onBack={() => setActiveTab('command-center')}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab !== 'command-center' &&
            activeTab !== 'spill-detection' &&
            activeTab !== 'source-analysis' &&
            activeTab !== 'maritime-map' &&
            activeTab !== 'vessel-tracking' &&
            activeTab !== 'alerts' &&
            activeTab !== 'incident-reports' &&
            activeTab !== 'analytics' && (
              <PlaceholderView
                tab={activeTab}
                onBackToCommandCenter={() => setActiveTab('command-center')}
              />
            )}
        </main>
      </div>


      {/* 3. Modals */}
      <IncidentModal
        incident={modalIncident}
        onClose={() => setModalIncident(null)}
        onAnalyzeSource={(inc) => {
          setModalIncident(null);
          handleAnalyzeSource(inc);
        }}
      />

      <VesselModal
        vessel={modalVessel}
        onClose={() => setModalVessel(null)}
        onAnalyzeVessel={() => {
          setModalVessel(null);
          setActiveTab('source-analysis');
        }}
      />
    </div>
  );
};

export default App;
