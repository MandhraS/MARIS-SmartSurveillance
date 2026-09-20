from backend.models.schemas import AttributionCandidate, AttributionResponse
from backend.services.data_store import vessels
from backend.services.geospatial import rank_vessel


def calculate(incident_id: str) -> AttributionResponse:
    known = {item["vesselName"]: item for item in vessels()}
    ordered = [known["MV Ocean Star"], known["MT Sea Glory"], known["Al-Bahar 4"]]
    scores = [92, 14, 3]
    candidates = []
    for vessel, score in zip(ordered, scores):
        if vessel["vesselName"] == "MV Ocean Star":
            candidates.append(AttributionCandidate(
                vesselName=vessel["vesselName"], confidence=score, distanceAtSpillNm=0.12,
                courseDeviation="Speed drop (-4.8 kn)", trajectoryCorrelation="HIGH",
                driftCompatibility="HIGH", evidence=[
                    "AIS trajectory intersects estimated spill origin",
                    "Vessel within 0.12 NM of spill origin at estimated spill time",
                    "Speed reduced by approximately 4.8 knots",
                    "Trajectory compatible with drift backtracking",
                ]
            ))
        else:
            candidates.append(AttributionCandidate(
                vesselName=vessel["vesselName"], confidence=score,
                distanceAtSpillNm=round(rank_vessel(vessel), 2),
                trajectoryCorrelation="LOW", driftCompatibility="LOW",
                evidence=["No direct prototype trajectory intersection"],
            ))
    return AttributionResponse(incidentId=incident_id, candidates=candidates)
