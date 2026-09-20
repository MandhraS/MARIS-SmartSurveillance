from typing import Any, Optional

from pydantic import BaseModel, Field


class IncidentResponse(BaseModel):
    incidentId: str
    classification: str
    risk: str
    confidence: int
    spillAreaKm2: float
    latitude: float
    longitude: float
    detectedAt: str
    sourceRegion: str
    candidateCount: int
    waterCoverage: float
    primarySuspect: str
    attributionConfidence: int
    status: str


class VesselResponse(BaseModel):
    vesselId: str
    vesselName: str
    vesselType: str
    latitude: float
    longitude: float
    speedKnots: float
    heading: int
    timestamp: str
    status: str
    demonstrationData: bool = True


class AttributionCandidate(BaseModel):
    vesselName: str
    confidence: int
    distanceAtSpillNm: Optional[float] = None
    courseDeviation: Optional[str] = None
    trajectoryCorrelation: str
    driftCompatibility: str
    evidence: list[str] = Field(default_factory=list)


class AttributionResponse(BaseModel):
    incidentId: str
    label: str = "Prototype attribution score"
    candidates: list[AttributionCandidate]


class BacktrackResponse(BaseModel):
    incidentId: str
    surfaceWind: str
    tidalCurrent: str
    estimatedSpillTime: str
    certainty: str
    probability: float
    process: list[str]


class RasterMetadata(BaseModel):
    filename: str
    width: Optional[int] = None
    height: Optional[int] = None
    crs: Optional[str] = None
    bounds: Optional[dict[str, float]] = None
    fallback: bool = True
    note: str


class DetectionResponse(BaseModel):
    label: str = "MARIS Prototype Detection"
    classification: str
    confidence: int
    spillAreaKm2: float
    risk: str
    centroid: dict[str, float]
    pipeline: list[str]
    metadata: RasterMetadata


class IncidentReportResponse(BaseModel):
    incidentId: str
    detection: dict[str, Any]
    location: dict[str, Any]
    primarySuspect: str
    attributionConfidence: int
    backtrack: BacktrackResponse
    recommendedResponse: list[str]
