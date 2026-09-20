import React from 'react';
import type { NavigationTab } from '../../types/maritime';

import { 
  Compass, 
  Radar, 
  Droplets, 
  Map, 
  Ship, 
  SearchCheck, 
  BellRing, 
  FileText, 
  BarChart3, 
  Activity, 
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const mainNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'command-center', label: 'Command Center', icon: <Radar className="w-4 h-4" /> },
    { id: 'spill-detection', label: 'Spill Detection', icon: <Droplets className="w-4 h-4 text-cyan-400" />, badge: '12' },
    { id: 'maritime-map', label: 'Maritime Map', icon: <Map className="w-4 h-4" /> },
    { id: 'vessel-tracking', label: 'Vessel Tracking', icon: <Ship className="w-4 h-4" />, badge: '1.2k' },
    { id: 'source-analysis', label: 'Source Analysis', icon: <SearchCheck className="w-4 h-4 text-amber-400" /> },
    { id: 'alerts', label: 'Alerts', icon: <BellRing className="w-4 h-4 text-rose-400" />, badge: '27' },
    { id: 'incident-reports', label: 'Incident Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const bottomNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'system-status', label: 'System Status', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 lg:w-64 bg-[#070e1b] border-r border-slate-800/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Top Branding Section */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
            <Compass className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-base font-extrabold tracking-wider text-white">
                MARIS
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300 font-bold">
                OPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
              Maritime Domain Radar
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-2 space-y-0.5">
          <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
            Tactical Operations
          </div>
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all text-left group ${
                  isActive
                    ? 'bg-cyan-950/60 border border-cyan-700/50 text-cyan-300 font-bold shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-[#0c1628] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-cyan-900 text-cyan-200 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Utility Items */}
      <div className="p-2 border-t border-slate-800/80 space-y-0.5 bg-[#060b14]/50">
        <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
          System Control
        </div>
        {bottomNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all text-left ${
                isActive
                  ? 'bg-cyan-950/60 border border-cyan-700/50 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1628] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </button>
          );
        })}

        {/* Classification footer */}
        <div className="px-3 py-2 mt-1 rounded bg-slate-900/60 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>ENC LEVEL: <strong className="text-cyan-400">DEF-AES256</strong></span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
