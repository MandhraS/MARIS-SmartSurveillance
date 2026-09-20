import React from 'react';
import type { Incident, RiskLevel } from '../../types/maritime';
import { mockIncidents } from '../../data/mockMaritimeData';
import { ShieldAlert, Eye } from 'lucide-react';


interface IncidentsTableProps {
  onSelectIncident?: (incident: Incident) => void;
  selectedIncidentId?: string;
}

const getRiskBadge = (risk: RiskLevel) => {
  switch (risk) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-700/60 text-rose-300">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 border border-red-700/60 text-red-300">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-700/60 text-amber-300">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          LOW
        </span>
      );
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'UNDER INVESTIGATION':
      return <span className="text-amber-400 text-[11px] font-mono font-medium">UNDER INVESTIGATION</span>;
    case 'DISPATCHED':
      return <span className="text-red-400 text-[11px] font-mono font-medium">DISPATCHED</span>;
    case 'VERIFYING':
      return <span className="text-cyan-400 text-[11px] font-mono font-medium">VERIFYING</span>;
    case 'CONTAINED':
      return <span className="text-emerald-400 text-[11px] font-mono font-medium">CONTAINED</span>;
    default:
      return <span className="text-slate-400 text-[11px] font-mono font-medium">{status}</span>;
  }
};

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  onSelectIncident,
  selectedIncidentId,
}) => {
  return (
    <div className="bg-[#091220] border border-slate-800 rounded overflow-hidden shadow-sm flex flex-col">
      {/* Table Title Bar */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200">
            Recent Surveillance Incidents
          </h3>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
            {mockIncidents.length} Active Records
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          INDIAN EXCLUSIVE ECONOMIC ZONE (EEZ)
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-[#070e1b] text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3.5">Incident ID</th>
              <th className="py-2.5 px-3.5">Location</th>
              <th className="py-2.5 px-3.5">Detected</th>
              <th className="py-2.5 px-3.5">Spill Area</th>
              <th className="py-2.5 px-3.5">Risk</th>
              <th className="py-2.5 px-3.5">Probable Source</th>
              <th className="py-2.5 px-3.5">Confidence</th>
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {mockIncidents.map((incident) => {
              const isSelected = incident.id === selectedIncidentId;
              return (
                <tr
                  key={incident.id}
                  onClick={() => onSelectIncident?.(incident)}
                  className={`hover:bg-[#0d1b33] cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-950/30 border-l-2 border-l-cyan-400' : ''
                  }`}
                >
                  <td className="py-3 px-3.5 font-bold text-slate-200">
                    <span className="hover:text-cyan-400 transition-colors">
                      {incident.id}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {incident.location}
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 whitespace-nowrap">
                    {incident.detectedAt}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-cyan-400 whitespace-nowrap">
                    {incident.spillAreaKm2} km²
                  </td>
                  <td className="py-3 px-3.5">
                    {getRiskBadge(incident.risk)}
                  </td>
                  <td className="py-3 px-3.5 text-slate-200 font-medium">
                    {incident.probableSource}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${incident.confidence}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px]">
                        {incident.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    {getStatusBadge(incident.status)}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident?.(incident);
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 border border-slate-700 transition-colors inline-flex items-center"
                      title="Inspect Incident"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentsTable;
