from fastapi import APIRouter

from backend.api.incidents import incident_backtrack

router = APIRouter(prefix="/api", tags=["backtrack"])

# Backtracking is exposed by the incident router; this module reserves the
# boundary for a future model-backed drift endpoint.
__all__ = ["router", "incident_backtrack"]
