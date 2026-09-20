import React from 'react';
import type { MaritimeAlert, AlertSeverity } from '../../types/maritime';
import { mockAlerts } from '../../data/mockMaritimeData';
import { BellRing, AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';


interface AlertsPanelProps {
  onSelectAlert?: (alert: MaritimeAlert) => void;
}

const getSeverityIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    case 'HIGH':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    case 'MEDIUM':
      return <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />;
    case 'INFO':
      return <Info className="w-3.5 h-3.5 text-cyan-400" />;
  }
};

const getSeverityTag = (severity: AlertSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'text-rose-400 bg-rose-950/70 border-rose-800/60';
    case 'HIGH':
      return 'text-amber-400 bg-amber-950/70 border-amber-800/60';
    case 'MEDIUM':
      return 'text-yellow-400 bg-yellow-950/70 border-yellow-800/60';
    case 'INFO':
      return 'text-cyan-400 bg-cyan-950/70 border-cyan-800/60';
  }
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ onSelectAlert }) => {
  return (
    <div className="bg-[#091220] border border-slate-800 rounded p-3.5 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200">
            Operational Alerts
          </h3>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-400 font-semibold">
          {mockAlerts.length} Active
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] pr-0.5">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onSelectAlert?.(alert)}
            className="group p-2.5 rounded bg-[#070e1b] border border-slate-800/90 hover:border-slate-700 hover:bg-[#0c182c] cursor-pointer transition-colors flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {getSeverityIcon(alert.severity)}
                <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                  {alert.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getSeverityTag(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {alert.timestamp}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono leading-tight pl-5">
              {alert.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;
