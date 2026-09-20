import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


def _load_json(filename: str) -> list[dict[str, Any]]:
    with (DATA_DIR / filename).open(encoding="utf-8") as handle:
        return json.load(handle)


def incidents() -> list[dict[str, Any]]:
    return _load_json("incidents.json")


def vessels() -> list[dict[str, Any]]:
    return _load_json("vessels.json")


def incident_by_id(incident_id: str) -> dict[str, Any] | None:
    return next((item for item in incidents() if item["incidentId"] == incident_id), None)


def vessel_by_id(vessel_id: str) -> dict[str, Any] | None:
    normalized = vessel_id.replace("-", "").lower()
    return next((item for item in vessels() if item["vesselId"].replace("-", "").lower() == normalized), None)
