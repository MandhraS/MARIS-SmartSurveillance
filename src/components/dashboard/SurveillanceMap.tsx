import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Incident, Vessel } from '../../types/maritime';
import { mockIncidents, mockVessels } from '../../data/mockMaritimeData';
import { Layers, RefreshCw } from 'lucide-react';


interface SurveillanceMapProps {
  onSelectIncident?: (incident: Incident) => void;
  onSelectVessel?: (vessel: Vessel) => void;
  highlightedIncidentId?: string;
}

export const SurveillanceMap: React.FC<SurveillanceMapProps> = ({
  onSelectIncident,
  onSelectVessel,
  highlightedIncidentId = 'MARIS-2026-001',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center around Mumbai High Offshore Sector / Arabian Sea
    const initialCenter: [number, number] = [18.925, 71.650];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    // OpenStreetMap tile layer (No API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'maritime-osm-tiles',
    }).addTo(map);


    // Zoom controls positioned top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // 1. ACTIVE OIL SPILL DETECTION ZONE (MARIS-2026-001)
    const primaryIncident = mockIncidents.find((inc) => inc.id === highlightedIncidentId) || mockIncidents[0];
    const spillCenter = primaryIncident.coordinates;

    // Investigation perimeter (dashed circle around incident)
    const investigationZone = L.circle(spillCenter, {
      radius: 9500, // ~9.5 km radius
      color: '#06b6d4',
      weight: 1.5,
      dashArray: '5, 8',
      fillColor: '#0891b2',
      fillOpacity: 0.04,
    }).addTo(map);

    investigationZone.bindTooltip('INVESTIGATION ZONE: SECTOR BRAVO', {
      permanent: false,
      direction: 'top',
      className: 'maritime-leaflet-tooltip',
    });

    // Spill polygon representing satellite SAR oil slick morphology
    const slickPolygonCoords: [number, number][] = [
      [spillCenter[0] + 0.035, spillCenter[1] - 0.020],
      [spillCenter[0] + 0.045, spillCenter[1] + 0.015],
      [spillCenter[0] + 0.020, spillCenter[1] + 0.040],
      [spillCenter[0] - 0.015, spillCenter[1] + 0.035],
      [spillCenter[0] - 0.030, spillCenter[1] + 0.010],
      [spillCenter[0] - 0.025, spillCenter[1] - 0.025],
      [spillCenter[0] + 0.005, spillCenter[1] - 0.035],
    ];

    const spillPolygon = L.polygon(slickPolygonCoords, {
      color: '#ef4444',
      weight: 2,
      fillColor: '#b91c1c',
      fillOpacity: 0.35,
    }).addTo(map);

    // Pulsing Spill Center Marker
    const spillIconHtml = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute h-8 w-8 rounded-full bg-red-500 opacity-60"></span>
        <span class="relative h-4 w-4 rounded-full bg-red-600 border border-white flex items-center justify-center shadow-lg">
          <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
        </span>
      </div>
    `;

    const spillMarkerIcon = L.divIcon({
      html: spillIconHtml,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const spillMarker = L.marker(spillCenter, { icon: spillMarkerIcon }).addTo(map);

    const spillPopupContent = `
      <div style="min-width: 220px; font-family: monospace; color: #f1f5f9; background: #070e1b; border: 1px solid #ef4444; padding: 12px; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(239, 68, 68, 0.4); padding-bottom: 6px; margin-bottom: 8px;">
          <span style="font-weight: bold; color: #ef4444; font-size: 13px;">${primaryIncident.id}</span>
          <span style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 10px; padding: 2px 6px; border-radius: 2px; font-weight: bold;">RISK: ${primaryIncident.risk}</span>
        </div>
        <div style="font-size: 11px; line-height: 1.6; color: #cbd5e1;">
          <div><strong>Detection:</strong> ${primaryIncident.detectedAt}</div>
          <div><strong>Est. Area:</strong> ${primaryIncident.spillAreaKm2} km²</div>
          <div><strong>Confidence:</strong> <span style="color: #34d399;">${primaryIncident.confidence}%</span></div>
          <div><strong>Probable Source:</strong> <span style="color: #f59e0b;">${primaryIncident.probableSource}</span></div>
          <div><strong>Status:</strong> ${primaryIncident.status}</div>
        </div>
      </div>
    `;

    spillMarker.bindPopup(spillPopupContent);
    spillPolygon.bindPopup(spillPopupContent);

    spillMarker.on('click', () => {
      onSelectIncident?.(primaryIncident);
    });
    spillPolygon.on('click', () => {
      onSelectIncident?.(primaryIncident);
    });

    // 2. VESSEL TRAJECTORY LINES (MV Ocean Star passing through spill zone)
    const probableSourceVessel = mockVessels.find((v) => v.isProbableSource);
    if (probableSourceVessel?.trajectory) {
      // Historical trajectory (Amber dashed)
      const trajectoryLine = L.polyline(probableSourceVessel.trajectory, {
        color: '#f59e0b',
        weight: 2.5,
        dashArray: '6, 6',
        opacity: 0.85,
      }).addTo(map);

      trajectoryLine.bindTooltip('AIS TRACK: MV OCEAN STAR (DRIFT INTERSECT)', {
        direction: 'center',
        className: 'maritime-leaflet-tooltip',
      });
    }

    // 3. VESSEL MARKERS
    mockVessels.forEach((vessel) => {
      let iconColor = '#0ea5e9'; // Commercial
      let ringColor = 'border-cyan-400';

      if (vessel.isProbableSource) {
        iconColor = '#f59e0b'; // Amber warning
        ringColor = 'border-amber-400 animate-pulse';
      } else if (vessel.type === 'Coast Guard Patrol') {
        iconColor = '#10b981'; // Coast Guard emerald
        ringColor = 'border-emerald-400';
      }

      const vesselIconHtml = `
        <div class="relative flex items-center justify-center group" style="transform: rotate(${vessel.heading}deg);">
          ${vessel.isProbableSource ? '<span class="animate-ping absolute h-7 w-7 rounded-full bg-amber-500 opacity-50"></span>' : ''}
          <div class="h-6 w-6 rounded bg-[#070e1b] border ${ringColor} flex items-center justify-center shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="${iconColor}" stroke="none">
              <polygon points="12,2 22,22 12,17 2,22" />
            </svg>
          </div>
        </div>
      `;

      const vesselDivIcon = L.divIcon({
        html: vesselIconHtml,
        className: 'custom-div-icon',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker(vessel.position, { icon: vesselDivIcon }).addTo(map);

      const vesselPopupContent = `
        <div style="min-width: 220px; font-family: monospace; color: #f1f5f9; background: #070e1b; border: 1px solid ${iconColor}; padding: 12px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-weight: bold; color: ${iconColor}; font-size: 13px;">${vessel.name}</span>
            <span style="font-size: 10px; color: #94a3b8;">${vessel.flag}</span>
          </div>
          <div style="font-size: 11px; line-height: 1.6; color: #cbd5e1;">
            <div><strong>IMO Number:</strong> ${vessel.imo}</div>
            <div><strong>Vessel Type:</strong> ${vessel.type}</div>
            <div><strong>Speed:</strong> ${vessel.speedKnots} kn</div>
            <div><strong>Heading:</strong> ${vessel.heading}°</div>
            <div><strong>Status:</strong> <span style="color: #38bdf8;">${vessel.status}</span></div>
            <div><strong>Destination:</strong> ${vessel.destination}</div>
            ${vessel.isProbableSource ? '<div style="color: #f59e0b; font-weight: bold; margin-top: 4px;">⚠ PROBABLE DISCHARGE SOURCE (92%)</div>' : ''}
          </div>
        </div>
      `;

      marker.bindPopup(vesselPopupContent);

      marker.on('click', () => {
        onSelectVessel?.(vessel);
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [highlightedIncidentId, onSelectIncident, onSelectVessel]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([18.925, 71.650], 10, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[540px] bg-[#070e1b] border border-slate-800 rounded overflow-hidden shadow-inner flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        <div className="px-3 py-1.5 rounded bg-[#070e1b]/90 border border-slate-700/80 text-xs font-mono text-slate-200 backdrop-blur-md flex items-center gap-2 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-cyan-400">LIVE FEED</span>
          <span className="text-slate-500">|</span>
          <span>ARABIAN SEA / SECTOR BRAVO</span>
        </div>

        <button
          onClick={handleRecenter}
          className="p-1.5 rounded bg-[#070e1b]/90 border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors backdrop-blur-md shadow-lg"
          title="Recenter Map on Incident"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Actual Map DOM element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Tactical Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#070e1b]/90 border border-slate-800 p-2.5 rounded text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-xl flex flex-col gap-1.5">
        <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>Surveillance Legend</span>
          <Layers className="w-3 h-3 text-cyan-400 ml-3" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>Active Spill Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded bg-amber-500" />
            <span>Probable Source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded bg-sky-500" />
            <span>Commercial AIS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded bg-emerald-500" />
            <span>Coast Guard Patrol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-amber-400" />
            <span>AIS Trajectory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-cyan-400" />
            <span>Investigation Zone</span>
          </div>
        </div>
      </div>

      {/* Coordinate Telemetry Badge */}
      <div className="absolute bottom-3 right-3 z-[400] bg-[#070e1b]/90 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 backdrop-blur-md hidden sm:block">
        RADAR GRID: <span className="text-cyan-400">18°55'30"N 71°39'00"E</span> &bull; 10 NM SCAN RADIUS
      </div>
    </div>
  );
};

export default SurveillanceMap;
