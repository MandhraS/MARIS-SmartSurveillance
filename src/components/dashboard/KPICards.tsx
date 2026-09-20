import React from 'react';
import { Droplets, AlertTriangle, Ship, BellRing, ArrowUpRight } from 'lucide-react';
import { mockKPIs } from '../../data/mockMaritimeData';

export const KPICards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Active Spills */}
      <div className="bg-[#091220] border border-slate-800/90 rounded p-3.5 flex flex-col justify-between hover:border-cyan-700/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-300">
            Active Spills
          </span>
          <div className="p-1.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-3xl font-mono font-bold text-slate-100 tracking-tight">
            {mockKPIs.activeSpills.value}
          </span>
          <span className="text-xs font-mono text-cyan-400 font-medium flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            {mockKPIs.activeSpills.sublabel}
          </span>
        </div>
        <div className="w-full bg-slate-800/60 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-cyan-500 h-full rounded-full" style={{ width: '45%' }} />
        </div>
      </div>

      {/* High-Risk Incidents */}
      <div className="bg-[#091220] border border-slate-800/90 rounded p-3.5 flex flex-col justify-between hover:border-red-700/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-300">
            High-Risk Incidents
          </span>
          <div className="p-1.5 rounded bg-red-950/70 border border-red-800/40 text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-3xl font-mono font-bold text-red-400 tracking-tight">
            {mockKPIs.highRiskIncidents.value}
          </span>
          <span className="text-xs font-mono text-red-400/90 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            {mockKPIs.highRiskIncidents.sublabel}
          </span>
        </div>
        <div className="w-full bg-slate-800/60 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-red-500 h-full rounded-full" style={{ width: '65%' }} />
        </div>
      </div>

      {/* Vessels Monitored */}
      <div className="bg-[#091220] border border-slate-800/90 rounded p-3.5 flex flex-col justify-between hover:border-blue-700/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-300">
            Vessels Monitored
          </span>
          <div className="p-1.5 rounded bg-blue-950/70 border border-blue-800/40 text-blue-400">
            <Ship className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-3xl font-mono font-bold text-slate-100 tracking-tight">
            {mockKPIs.vesselsMonitored.value}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {mockKPIs.vesselsMonitored.sublabel}
          </span>
        </div>
        <div className="w-full bg-slate-800/60 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }} />
        </div>
      </div>

      {/* Alerts Today */}
      <div className="bg-[#091220] border border-slate-800/90 rounded p-3.5 flex flex-col justify-between hover:border-amber-700/50 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-300">
            Alerts Today
          </span>
          <div className="p-1.5 rounded bg-amber-950/70 border border-amber-800/40 text-amber-400">
            <BellRing className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-3xl font-mono font-bold text-amber-400 tracking-tight">
            {mockKPIs.alertsToday.value}
          </span>
          <span className="text-xs font-mono text-amber-300/90 font-medium flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            {mockKPIs.alertsToday.sublabel}
          </span>
        </div>
        <div className="w-full bg-slate-800/60 h-1 rounded-full mt-3 overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: '58%' }} />
        </div>
      </div>
    </div>
  );
};

export default KPICards;
