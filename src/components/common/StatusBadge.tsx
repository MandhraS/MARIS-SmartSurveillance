import React from 'react';
import { Activity } from 'lucide-react';

interface StatusBadgeProps {
  statusText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  statusText = 'System Operational',
}) => {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-300">
        {statusText}
      </span>
      <Activity className="w-3.5 h-3.5 text-emerald-400/80 ml-0.5" />
    </div>
  );
};

export default StatusBadge;
