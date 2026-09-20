import React from 'react';
import { 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Search, 
  Binary, 
  AlertTriangle, 
  FileImage 
} from 'lucide-react';


export const DetectionIntelligencePanel: React.FC = () => {
  const pipelineSteps = [
    { label: 'Satellite Image', icon: <FileImage className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Preprocessing', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Water Segmentation', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Anomaly Detection', icon: <Search className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Spill Classification', icon: <Binary className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Risk Assessment', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> },
  ];

  return (
    <div className="bg-[#091220] border border-slate-800 rounded p-4 sm:p-5 font-mono text-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Detection Intelligence
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold">
          PIPELINE V1.0-RC
        </span>
      </div>

      {/* Explanation Text */}
      <p className="text-xs text-slate-300 leading-relaxed">
        MARIS identified a dark marine surface anomaly within the analyzed observation area. The candidate region has been classified as a probable oil-spill signature based on the prototype detection pipeline.
      </p>

      {/* Visual Pipeline Flowchart */}
      <div className="pt-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2.5">
          Integrated Detection Pipeline Stages
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {pipelineSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#070e1b] border border-slate-800 text-xs font-semibold text-slate-200 shadow-sm">
                {step.icon}
                <span>{step.label}</span>
              </div>
              {index < pipelineSteps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetectionIntelligencePanel;
