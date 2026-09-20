import React, { useEffect, useState } from 'react';
import type { Incident, Vessel } from '../types/maritime';
import { mockIncidents, mockVessels } from '../data/mockMaritimeData';
import { getAttribution, getBacktrack, type AttributionCandidate, type BacktrackResponse } from '../services/api';
import { 
  SearchCheck, 
  Ship, 
  ArrowLeft, 
  Clock, 
  FileDown,
  Navigation
} from 'lucide-react';

interface SourceAnalysisViewProps {
  incident?: Incident;
  onBackToDashboard: () => void;
}

export const SourceAnalysisView: React.FC<SourceAnalysisViewProps> = ({
  incident = mockIncidents[0],
  onBackToDashboard,
}) => {
  const suspectVessel = mockVessels.find((v: Vessel) => v.isProbableSource) || mockVessels[0];
  const [primaryCandidate, setPrimaryCandidate] = useState<AttributionCandidate | null>(null);
  const [backtrackData, setBacktrackData] = useState<BacktrackResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    void Promise.all([getAttribution(incident.id), getBacktrack(incident.id)]).then(([attribution, backtrack]) => {
      if (!isMounted) return;
      setPrimaryCandidate(attribution?.candidates[0] ?? null);
      setBacktrackData(backtrack);
    });
    return () => {
      isMounted = false;
    };
  }, [incident.id]);

  const sourceConfidence = primaryCandidate?.confidence ?? incident.sourceConfidence;
  const distanceAtSpill = primaryCandidate?.distanceAtSpillNm ?? 0.12;
  const courseDeviation = primaryCandidate?.courseDeviation ?? 'Speed drop (-4.8 kn)';
  const driftCompatibility = primaryCandidate?.driftCompatibility ?? 'HIGH';


  return (
    <div className="p-4 sm:p-6 space-y-5 font-mono text-slate-100 max-w-7xl mx-auto">
      {/* View Header with Back button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Return to Command Center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <SearchCheck className="w-5 h-5 text-cyan-400" />
                Forensic Source Attribution & Drift Backtracking
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-bold">
                INCIDENT: {incident.id}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Backward Lagrangian Particle Drift Tracking & AIS Corroboration
            </p>
          </div>
        </div>

        <button
          onClick={() => alert(`Forensic investigation package for ${incident.id} exported successfully.`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Forensic Dossier</span>
        </button>
      </div>

      {/* Primary Attribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Suspect Vessel Telemetry */}
        <div className="bg-[#091220] border border-amber-900/60 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  <Ship className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Primary Suspect</div>
                  <div className="text-sm font-bold text-slate-100">{suspectVessel.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-400">{sourceConfidence}% MATCH</div>
                <div className="text-[10px] text-slate-400">Confidence Score</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">IMO Identifier:</span>
                <span className="font-bold text-slate-200">{suspectVessel.imo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Vessel Type:</span>
                <span className="font-bold text-slate-200">{suspectVessel.type} (Crude Tanker)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Flag State:</span>
                <span className="font-bold text-slate-200">{suspectVessel.flag}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Current Speed:</span>
                <span className="font-bold text-cyan-400">{suspectVessel.speedKnots} knots</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Heading & Course:</span>
                <span className="font-bold text-slate-200">{suspectVessel.heading}° (SSW)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-200">{suspectVessel.destination}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">AIS Status:</span>
                <span className="font-bold text-emerald-400">{suspectVessel.status}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] text-amber-400/90 font-bold block mb-1">
              AUTOMATED COMPLIANCE AUDIT
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Vessel entered the Mumbai High coastal security zone without mandatory prior notification to MARIS Maritime Traffic Controller.
            </p>
          </div>
        </div>

        {/* Center & Right Column: Simulation & Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Simulation Model Card */}
          <div className="bg-[#091220] border border-slate-800 rounded p-4">
            <h3 className="text-xs uppercase font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              Lagrangian Particle Dispersion & Drift Backtrack Model
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-[#070e1b] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Surface Wind</span>
                <span className="font-bold text-cyan-400">{backtrackData?.surfaceWind ?? '14 kn (210° SW)'}</span>
              </div>
              <div className="bg-[#070e1b] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Tidal Current</span>
                <span className="font-bold text-cyan-400">{backtrackData?.tidalCurrent ?? '1.2 kn (SSW)'}</span>
              </div>
              <div className="bg-[#070e1b] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Calculated Spill Time</span>
                <span className="font-bold text-amber-400">{backtrackData?.estimatedSpillTime ?? '20:55 - 21:05 IST'}</span>
              </div>
              <div className="bg-[#070e1b] p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Backtrack Certainty</span>
                <span className="font-bold text-emerald-400">{backtrackData?.certainty ?? 'HIGH'} / Drift {driftCompatibility} (P &gt; {backtrackData?.probability.toFixed(2) ?? '0.92'})</span>
              </div>
            </div>

            {/* AIS Intersection Timeline */}
            <h4 className="text-[11px] uppercase font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Spatiotemporal AIS Intersection Timeline
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3 p-2 rounded bg-[#070e1b] border border-slate-800">
                <span className="text-slate-500 text-[11px] w-20">20:45 IST</span>
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-slate-300">
                  MV Ocean Star entered Sector Bravo perimeter at 16.2 knots.
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-amber-950/40 border border-amber-800/60">
                <span className="text-amber-400 font-bold text-[11px] w-20">20:58 IST</span>
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-200 font-medium">
                  Trajectory intersects oil spill origin coordinate (18.925°N, 71.650°E). Speed reduced to 11.4 knots.
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded bg-[#070e1b] border border-slate-800">
                <span className="text-slate-500 text-[11px] w-20">21:42 IST</span>
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-slate-300">
                  Sentinel-1A SAR satellite pass captured 12.6 km² dark slick anomaly.
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Vessel Probability Matrix */}
          <div className="bg-[#091220] border border-slate-800 rounded p-4">
            <h3 className="text-xs uppercase font-bold text-slate-200 mb-2.5">
              Sector Candidate Vessels Ranked by Likelihood
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase">
                    <th className="py-2">Vessel Name</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Proximity at Spill Time</th>
                    <th className="py-2">Course Deviation</th>
                    <th className="py-2 text-right">Attribution Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="bg-amber-950/30">
                    <td className="py-2 font-bold text-amber-300">MV Ocean Star</td>
                    <td className="py-2 text-slate-400">Tanker</td>
                    <td className="py-2 text-slate-200">{distanceAtSpill.toFixed(2)} NM (Direct Intersect)</td>
                    <td className="py-2 text-amber-400">{courseDeviation}</td>
                    <td className="py-2 text-right font-bold text-amber-400">{sourceConfidence}%</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">MT Sea Glory</td>
                    <td className="py-2 text-slate-400">Tanker</td>
                    <td className="py-2 text-slate-400">14.8 NM West</td>
                    <td className="py-2 text-slate-400">None (Steady Course)</td>
                    <td className="py-2 text-right font-bold text-slate-400">14%</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Al-Bahar 4</td>
                    <td className="py-2 text-slate-400">Fishing</td>
                    <td className="py-2 text-slate-400">18.2 NM East</td>
                    <td className="py-2 text-slate-400">Trawling Pattern</td>
                    <td className="py-2 text-right font-bold text-slate-400">3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceAnalysisView;
