import React from 'react';
import type { Incident } from '../../types/maritime';
import { 
  MapPin, 
  Clock, 
  Layers, 
  ShieldAlert, 
  Target, 
  Compass, 
  ExternalLink, 
  SearchCheck,
} from 'lucide-react';


interface ActiveIncidentPanelProps {
  incident: Incident;
  onViewIncident: (incident: Incident) => void;
  onAnalyzeSource: (incident: Incident) => void;
}

export const ActiveIncidentPanel: React.FC<ActiveIncidentPanelProps> = ({
  incident,
  onViewIncident,
  onAnalyzeSource,
}) => {
  return (
    <div className="bg-[#091220] border border-slate-800 rounded p-4 flex flex-col justify-between shadow-sm">
      <div>
        {/* Header with ID and Status */}
        <div className="flex items-center justify-between border-b border-slate-800/90 pb-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-950/70 border border-red-800/50 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Active Priority Incident
              </div>
              <div className="text-sm font-mono font-bold text-red-400 flex items-center gap-1.5">
                {incident.id}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 border border-red-800/60 text-red-300">
              RISK: {incident.risk}
            </span>
            <span className="text-[10px] font-mono text-amber-400/90 mt-1 font-semibold">
              {incident.status}
            </span>
          </div>
        </div>

        {/* Incident Title */}
        <h3 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
          {incident.title}
        </h3>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono mb-4">
          <div className="bg-[#070e1b] border border-slate-800/80 p-2.5 rounded">
            <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Location
            </div>
            <div className="text-slate-200 font-medium truncate" title={incident.location}>
              {incident.location}
            </div>
          </div>

          <div className="bg-[#070e1b] border border-slate-800/80 p-2.5 rounded">
            <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Detection
            </div>
            <div className="text-slate-200 font-medium">
              {incident.detectedAt}
            </div>
          </div>

          <div className="bg-[#070e1b] border border-slate-800/80 p-2.5 rounded">
            <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              Estimated Area
            </div>
            <div className="text-cyan-400 font-bold text-sm">
              {incident.spillAreaKm2} km²
            </div>
          </div>

          <div className="bg-[#070e1b] border border-slate-800/80 p-2.5 rounded">
            <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1 mb-1">
              <Target className="w-3 h-3 text-cyan-400" />
              Detection Conf.
            </div>
            <div className="text-emerald-400 font-bold text-sm">
              {incident.confidence}%
            </div>
          </div>
        </div>

        {/* Probable Source Spotlight */}
        <div className="bg-[#070e1b] border border-amber-900/40 rounded p-3 mb-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Probable Source Vessel
            </span>
            <span className="text-amber-300 font-bold">
              {incident.sourceConfidence}% Match
            </span>
          </div>
          <div className="text-sm font-mono font-bold text-slate-100">
            {incident.probableSource}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            AIS trajectory intersects backward drift dispersion arc.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800">
        <button
          onClick={() => onViewIncident(incident)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors border border-slate-700"
        >
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          <span>View Incident</span>
        </button>

        <button
          onClick={() => onAnalyzeSource(incident)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-mono font-semibold transition-colors border border-cyan-700/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <SearchCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Analyze Source</span>
        </button>
      </div>
    </div>
  );
};

export default ActiveIncidentPanel;
