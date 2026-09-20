from fastapi import APIRouter, File, UploadFile

from backend.models.schemas import DetectionResponse
from backend.services.sar_detection import analyze

router = APIRouter(prefix="/api/detection", tags=["detection"])


@router.post("/analyze", response_model=DetectionResponse)
async def analyze_detection(file: UploadFile | None = File(default=None)) -> DetectionResponse:
    content = await file.read() if file else None
    return analyze(content=content, filename=file.filename if file else None)
