import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Target, 
  Waves, 
  SearchCheck, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import type { DetectionResponse } from '../../services/api';


interface DetectionMetricsPanelProps {
  onViewOnMap: () => void;
  onAnalyzeSource: () => void;
  onGenerateReport: () => void;
  detection?: DetectionResponse | null;
}

export const DetectionMetricsPanel: React.FC<DetectionMetricsPanelProps> = ({
  onViewOnMap,
  onAnalyzeSource,
  onGenerateReport,
  detection,
}) => {
  const spillArea = detection?.spillAreaKm2 ?? 12.6;
  const confidence = detection?.confidence ?? 94;
  const risk = detection?.risk ?? 'HIGH';
  const centroid = detection?.centroid ?? { latitude: 18.925, longitude: 71.650 };
  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* 1. Primary Detection Status Header Card */}
      <div className="bg-[#091220] border border-red-800/80 rounded p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded bg-red-950 border border-red-700 text-red-400 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Detection Result
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-red-400 tracking-tight flex items-center gap-2">
              <span>{detection?.classification === 'OIL SPILL' || !detection ? 'OIL SPILL DETECTED' : detection.classification}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950 border border-red-700 text-red-300 font-bold">
                RISK: {risk}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Incident ID: <strong className="text-slate-200">MARIS-2026-001</strong> &bull; Origin: <strong className="text-slate-200">Arabian Sea</strong> &bull; Centroid: <strong className="text-slate-200">{centroid.latitude.toFixed(3)}°N, {centroid.longitude.toFixed(3)}°E</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={onViewOnMap}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIEW ON MAP</span>
          </button>

          <button
            type="button"
            onClick={onAnalyzeSource}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-700/60 transition-colors shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <SearchCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>ANALYZE SOURCE</span>
          </button>

          <button
            type="button"
            onClick={onGenerateReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-semibold border border-amber-700/60 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>GENERATE INCIDENT REPORT</span>
          </button>
        </div>
      </div>

      {/* 2. Five Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Spill Area */}
        <div className="bg-[#091220] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Spill Area</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{spillArea} km²</div>
          <span className="text-[10px] text-slate-500 mt-1">Calculated surface slick</span>
        </div>

        {/* Metric 2: Confidence */}
        <div className="bg-[#091220] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Confidence</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{confidence}%</div>
          <span className="text-[10px] text-slate-500 mt-1">SAR backscatter damping</span>
        </div>

        {/* Metric 3: Risk */}
        <div className="bg-[#091220] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Risk</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-red-400 mt-1">{risk}</div>
          <span className="text-[10px] text-red-400/80 mt-1">Rig proximity: 6.2 NM</span>
        </div>

        {/* Metric 4: Water Coverage */}
        <div className="bg-[#091220] border border-slate-800 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Water Coverage</span>
            <Waves className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">87.4%</div>
          <span className="text-[10px] text-slate-500 mt-1">Open sea mask index</span>
        </div>

        {/* Metric 5: Candidate Region */}
        <div className="bg-[#091220] border border-slate-800 rounded p-3 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Candidate Region</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">1</div>
          <span className="text-[10px] text-slate-500 mt-1">Isolated contiguous blob</span>
        </div>
      </div>
    </div>
  );
};

export default DetectionMetricsPanel;
