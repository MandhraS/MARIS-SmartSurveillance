from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.detection import router as detection_router
from backend.api.incidents import router as incidents_router
from backend.api.vessels import router as vessels_router

app = FastAPI(
    title="MARIS Prototype API",
    version="prototype",
    description="Local FastAPI integration points for the MARIS maritime surveillance demonstration.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection_router)
app.include_router(incidents_router)
app.include_router(vessels_router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "operational", "system": "MARIS", "version": "prototype"}


@app.exception_handler(Exception)
async def unhandled_exception(_request: Request, _exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content={"detail": "MARIS prototype backend error"})
