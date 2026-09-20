import React from 'react';
import { mockAlerts } from '../../data/mockMaritimeData';
import { BellRing, X } from 'lucide-react';
import type { MaritimeAlert } from '../../types/maritime';


interface NotificationsDropdownProps {
  onClose: () => void;
  onSelectAlert?: (alert: MaritimeAlert) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  onClose,
  onSelectAlert,
}) => {
  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#070e1b] border border-cyan-800/60 rounded shadow-2xl z-50 overflow-hidden font-mono">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-[#091426] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Command Center Notifications
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300">
            {mockAlerts.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alert Feed */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => {
              onSelectAlert?.(alert);
              onClose();
            }}
            className="p-3 hover:bg-[#0c182c] cursor-pointer transition-colors flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                {alert.severity === 'CRITICAL' ? (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                )}
                {alert.title}
              </span>
              <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {alert.description}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 bg-[#060b14] border-t border-slate-800/80 text-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
          Broadcast feed &bull; Indian Coast Guard AIS Network
        </span>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
