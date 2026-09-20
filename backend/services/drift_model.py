from backend.models.schemas import BacktrackResponse


def backtrack(incident_id: str) -> BacktrackResponse:
    return BacktrackResponse(
        incidentId=incident_id,
        surfaceWind="14 kn (210° SW)",
        tidalCurrent="1.2 kn (SSW)",
        estimatedSpillTime="20:55 - 21:05 IST",
        certainty="HIGH",
        probability=0.92,
        process=[
            "Observed spill location",
            "Wind + tidal current",
            "Backward particle propagation",
            "Estimated release region",
            "AIS trajectory intersection",
        ],
    )
