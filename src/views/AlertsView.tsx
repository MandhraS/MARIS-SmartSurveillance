import React from 'react';
import { AlertCircle, AlertTriangle, BellRing, Info, ShieldAlert } from 'lucide-react';
import { mockAlerts } from '../data/mockMaritimeData';
import type { AlertSeverity, MaritimeAlert } from '../types/maritime';

interface AlertsViewProps { onSelectAlert: (alert: MaritimeAlert) => void; }

const iconFor = (severity: AlertSeverity) => severity === 'CRITICAL' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : severity === 'HIGH' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : severity === 'MEDIUM' ? <AlertCircle className="w-4 h-4 text-yellow-400" /> : <Info className="w-4 h-4 text-cyan-400" />;
const toneFor = (severity: AlertSeverity) => severity === 'CRITICAL' ? 'border-rose-800/70 bg-rose-950/20' : severity === 'HIGH' ? 'border-amber-800/70 bg-amber-950/20' : 'border-slate-800 bg-[#091220]';

export const AlertsView: React.FC<AlertsViewProps> = ({ onSelectAlert }) => (
  <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto font-mono text-slate-100">
    <div className="flex items-center justify-between border-b border-slate-800 pb-4"><div><div className="flex items-center gap-2"><BellRing className="w-5 h-5 text-amber-400" /><h2 className="text-lg font-bold text-white">Alert Center</h2><span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">DEMO DISPATCH</span></div><p className="text-xs text-slate-400 mt-1">Prioritized prototype alerts linked to incidents and vessel evidence.</p></div><span className="text-xs text-amber-400">{mockAlerts.length} active</span></div>
    <div className="space-y-2">{mockAlerts.map((alert) => <button key={alert.id} type="button" onClick={() => onSelectAlert(alert)} className={`w-full text-left p-4 rounded border hover:border-cyan-700/70 transition-colors ${toneFor(alert.severity)}`}><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2">{iconFor(alert.severity)}<span className="text-sm font-bold text-slate-100">{alert.title}</span><span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">{alert.severity}</span></div><span className="text-[10px] text-slate-500">{alert.timestamp}</span></div><p className="text-xs text-slate-400 mt-2 pl-6">{alert.description}</p><div className="text-[10px] text-cyan-400 mt-2 pl-6">{alert.incidentId || alert.vesselName || 'Operational telemetry'} &bull; SELECT TO OPEN</div></button>)}</div>
  </div>
);

export default AlertsView;
