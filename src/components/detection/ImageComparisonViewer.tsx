import React, { useState } from 'react';
import {
  Layers,
  Eye,
  Target,
  SlidersHorizontal,
  Sparkles,
  Ship,
  Info
} from 'lucide-react';


interface ImageComparisonViewerProps {
  imageSrc: string;
}

export const ImageComparisonViewer: React.FC<ImageComparisonViewerProps> = ({ imageSrc }) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showVesselTrack, setShowVesselTrack] = useState(true);
  const [showThermalGradient, setShowThermalGradient] = useState(true);

  return (
    <div className="bg-[#091220] border border-slate-800 rounded p-4 sm:p-5 font-mono text-slate-200 shadow-sm space-y-4">
      {/* Header with Title and Display Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Satellite Observation vs. MARIS Detection Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized comparison of raw SAR imagery against AI prototype segmentation.
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${showOverlay
                ? 'bg-red-950/80 border-red-700 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
          >
            <Target className="w-3 h-3" />
            <span>Spill Boundary</span>
          </button>

          <button
            type="button"
            onClick={() => setShowThermalGradient(!showThermalGradient)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${showThermalGradient
                ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>False Color Sheen</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVesselTrack(!showVesselTrack)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${showVesselTrack
                ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
          >
            <Ship className="w-3 h-3" />
            <span>Suspect Track</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Dual Viewport Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT VIEWPORT: Satellite Observation */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Satellite Observation (Raw Input)
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              C-SAR / VV
            </span>
          </div>

          <div className="relative aspect-[4/3] rounded overflow-hidden border border-slate-800 bg-[#060b14] flex items-center justify-center group">
            <img
              src={imageSrc}
              alt="Raw Satellite Observation"
              className="w-full h-full object-cover"
            />
            {/* Corner telemetry tag */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] text-slate-400 backdrop-blur-sm">
              RAW INTENSITY CHANNEL
            </div>
          </div>
        </div>

        {/* RIGHT VIEWPORT: MARIS Detection */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1.5 text-red-400">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              MARIS Detection (Segmented Analysis)
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 border border-red-700/80 text-red-300 font-bold">
              SLICK ANOMALY EXTRACTED
            </span>
          </div>

          <div className="relative aspect-[4/3] rounded overflow-hidden border border-red-900/60 bg-[#060b14] flex items-center justify-center">
            {/* Underlying Satellite Image */}
            <img
              src={imageSrc}
              alt="MARIS Detection Layer"
              className="w-full h-full object-cover"
            />

            {/* SVG OVERLAY: Prototype Segmentation Boundary & Classification */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* False-color Thermal Sheen Delineation */}
              {showThermalGradient && (
                <g opacity="0.45">
                  <path
                    d="M 300,220 C 390,190 490,210 555,260 C 610,300 625,370 575,420 C 525,465 430,450 350,435 C 280,420 240,370 235,300 C 230,250 260,235 300,220 Z"
                    fill="url(#slick-gradient)"
                  />
                  <defs>
                    <radialGradient id="slick-gradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                    </radialGradient>
                  </defs>
                </g>
              )}

              {/* Vector Boundary Polygon Overlay */}
              {showOverlay && (
                <g>
                  {/* Outer Bounding Box */}
                  <rect
                    x="230"
                    y="190"
                    width="390"
                    height="270"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    opacity="0.8"
                  />

                  {/* Bounding Box Label */}
                  <rect x="230" y="172" width="170" height="18" fill="#7f1d1d" rx="2" />
                  <text x="236" y="184" fill="#fecaca" fontFamily="monospace" fontSize="10" fontWeight="bold">
                    OIL SLICK CLASSIFIED (94%)
                  </text>

                  {/* High-Resolution Spill Perimeter Contour */}
                  <path
                    d="M 320,240 
                       C 380,210 460,225 520,270 
                       C 560,300 580,350 540,395 
                       C 500,435 430,420 370,410 
                       C 310,400 270,360 260,310 
                       C 255,275 285,255 320,240 Z"
                    fill="rgba(239, 68, 68, 0.25)"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                  />

                  {/* Centroid Reticle */}
                  <g transform="translate(420, 315)">
                    <circle cx="0" cy="0" r="12" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="-16" y1="0" x2="16" y2="0" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="0" y1="-16" x2="0" y2="16" stroke="#ef4444" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="3" fill="#ef4444" />
                    <text x="18" y="4" fill="#fecaca" fontFamily="monospace" fontSize="10" fontWeight="bold">
                      CENTROID: 18.925°N, 71.650°E
                    </text>
                  </g>
                </g>

              )}

              {/* Suspect Vessel Vector (MV Ocean Star Proximity) */}
              {showVesselTrack && (
                <g>
                  {/* Suspect Vessel Halo */}
                  <circle
                    cx="0"
                    cy="0"
                    r="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />

                  <rect
                    x="22"
                    y="-12"
                    width="130"
                    height="24"
                    rx="3"
                    fill="#070e1b"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />

                  <text
                    x="28"
                    y="4"
                    fill="#fbbf24"
                    fontFamily="monospace"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    SUSPECT: MV OCEAN STAR
                  </text>
                </g>
              )}
            </svg>

            {/* Corner telemetry tag */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-red-800 text-[10px] text-red-400 font-bold backdrop-blur-sm">
              PROTOTYPE SEGMENTATION ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="px-3.5 py-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            <strong>Prototype Visualization Note:</strong> Detection boundaries and false-color highlights are simulated based on the prototype extraction pipeline for the Smart India Hackathon.
          </span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
          MODEL RES: 10m/px
        </span>
      </div>
    </div>
  );
};

export default ImageComparisonViewer;
