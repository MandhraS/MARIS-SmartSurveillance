import React, { useEffect, useState } from 'react';
import { FileText, Printer, ShieldAlert } from 'lucide-react';
import type { Incident } from '../types/maritime';
import { generateIncidentReport, type IncidentReportResponse } from '../services/api';

interface IncidentReportViewProps {
  incident: Incident;
  onBack: () => void;
}

export const IncidentReportView: React.FC<IncidentReportViewProps> = ({ incident, onBack }) => {
  const [report, setReport] = useState<IncidentReportResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    void generateIncidentReport(incident.id).then((result) => {
      if (isMounted && result) setReport(result);
    });
    return () => {
      isMounted = false;
    };
  }, [incident.id]);

  const detection = report?.detection;
  const location = report?.location;
  const backtrack = report?.backtrack;
  const spillArea = detection?.spillAreaKm2 ?? incident.spillAreaKm2;
  const confidence = detection?.confidence ?? incident.confidence;
  const risk = detection?.risk ?? incident.risk;
  const source = report?.primarySuspect ?? incident.probableSource;
  const sourceConfidence = report?.attributionConfidence ?? incident.sourceConfidence;

  return (
    <div className="p-3.5 sm:p-6 max-w-4xl mx-auto font-mono text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-lg font-bold text-white">MARIS INCIDENT REPORT</h2>
            <p className="text-xs text-slate-400">Prototype evidence summary / local demonstration data</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="px-3 py-2 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">Back</button>
          <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 rounded bg-cyan-950 border border-cyan-700 text-xs font-bold text-cyan-300"><Printer className="w-3.5 h-3.5" />Print Report</button>
        </div>
      </div>

      <article className="bg-[#091220] border border-slate-800 rounded p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div><div className="text-[10px] uppercase text-slate-500">Incident ID</div><div className="text-xl font-bold text-red-400">{incident.id}</div><div className="text-sm text-slate-300 mt-1">{incident.title}</div></div>
          <div className="text-right"><ShieldAlert className="w-7 h-7 text-red-400 ml-auto" /><div className="text-xs font-bold text-red-400 mt-1">RISK: {risk}</div></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            ['Detection Time', incident.detectedAt],
            ['Location', location?.sourceRegion ?? 'Arabian Sea'],
            ['Spill Area', `${spillArea} km²`],
            ['Detection Confidence', `${confidence}%`],
            ['Probable Source', source],
            ['Attribution Confidence', `${sourceConfidence}%`],
          ].map(([label, value]) => <div key={label} className="bg-[#070e1b] border border-slate-800 rounded p-3"><div className="text-[10px] text-slate-500 uppercase">{label}</div><div className="font-bold text-slate-200 mt-1">{value}</div></div>)}
        </div>

        <div className="grid md:grid-cols-2 gap-5 text-xs">
          <section><h3 className="text-xs uppercase font-bold text-amber-400 mb-2">Evidence</h3><ul className="space-y-2 text-slate-300 list-disc list-inside"><li>AIS trajectory intersection</li><li>Spatial proximity</li><li>Temporal correlation</li><li>Drift-backtracking compatibility</li><li>Vessel behavior anomaly</li></ul></section>
          <section><h3 className="text-xs uppercase font-bold text-cyan-400 mb-2">Recommended Actions</h3><ul className="space-y-2 text-slate-300 list-disc list-inside">{(report?.recommendedResponse ?? ['Notify maritime authority', 'Investigate probable source vessel', 'Continue satellite monitoring', 'Initiate response assessment']).map((action) => <li key={action}>{action}</li>)}</ul></section>
        </div>

        <div className="border-t border-slate-800 pt-3 text-xs text-slate-400">
          <span className="text-slate-500 uppercase text-[10px]">Backtrack</span>
          <div className="mt-1">{backtrack?.surfaceWind ?? '14 kn (210° SW)'} &bull; {backtrack?.tidalCurrent ?? '1.2 kn (SSW)'} &bull; {backtrack?.estimatedSpillTime ?? '20:55 - 21:05 IST'} &bull; certainty: {backtrack?.certainty ?? 'HIGH'}</div>
        </div>
        <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-500">This report summarizes a MARIS prototype workflow. Vessel, AIS, and detection values are local demonstration data unless independently verified.</div>
      </article>
    </div>
  );
};

export default IncidentReportView;
