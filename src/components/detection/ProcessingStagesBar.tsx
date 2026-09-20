import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  CircleDashed, 
  Cpu, 
  Layers, 
  Binary, 
  ShieldAlert, 
  Search, 
  Filter 
} from 'lucide-react';

export interface StageInfo {
  id: number;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const STAGES: StageInfo[] = [
  { id: 1, label: 'Image acquisition', description: 'Decompressing SAR complex image & geo-referencing grid', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 2, label: 'Preprocessing', description: 'Lee speckle filtering & radiometric backscatter calibration', icon: <Filter className="w-3.5 h-3.5" /> },
  { id: 3, label: 'Water-body segmentation', description: 'Otsu adaptive thresholding & landmass coastal masking', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 4, label: 'Dark-region candidate detection', description: 'Low-backscatter capillary wave damping identification', icon: <Search className="w-3.5 h-3.5" /> },
  { id: 5, label: 'Oil-spill classification', description: 'Morphology texture analysis & biogenic lookalike rejection', icon: <Binary className="w-3.5 h-3.5" /> },
  { id: 6, label: 'Spill boundary extraction', description: 'Snakes active contour vector polygon delineation', icon: <CircleDashed className="w-3.5 h-3.5" /> },
  { id: 7, label: 'Risk assessment', description: 'Drift velocity calculation & offshore asset proximity evaluation', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
];

interface ProcessingStagesBarProps {
  currentStage: number; // 0 = idle, 1..7 = active, 8 = complete
  progressPercent: number; // 0 - 100
}

export const ProcessingStagesBar: React.FC<ProcessingStagesBarProps> = ({
  currentStage,
  progressPercent,
}) => {
  return (
    <div className="bg-[#091220] border border-cyan-800/60 rounded p-4 sm:p-5 font-mono text-slate-200 shadow-xl space-y-4">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
            MARIS Pipeline Execution in Progress
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-cyan-400 font-bold">
            Stage {Math.min(currentStage, 7)} of 7
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-bold">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-[#060b14] h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Progressive Stage Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2 pt-1">
        {STAGES.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;
          const isPending = currentStage < stage.id;

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-700/50 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-[#070e1b] border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase">
                  Stage {stage.id}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {isCurrent && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                {isPending && <span className="h-2 w-2 rounded-full bg-slate-700" />}
              </div>

              <div className="text-[11px] font-semibold truncate leading-tight">
                {stage.label}
              </div>

              <div className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-tight hidden lg:block">
                {stage.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingStagesBar;
