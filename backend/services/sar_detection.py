from __future__ import annotations

from pathlib import Path
from typing import Any

from backend.models.schemas import DetectionResponse, RasterMetadata

PIPELINE = [
    "Sentinel-1 SAR ingestion",
    "Raster preprocessing",
    "Water masking",
    "Dark anomaly detection",
    "Oil-spill classification",
    "Spill boundary extraction",
    "Risk assessment",
]


class SpillDetectionModel:
    """PyTorch-compatible seam for a future trained model.

    The current implementation is deterministic and does not load weights or
    require torch/GPU availability.
    """

    def predict(self, _raster: Any = None) -> dict[str, Any]:
        return {
            "classification": "OIL SPILL",
            "confidence": 94,
            "spillAreaKm2": 12.6,
            "risk": "HIGH",
            "centroid": {"latitude": 18.925, "longitude": 71.650},
        }


def inspect_raster(content: bytes | None, filename: str | None) -> RasterMetadata:
    safe_name = filename or "demo-sar-scene"
    if not content:
        return RasterMetadata(filename=safe_name, fallback=True, note="Using MARIS demonstration scene.")

    try:
        import rasterio
        from rasterio.io import MemoryFile

        with MemoryFile(content) as memory_file:
            with memory_file.open() as dataset:
                bounds = dataset.bounds
                return RasterMetadata(
                    filename=safe_name,
                    width=dataset.width,
                    height=dataset.height,
                    crs=str(dataset.crs) if dataset.crs else None,
                    bounds={"left": bounds.left, "bottom": bounds.bottom, "right": bounds.right, "top": bounds.top},
                    fallback=False,
                    note="Raster metadata inspected by Rasterio.",
                )
    except Exception as error:
        return RasterMetadata(
            filename=safe_name,
            fallback=True,
            note=f"Using MARIS demonstration scene; raster inspection unavailable ({type(error).__name__}).",
        )


def analyze(content: bytes | None = None, filename: str | None = None) -> DetectionResponse:
    result = SpillDetectionModel().predict()
    return DetectionResponse(metadata=inspect_raster(content, filename), pipeline=PIPELINE, **result)
