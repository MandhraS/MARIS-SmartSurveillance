import React, { useEffect, useState } from 'react';
import { Ship, Flag, Navigation } from 'lucide-react';
import { mockVessels } from '../data/mockMaritimeData';
import type { Vessel } from '../types/maritime';
import { fetchVessels } from '../services/api';

interface VesselTrackingViewProps {
  onSelectVessel: (vessel: Vessel) => void;
}

export const VesselTrackingView: React.FC<VesselTrackingViewProps> = ({ onSelectVessel }) => {
  const [trackedVessels, setTrackedVessels] = useState(mockVessels);

  useEffect(() => {
    let isMounted = true;
    void fetchVessels().then((vessels) => {
      if (isMounted && vessels) setTrackedVessels(vessels);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-[1600px] mx-auto font-mono text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Vessel Tracking &amp; AIS Telemetry Fleet</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">AIS PROTOTYPE FEED</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Structured demonstration data for maritime traffic correlation.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['1,284', 'Vessels Monitored', 'text-cyan-400'],
          ['37', 'Investigation Zone', 'text-amber-400'],
          ['12', 'High-Risk Vessels', 'text-red-400'],
          ['6', 'Recently Flagged', 'text-emerald-400'],
        ].map(([value, label, color]) => (
          <div key={label} className="bg-[#091220] border border-slate-800 rounded p-3">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#091220] border border-slate-800 rounded p-4 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-200">AIS Prototype Feed</h3>
          <span className="text-[10px] text-slate-500">DEMO DATA / NOT LIVE AIS</span>
        </div>
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
            <tr><th className="py-2">Vessel</th><th>Type</th><th>Speed</th><th>Heading</th><th>Destination</th><th>Risk</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {trackedVessels.map((vessel) => (
              <tr key={vessel.id} onClick={() => onSelectVessel(vessel)} className="cursor-pointer hover:bg-cyan-950/20 transition-colors">
                <td className="py-3 font-bold text-slate-200 flex items-center gap-2"><Ship className={`w-3.5 h-3.5 ${vessel.isProbableSource ? 'text-amber-400' : 'text-cyan-400'}`} />{vessel.name}</td>
                <td className="text-slate-400">{vessel.type}</td><td className="text-cyan-300">{vessel.speedKnots} kn</td><td className="text-slate-300">{vessel.heading}°</td><td className="text-slate-400">{vessel.destination}</td>
                <td><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${vessel.isProbableSource ? 'bg-amber-950/70 border-amber-800 text-amber-300' : vessel.type === 'Coast Guard Patrol' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}><Flag className="w-3 h-3" />{vessel.isProbableSource ? 'HIGH / SOURCE' : vessel.type === 'Coast Guard Patrol' ? 'OPERATIONAL' : 'MONITORED'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[10px] text-slate-500 flex items-center gap-2"><Navigation className="w-3.5 h-3.5 text-cyan-500" />Click a vessel for IMO, AIS status, destination, and MARIS-2026-001 source correlation details.</div>
    </div>
  );
};

export default VesselTrackingView;
