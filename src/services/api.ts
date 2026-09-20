import type { Incident, Vessel, RiskLevel } from '../types/maritime';

const API_BASE = 'http://localhost:8000/api';

interface ApiIncident {
  incidentId: string;
  classification: string;
  risk: Incident['risk'];
  confidence: number;
  spillAreaKm2: number;
  latitude: number;
  longitude: number;
  detectedAt: string;
  sourceRegion: string;
  primarySuspect: string;
  attributionConfidence: number;
  status: Incident['status'];
}

export interface HealthResponse {
  status: string;
  system: string;
  version: string;
}

interface ApiVessel {
  vesselId: string;
  vesselName: string;
  vesselType: Vessel['type'];
  latitude: number;
  longitude: number;
  speedKnots: number;
  heading: number;
  status: string;
}

export interface AttributionCandidate {
  vesselName: string;
  confidence: number;
  distanceAtSpillNm?: number;
  courseDeviation?: string;
  trajectoryCorrelation: string;
  driftCompatibility: string;
  evidence: string[];
}

export interface AttributionResponse {
  incidentId: string;
  label: string;
  candidates: AttributionCandidate[];
}

export interface BacktrackResponse {
  incidentId: string;
  surfaceWind: string;
  tidalCurrent: string;
  estimatedSpillTime: string;
  certainty: string;
  probability: number;
  process: string[];
}

export interface DetectionResponse {
  label: string;
  classification: string;
  confidence: number;
  spillAreaKm2: number;
  risk: RiskLevel;
  centroid: { latitude: number; longitude: number };
  pipeline: string[];
  metadata: {
    filename: string;
    width?: number;
    height?: number;
    crs?: string;
    bounds?: Record<string, number>;
    fallback: boolean;
    note: string;
  };
}

export interface IncidentReportResponse {
  incidentId: string;
  detection: {
    classification: string;
    confidence: number;
    spillAreaKm2: number;
    risk: RiskLevel;
  };
  location: { sourceRegion: string; latitude: number; longitude: number };
  primarySuspect: string;
  attributionConfidence: number;
  backtrack: BacktrackResponse;
  recommendedResponse: string[];
}

const request = async <T>(path: string, init?: RequestInit): Promise<T | null> => {
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...init, signal: AbortSignal.timeout(1200) });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return data as T;
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

export const getHealth = async (): Promise<HealthResponse | null> => {
  const data = await request<unknown>('/health');
  if (!isRecord(data) || typeof data.status !== 'string' || typeof data.system !== 'string' || typeof data.version !== 'string') return null;
  return data as unknown as HealthResponse;
};

export const getIncidents = async (): Promise<Incident[] | null> => {
  const data = await request<unknown>('/incidents');
  if (!Array.isArray(data)) return null;
  const incidents = await Promise.all(data.map((item) => mapIncident(item)));
  return incidents.every((incident): incident is Incident => incident !== null) ? incidents : null;
};

const mapIncident = async (data: unknown): Promise<Incident | null> => {
  if (!isRecord(data) || typeof data.incidentId !== 'string' || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') return null;
  if (typeof data.risk !== 'string' || typeof data.confidence !== 'number' || typeof data.spillAreaKm2 !== 'number' || typeof data.detectedAt !== 'string' || typeof data.primarySuspect !== 'string' || typeof data.attributionConfidence !== 'number' || typeof data.status !== 'string') return null;
  return {
    id: data.incidentId,
    title: data.classification === 'OIL SPILL' ? 'Oil Spill Detected' : String(data.classification ?? 'Maritime Incident'),
    location: `${String(data.sourceRegion ?? 'Arabian Sea')} (Prototype API)`,
    coordinates: [data.latitude, data.longitude],
    detectedAt: data.detectedAt,
    spillAreaKm2: data.spillAreaKm2,
    risk: data.risk as Incident['risk'],
    confidence: data.confidence,
    probableSource: data.primarySuspect,
    sourceConfidence: data.attributionConfidence,
    status: data.status as Incident['status'],
    sensorSource: 'Sentinel-1A SAR (prototype API)',
    windSpeedKnots: 14,
    currentDirection: 'SSW at 1.2 knots',
  };
};

export const getIncident = async (incidentId: string): Promise<Incident | null> => {
  const data = await request<ApiIncident>(`/incidents/${incidentId}`);
  return mapIncident(data);
};

export const getVessels = async (): Promise<Vessel[] | null> => {
  const data = await request<unknown>('/vessels');
  if (!Array.isArray(data)) return null;
  if (!data.every((item) => isRecord(item) && typeof item.vesselId === 'string' && typeof item.vesselName === 'string' && typeof item.latitude === 'number' && typeof item.longitude === 'number')) return null;
  return data.map((vessel) => ({
    id: String(vessel.vesselId),
    name: String(vessel.vesselName),
    imo: String(vessel.vesselId),
    type: String(vessel.vesselType) as Vessel['type'],
    position: [Number(vessel.latitude), Number(vessel.longitude)] as [number, number],
    speedKnots: Number(vessel.speedKnots),
    heading: Number(vessel.heading),
    status: String(vessel.status),
    flag: 'DEMO',
    destination: 'Prototype route',
    isProbableSource: vessel.vesselName === 'MV Ocean Star',
  }));
};

export const getVessel = async (vesselId: string): Promise<Vessel | null> => {
  const data = await request<ApiVessel>(`/vessels/${vesselId}`);
  if (!data || typeof data.vesselId !== 'string' || typeof data.vesselName !== 'string') return null;
  const vessels = await getVessels();
  return vessels?.find((vessel) => vessel.id.toLowerCase() === data.vesselId.toLowerCase()) ?? null;
};

export const getAttribution = async (incidentId: string): Promise<AttributionResponse | null> => {
  const data = await request<unknown>(`/incidents/${incidentId}/attribution`);
  if (!isRecord(data) || !Array.isArray(data.candidates) || typeof data.label !== 'string') return null;
  if (!data.candidates.every((candidate) => isRecord(candidate) && typeof candidate.vesselName === 'string' && typeof candidate.confidence === 'number')) return null;
  return data as unknown as AttributionResponse;
};

export const getBacktrack = async (incidentId: string): Promise<BacktrackResponse | null> => {
  const data = await request<unknown>(`/incidents/${incidentId}/backtrack`);
  if (!isRecord(data) || typeof data.surfaceWind !== 'string' || typeof data.tidalCurrent !== 'string' || typeof data.estimatedSpillTime !== 'string' || typeof data.certainty !== 'string' || typeof data.probability !== 'number') return null;
  return data as unknown as BacktrackResponse;
};

export const analyzeSAR = async (file?: File | null): Promise<DetectionResponse | null> => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  const data = await request<unknown>('/detection/analyze', { method: 'POST', body: formData });
  if (!isRecord(data) || typeof data.classification !== 'string' || typeof data.confidence !== 'number' || typeof data.spillAreaKm2 !== 'number' || !isRecord(data.centroid) || typeof data.centroid.latitude !== 'number' || typeof data.centroid.longitude !== 'number' || !isRecord(data.metadata)) return null;
  return data as unknown as DetectionResponse;
};

export const generateIncidentReport = async (incidentId: string): Promise<IncidentReportResponse | null> => {
  const data = await request<unknown>(`/incidents/${incidentId}/report`, { method: 'POST' });
  if (!isRecord(data) || typeof data.incidentId !== 'string' || typeof data.primarySuspect !== 'string' || typeof data.attributionConfidence !== 'number' || !isRecord(data.detection) || !isRecord(data.location) || !isRecord(data.backtrack)) return null;
  return data as unknown as IncidentReportResponse;
};

// Backwards-compatible names used by the existing views.
export const fetchIncident = getIncident;
export const fetchVessels = getVessels;
