import React from 'react';
import type { Incident } from '../../types/maritime';
import { 
  X, 
  ShieldAlert, 
  Layers, 
  Target, 
  Compass, 
  Wind, 
  CheckCircle, 
  FileDown, 
  SearchCheck,
  AlertTriangle 
} from 'lucide-react';


interface IncidentModalProps {
  incident: Incident | null;
  onClose: () => void;
  onAnalyzeSource: (incident: Incident) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  incident,
  onClose,
  onAnalyzeSource,
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#070e1b] border border-cyan-800/80 rounded w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col font-mono max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#091426] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-red-950 border border-red-800 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{incident.id}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">
                  RISK: {incident.risk}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold">
                  {incident.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{incident.title} &bull; {incident.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Section: SAR Satellite & Primary Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#091220] border border-slate-800 p-3 rounded">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 mb-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Estimated Spill Area
              </span>
              <div className="text-xl font-bold text-cyan-400">{incident.spillAreaKm2} km²</div>
              <span className="text-[10px] text-slate-400">Volume: {incident.estimatedVolume}</span>
            </div>

            <div className="bg-[#091220] border border-slate-800 p-3 rounded">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Detection Confidence
              </span>
              <div className="text-xl font-bold text-emerald-400">{incident.confidence}%</div>
              <span className="text-[10px] text-slate-400">{incident.sensorSource}</span>
            </div>

            <div className="bg-[#091220] border border-slate-800 p-3 rounded">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                Source Correlation
              </span>
              <div className="text-xl font-bold text-amber-400">{incident.sourceConfidence}%</div>
              <span className="text-[10px] text-slate-400 font-bold truncate block">{incident.probableSource}</span>
            </div>
          </div>

          {/* Section: Hydro-Meteorological Drift Vectors */}
          <div className="bg-[#091220] border border-slate-800 p-4 rounded">
            <h4 className="text-xs uppercase font-bold text-slate-200 mb-2.5 flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              Hydro-Meteorological Drift Vectors & Environmental Context
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 text-[10px] block">Coordinates</span>
                <span className="font-semibold text-slate-200">{incident.coordinates[0]}°N, {incident.coordinates[1]}°E</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Surface Wind Speed</span>
                <span className="font-semibold text-slate-200">{incident.windSpeedKnots || 14} knots</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Ocean Current Vector</span>
                <span className="font-semibold text-slate-200">{incident.currentDirection || 'SSW at 1.2 knots'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Maritime Sector</span>
                <span className="font-semibold text-cyan-400">Sector Bravo (Offshore)</span>
              </div>
            </div>
          </div>

          {/* Section: Forensic Attribution Summary */}
          <div className="bg-[#091220] border border-amber-900/40 p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Forensic Vessel Attribution (Backtrack Model)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">
                HIGH PROBABILITY
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Automated trajectory backward drift integration identified <strong>{incident.probableSource}</strong> as the high-probability culprit. AIS data logs confirm vessel speed throttled from 16.2 kn to 11.4 kn during passage directly across the spill coordinate at 20:58 IST.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]">AIS Track Intersect: Confirmed</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]">Spill Age: ~45 mins</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]">Satellite Revisit: 09 Sep 04:30 IST</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-[#091426] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => alert(`Dossier for ${incident.id} generated and ready for export to Indian Coast Guard HQ.`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            <span>Export Dossier (PDF)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAnalyzeSource(incident);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/70 text-xs font-bold transition-colors shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            >
              <SearchCheck className="w-4 h-4 text-cyan-400" />
              <span>Analyze Source</span>
            </button>
            <button
              onClick={() => alert(`Task order dispatched to ICGS Samarth for containment of ${incident.id}.`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/80 text-xs font-bold transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-red-400" />
              <span>Dispatch Containment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;
