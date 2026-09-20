export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 
  | 'UNDER INVESTIGATION' 
  | 'VERIFYING' 
  | 'DISPATCHED' 
  | 'CONTAINED' 
  | 'RESOLVED';

export interface Incident {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  detectedAt: string;
  spillAreaKm2: number;
  risk: RiskLevel;
  confidence: number; // percentage, e.g. 94
  probableSource: string;
  sourceConfidence: number; // percentage, e.g. 92
  status: IncidentStatus;
  sensorSource: string;
  estimatedVolume?: string;
  windSpeedKnots?: number;
  currentDirection?: string;
}

export type VesselType = 'Tanker' | 'Cargo' | 'Fishing' | 'Coast Guard Patrol' | 'Bulk Carrier';

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  type: VesselType;
  position: [number, number]; // [lat, lng]
  speedKnots: number;
  heading: number; // degrees 0-360
  status: string;
  flag: string;
  destination: string;
  isProbableSource?: boolean;
  trajectory?: [number, number][];
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export interface MaritimeAlert {
  id: string;
  title: string;
  timestamp: string;
  severity: AlertSeverity;
  description: string;
  incidentId?: string;
  vesselName?: string;
}

export type Alert = MaritimeAlert;

export interface AISPosition {
  vesselId: string;
  coordinates: [number, number];
  timestamp: string;
  speedKnots: number;
  heading: number;
}

export interface SourceCandidate {
  vesselName: string;
  confidence: number;
  evidence: string[];
}

export interface SatelliteObservation {
  sensor: string;
  mode: string;
  polarization: string;
  description: string;
  location: string;
  isDemonstration: boolean;
}

export interface SpillDetection {
  incidentId: string;
  areaKm2: number;
  confidence: number;
  risk: RiskLevel;
  classification: string;
}

export interface KPIData {
  activeSpills: {
    value: number;
    sublabel: string;
  };
  highRiskIncidents: {
    value: number;
    sublabel: string;
  };
  vesselsMonitored: {
    value: string;
    sublabel: string;
  };
  alertsToday: {
    value: number;
    sublabel: string;
  };
}

export type NavigationTab = 
  | 'command-center'
  | 'spill-detection'
  | 'maritime-map'
  | 'vessel-tracking'
  | 'source-analysis'
  | 'alerts'
  | 'incident-reports'
  | 'analytics'
  | 'system-status'
  | 'settings';
