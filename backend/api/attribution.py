from fastapi import APIRouter

from backend.api.incidents import incident_attribution

router = APIRouter(prefix="/api", tags=["attribution"])

# Attribution is exposed by the incident router; this module is retained as
# the integration boundary for a future standalone attribution workflow.
__all__ = ["router", "incident_attribution"]
