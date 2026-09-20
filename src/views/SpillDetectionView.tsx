import React, { useState } from 'react';
import { SatelliteUploadPanel, type UploadedImageMeta } from '../components/detection/SatelliteUploadPanel';
import { ProcessingStagesBar } from '../components/detection/ProcessingStagesBar';
import { ImageComparisonViewer } from '../components/detection/ImageComparisonViewer';
import { DetectionMetricsPanel } from '../components/detection/DetectionMetricsPanel';
import { DetectionIntelligencePanel } from '../components/detection/DetectionIntelligencePanel';
import { analyzeSAR, type DetectionResponse } from '../services/api';
import { Satellite, CheckCircle2, Loader2 } from 'lucide-react';


interface SpillDetectionViewProps {
  onViewOnMap: () => void;
  onAnalyzeSource: () => void;
  onGenerateReport: () => void;
}

export const SpillDetectionView: React.FC<SpillDetectionViewProps> = ({
  onViewOnMap,
  onAnalyzeSource,
  onGenerateReport,
}) => {
  const [imageMeta, setImageMeta] = useState<UploadedImageMeta | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0); // 0=idle, 1..7, 8=completed
  const [progressPercent, setProgressPercent] = useState(0);
  const [hasResult, setHasResult] = useState(false);
  const [detection, setDetection] = useState<DetectionResponse | null>(null);

  // Run Spill Detection simulation (5–8 seconds total)
  const handleRunDetection = async () => {
    if (!imageMeta || isProcessing) return;

    setIsProcessing(true);
    setHasResult(false);
    setCurrentStage(1);
    setProgressPercent(10);

    let uploadedFile: File | undefined;
    try {
      const response = await fetch(imageMeta.src);
      const blob = await response.blob();
      uploadedFile = new File([blob], imageMeta.name, { type: blob.type || 'application/octet-stream' });
    } catch {
      uploadedFile = undefined;
    }
    const apiDetection = await analyzeSAR(uploadedFile);
    if (apiDetection) setDetection(apiDetection);

    // Stage 1 -> 2
    setTimeout(() => {
      setCurrentStage(2);
      setProgressPercent(25);
    }, 850);

    // Stage 2 -> 3
    setTimeout(() => {
      setCurrentStage(3);
      setProgressPercent(40);
    }, 1700);

    // Stage 3 -> 4
    setTimeout(() => {
      setCurrentStage(4);
      setProgressPercent(55);
    }, 2550);

    // Stage 4 -> 5
    setTimeout(() => {
      setCurrentStage(5);
      setProgressPercent(70);
    }, 3400);

    // Stage 5 -> 6
    setTimeout(() => {
      setCurrentStage(6);
      setProgressPercent(85);
    }, 4300);

    // Stage 6 -> 7
    setTimeout(() => {
      setCurrentStage(7);
      setProgressPercent(95);
    }, 5200);

    // Stage 7 -> Completed
    setTimeout(() => {
      setCurrentStage(8);
      setProgressPercent(100);
      setIsProcessing(false);
      setHasResult(true);
    }, 6100);
  };

  const getProcessingStatusBadge = () => {
    if (isProcessing) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ANALYZING SAR SCENE...
        </span>
      );
    }
    if (hasResult) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          DETECTION COMPLETED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold">
        <span className="h-2 w-2 rounded-full bg-cyan-400" />
        PROCESSING STATUS: READY
      </span>
    );
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-5 max-w-[1920px] mx-auto font-mono text-slate-100">
      {/* 1. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091220] border border-slate-800 rounded p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Satellite className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-white">
                Satellite Spill Detection
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold hidden sm:inline">
                SAR INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AI-assisted detection and characterization of marine oil pollution
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            SYSTEM STATUS: OPERATIONAL
          </div>

          {getProcessingStatusBadge()}
        </div>
      </div>

      {/* 2. Satellite Image Upload & Demo Loader */}
      <SatelliteUploadPanel
        onImageReady={(meta) => {
          setImageMeta(meta);
          setHasResult(false);
          setDetection(null);
          setCurrentStage(0);
          setProgressPercent(0);
        }}
        onRunDetection={handleRunDetection}
        isProcessing={isProcessing}
        imageMeta={imageMeta}
      />

      {/* 3. Progressive 7-Stage Pipeline Simulator */}
      {(isProcessing || (currentStage > 0 && currentStage <= 7)) && (
        <ProcessingStagesBar
          currentStage={currentStage}
          progressPercent={progressPercent}
        />
      )}

      {/* 4. Detection Result, Comparison Viewer & Metrics (Visible after processing completes) */}
      {hasResult && imageMeta && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Metrics & Action Controls */}
          <DetectionMetricsPanel
            onViewOnMap={onViewOnMap}
            onAnalyzeSource={onAnalyzeSource}
            onGenerateReport={onGenerateReport}
            detection={detection}
          />

          {/* Synchronized Side-by-Side Comparison */}
          <ImageComparisonViewer imageSrc={imageMeta.src} />

          {/* Detection Intelligence & Multi-Stage Architecture */}
          <DetectionIntelligencePanel />
        </div>
      )}
    </div>
  );
};

export default SpillDetectionView;
