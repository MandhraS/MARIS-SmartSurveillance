from fastapi import APIRouter, HTTPException

from backend.models.schemas import VesselResponse
from backend.services.data_store import vessel_by_id, vessels

router = APIRouter(prefix="/api/vessels", tags=["vessels"])


@router.get("", response_model=list[VesselResponse])
def list_vessels() -> list[dict]:
    return [{**vessel, "demonstrationData": True} for vessel in vessels()]


@router.get("/{vessel_id}", response_model=VesselResponse)
def get_vessel(vessel_id: str) -> dict:
    vessel = vessel_by_id(vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail=f"Vessel {vessel_id} was not found")
    return {**vessel, "demonstrationData": True}
