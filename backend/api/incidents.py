from fastapi import APIRouter, HTTPException

from backend.models.schemas import AttributionResponse, BacktrackResponse, IncidentReportResponse
from backend.services.attribution import calculate
from backend.services.data_store import incident_by_id, incidents
from backend.services.drift_model import backtrack

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


def require_incident(incident_id: str) -> dict:
    incident = incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} was not found")
    return incident


@router.get("")
def list_incidents() -> list[dict]:
    return incidents()


@router.get("/{incident_id}/attribution", response_model=AttributionResponse)
def incident_attribution(incident_id: str) -> AttributionResponse:
    require_incident(incident_id)
    return calculate(incident_id)


@router.get("/{incident_id}/backtrack", response_model=BacktrackResponse)
def incident_backtrack(incident_id: str) -> BacktrackResponse:
    require_incident(incident_id)
    return backtrack(incident_id)


@router.post("/{incident_id}/report", response_model=IncidentReportResponse)
def incident_report(incident_id: str) -> IncidentReportResponse:
    incident = require_incident(incident_id)
    drift = backtrack(incident_id)
    return IncidentReportResponse(
        incidentId=incident_id,
        detection={"classification": incident["classification"], "confidence": incident["confidence"], "spillAreaKm2": incident["spillAreaKm2"], "risk": incident["risk"]},
        location={"sourceRegion": incident["sourceRegion"], "latitude": incident["latitude"], "longitude": incident["longitude"]},
        primarySuspect=incident["primarySuspect"],
        attributionConfidence=incident["attributionConfidence"],
        backtrack=drift,
        recommendedResponse=["Notify maritime authority", "Investigate probable source vessel", "Continue satellite monitoring", "Initiate response assessment"],
    )


@router.get("/{incident_id}")
def get_incident(incident_id: str) -> dict:
    return require_incident(incident_id)
