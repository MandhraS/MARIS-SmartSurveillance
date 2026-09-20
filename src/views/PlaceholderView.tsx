import React from 'react';
import type { NavigationTab } from '../types/maritime';

import { 
  Radar, 
  Droplets, 
  Map, 
  Ship, 
  BellRing, 
  FileText, 
  BarChart3, 
  Activity, 
  Settings, 
  ArrowLeft 
} from 'lucide-react';

interface PlaceholderViewProps {
  tab: NavigationTab;
  onBackToCommandCenter: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  tab,
  onBackToCommandCenter,
}) => {
  const getTabDetails = () => {
    switch (tab) {
      case 'spill-detection':
        return {
          title: 'Spill Detection System',
          icon: <Droplets className="w-8 h-8 text-cyan-400" />,
          desc: 'Automated satellite SAR anomaly classification, optical thermal slick delineation, and FLIR feeds.',
          count: '12 Active Detection Zones In Indian Waters',
        };
      case 'maritime-map':
        return {
          title: 'Full Maritime Geographic Information System',
          icon: <Map className="w-8 h-8 text-cyan-400" />,
          desc: 'High-resolution bathymetry, nautical chart overlays, EEZ demarcation lines, and maritime traffic corridors.',
          count: 'Indian Ocean Region Surveillance Arc',
        };
      case 'vessel-tracking':
        return {
          title: 'Vessel Tracking & AIS Telemetry Fleet',
          icon: <Ship className="w-8 h-8 text-cyan-400" />,
          desc: 'Real-time terrestrial and satellite AIS feed processing with dark vessel / spoofing anomaly detection.',
          count: '1,284 Vessels Under Active Monitoring',
        };
      case 'alerts':
        return {
          title: 'Surveillance Alerts & Warning Broadcasts',
          icon: <BellRing className="w-8 h-8 text-amber-400" />,
          desc: 'Centralized telemetry alerts dispatched across Indian Coast Guard and port authority nodes.',
          count: '27 Alerts Recorded Today',
        };
      case 'incident-reports':
        return {
          title: 'Maritime Incident Dossiers & Legal Evidence',
          icon: <FileText className="w-8 h-8 text-cyan-400" />,
          desc: 'Automated digital evidence logging conforming to MARPOL regulations and maritime tribunal standards.',
          count: '5 Archived Incident Dossiers',
        };
      case 'analytics':
        return {
          title: 'Maritime Environmental Analytics',
          icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
          desc: 'Seasonal spill frequency, traffic density correlations, response containment times, and environmental risk indexing.',
          count: 'Predictive Risk Models Active',
        };
      case 'system-status':
        return {
          title: 'Radar & Telemetry System Health',
          icon: <Activity className="w-8 h-8 text-emerald-400" />,
          desc: 'Satellite uplink status, Coast Guard coastal radar stations, AIS receivers, and computation clusters.',
          count: 'All 18 Nodes Operational (99.98% Uptime)',
        };
      case 'settings':
        return {
          title: 'Command Center Configuration',
          icon: <Settings className="w-8 h-8 text-slate-400" />,
          desc: 'Threshold parameters for SAR confidence cutoff, AIS loss alarms, alert routing, and operator permissions.',
          count: 'Configuration: Sector West Command Node',
        };
      default:
        return {
          title: 'Module',
          icon: <Radar className="w-8 h-8 text-cyan-400" />,
          desc: 'Operational Module',
          count: '',
        };
    }
  };

  const details = getTabDetails();

  return (
    <div className="p-6 sm:p-10 font-mono text-slate-100 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-700/50 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        {details.icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide">
        {details.title}
      </h2>
      <p className="text-sm text-cyan-300/80 mb-3 max-w-lg">
        {details.count}
      </p>
      <p className="text-xs text-slate-400 mb-6 max-w-md leading-relaxed">
        {details.desc}
      </p>
      <button
        onClick={onBackToCommandCenter}
        className="flex items-center gap-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow"
      >
        <ArrowLeft className="w-4 h-4 text-cyan-400" />
        <span>Return to Command Center Dashboard</span>
      </button>
    </div>
  );
};

export default PlaceholderView;
