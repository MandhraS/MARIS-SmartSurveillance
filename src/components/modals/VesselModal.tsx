import React from 'react';
import type { Vessel } from '../../types/maritime';
import { X, Ship, AlertTriangle } from 'lucide-react';


interface VesselModalProps {
  vessel: Vessel | null;
  onClose: () => void;
  onAnalyzeVessel?: (vessel: Vessel) => void;
}

export const VesselModal: React.FC<VesselModalProps> = ({ vessel, onClose, onAnalyzeVessel }) => {
  if (!vessel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#070e1b] border border-cyan-800/80 rounded w-full max-w-lg overflow-hidden shadow-2xl font-mono text-slate-200">
        {/* Header */}
        <div className="px-4 py-3 bg-[#091426] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded ${vessel.isProbableSource ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'}`}>
              <Ship className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{vessel.name}</h3>
              <span className="text-[10px] text-slate-400">{vessel.flag} &bull; {vessel.imo}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs">
          {vessel.isProbableSource && (
            <div className="p-2.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Attributed as probable discharge source for spill <strong>MARIS-2026-001</strong> (92% Confidence).</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#091220] p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Vessel Type</span>
              <span className="font-bold text-slate-200">{vessel.type}</span>
            </div>
            <div className="bg-[#091220] p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">AIS Speed</span>
              <span className="font-bold text-cyan-400">{vessel.speedKnots} knots</span>
            </div>
            <div className="bg-[#091220] p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Heading</span>
              <span className="font-bold text-slate-200">{vessel.heading}°</span>
            </div>
            <div className="bg-[#091220] p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Position</span>
              <span className="font-bold text-slate-200">{vessel.position[0].toFixed(3)}°N, {vessel.position[1].toFixed(3)}°E</span>
            </div>
          </div>

          <div className="bg-[#091220] p-2.5 rounded border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Navigation Status:</span>
              <span className="font-bold text-emerald-400">{vessel.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Declared Destination:</span>
              <span className="font-bold text-slate-200">{vessel.destination}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#091426] border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
          {vessel.isProbableSource && (
            <button
              onClick={() => {
                onClose();
                onAnalyzeVessel?.(vessel);
              }}
              className="px-3 py-1.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-bold"
            >
              Analyze Source Track
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VesselModal;
