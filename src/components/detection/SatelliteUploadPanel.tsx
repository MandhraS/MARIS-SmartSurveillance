import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Maximize2, 
  HardDrive,
  RefreshCw 
} from 'lucide-react';

export interface UploadedImageMeta {
  src: string;
  name: string;
  dimensions: string;
  size: string;
  timestamp: string;
  isDemo?: boolean;
}

interface SatelliteUploadPanelProps {
  onImageReady: (meta: UploadedImageMeta) => void;
  onRunDetection: () => void;
  isProcessing: boolean;
  imageMeta: UploadedImageMeta | null;
}

export const SatelliteUploadPanel: React.FC<SatelliteUploadPanelProps> = ({
  onImageReady,
  onRunDetection,
  isProcessing,
  imageMeta,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const now = new Date();
        const timestamp = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST';

        const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        onImageReady({
          src: result,
          name: file.name,
          dimensions: `${img.naturalWidth} × ${img.naturalHeight} px`,
          size: sizeInMb,
          timestamp: timestamp,
          isDemo: false,
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadDemoScene = () => {
    const demoUrl = '/assets/demo-satellite-scene.svg';
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' IST';

    onImageReady({
      src: demoUrl,
      name: 'SENTINEL1A_SAR_C_BAND_ARABIAN_SECTOR_B.tiff',
      dimensions: '2048 × 2048 px (10m/px)',
      size: '14.8 MB',
      timestamp: timestamp,
      isDemo: true,
    });
  };

  return (
    <div className="bg-[#091220] border border-slate-800 rounded p-4 sm:p-5 font-mono text-slate-200 flex flex-col justify-between shadow-sm">
      {/* Title & Description */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-cyan-400" />
              Satellite Observation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a satellite image for oil-spill analysis.
            </p>
          </div>

          {/* Load Demonstration Scene Button */}
          <button
            type="button"
            onClick={handleLoadDemoScene}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-semibold transition-colors disabled:opacity-50 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Demonstration Scene</span>
          </button>
        </div>
      </div>

      {/* Upload Drop Zone / Preview Area */}
      {!imageMeta ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-800 hover:border-cyan-600/50 bg-[#070e1b]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            accept=".jpg,.jpeg,.png,.tif,.tiff"
            className="hidden"
          />

          <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 mb-3 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">
            Drag and drop high-resolution satellite imagery here
          </p>
          <p className="text-xs text-slate-400 mb-4">
            or click to browse from local workstation
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            Browse Files
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[10px] text-slate-500">
            <span>Supported: <strong>JPG, PNG, TIFF</strong></span>
            <span>&bull;</span>
            <span>Max Size: <strong>50 MB</strong></span>
            <span>&bull;</span>
            <span>Sensor: <strong>SAR / Multispectral</strong></span>
          </div>
        </div>
      ) : (
        /* Image Preview & Telemetry Card */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#070e1b] border border-slate-800 rounded p-3 sm:p-4">
            {/* Thumbnail Preview */}
            <div className="md:col-span-5 relative rounded overflow-hidden border border-slate-800 bg-black max-h-56 flex items-center justify-center">
              <img
                src={imageMeta.src}
                alt="Satellite Observation Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-slate-700 text-[10px] font-mono text-cyan-300 backdrop-blur-sm">
                {imageMeta.isDemo ? 'SIH DEMO SAR SCENE' : 'RAW UPLOAD'}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Observation Metadata
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Ready for Analysis
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-500 flex items-center gap-1">
                      <FileImage className="w-3 h-3 text-cyan-400" /> Filename:
                    </span>
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]" title={imageMeta.name}>
                      {imageMeta.name}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-cyan-400" /> Dimensions:
                    </span>
                    <span className="font-semibold text-slate-200">
                      {imageMeta.dimensions}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-500 flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-cyan-400" /> File Size:
                    </span>
                    <span className="font-semibold text-slate-200">
                      {imageMeta.size}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Ingested At:
                    </span>
                    <span className="font-semibold text-slate-300">
                      {imageMeta.timestamp}
                    </span>
                  </div>

                  <div className="mt-2 rounded border border-cyan-900/60 bg-cyan-950/20 px-2.5 py-2 text-[10px] text-cyan-200">
                    <div className="font-bold uppercase tracking-wider text-cyan-400">Observation Profile</div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-slate-400">
                      <span>Sensor: <strong className="text-slate-200">Sentinel-1A</strong></span>
                      <span>Mode: <strong className="text-slate-200">C-SAR</strong></span>
                      <span>Polarization: <strong className="text-slate-200">VV</strong></span>
                      <span>Scene: <strong className="text-slate-200">Arabian Sea</strong></span>
                    </div>
                    <div className="mt-1 text-slate-500">Prototype metadata for local demonstration imagery.</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Replace Image & RUN DETECTION */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace Image</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                  accept=".jpg,.jpeg,.png,.tif,.tiff"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={onRunDetection}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{isProcessing ? 'Processing Analysis...' : 'RUN SPILL DETECTION'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteUploadPanel;
