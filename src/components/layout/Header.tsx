import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Bell, Clock } from 'lucide-react';
import { NotificationsDropdown } from '../modals/NotificationsDropdown';
import type { MaritimeAlert } from '../../types/maritime';


interface HeaderProps {
  onSelectAlert?: (alert: MaritimeAlert) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectAlert }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('08 Sep 2026, 23:36:12 IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as DD Mon YYYY, HH:mm:ss IST
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = now.toLocaleDateString('en-GB', options) + ' IST';
      setCurrentTime(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full border-b border-slate-800 bg-[#070e1b]/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between z-40 sticky top-0">
      {/* Title & Organization Identity */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">MARIS</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-slate-200">Smart Maritime Surveillance</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
            SIH prototype console &bull; simulated AIS correlation feed
          </p>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-3.5">
        {/* SYSTEM OPERATIONAL Indicator */}
        <div className="hidden md:block">
          <StatusBadge statusText="System Operational" />
        </div>

        {/* Last Data Update Timestamp */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#091220] border border-slate-800 text-[11px] font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">SYNC:</span>
          <span className="font-semibold text-slate-200">{currentTime}</span>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded bg-[#091220] border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-300 transition-colors"
            title="Command Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
              4
            </span>
          </button>

          {showNotifications && (
            <NotificationsDropdown
              onClose={() => setShowNotifications(false)}
              onSelectAlert={onSelectAlert}
            />
          )}
        </div>

        {/* User / Operator Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold shadow-sm">
            RV
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-mono font-bold text-slate-200 leading-tight">
              Cmdr. R. Verma
            </span>
            <span className="text-[10px] font-mono text-cyan-400/90 leading-tight">
              ICG Sector West
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
