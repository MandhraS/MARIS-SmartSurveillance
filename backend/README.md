# MARIS Backend

The backend is a lightweight FastAPI service for the SIH prototype. It runs from local JSON data and does not require a database, API key, cloud deployment, authentication, or live AIS/Sentinel services.

## Run

From the repository root:

```powershell
py -m pip install -r backend/requirements.txt
py -m uvicorn backend.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/api/health`

## Current Prototype

- **FastAPI:** Exposes health, incident, vessel, detection, attribution, backtrack, and report endpoints to the React dashboard.
- **Sentinel-1 SAR:** `POST /api/detection/analyze` accepts an optional upload. Rasterio inspects supported raster metadata; unsupported files fall back to the deterministic demonstration scene.
- **SAR detection:** `services/sar_detection.py` models ingestion, preprocessing, water masking, anomaly detection, classification, boundary extraction, and risk assessment. It returns fixed demonstration values and does not claim trained AI inference.
- **PyTorch:** `SpillDetectionModel` is a compatible interface where a trained model can later replace `predict`. No weights are downloaded and torch is not imported at startup.
- **GeoPandas/Shapely:** `services/geospatial.py` provides the centroid, demonstration polygon, distance, region, and ranking functions. Imports are optional; the Haversine fallback keeps the API runnable without GIS packages.
- **AIS correlation:** Local `vessels.json` provides clearly labeled demonstration vessel positions and telemetry.
- **Drift backtracking:** `services/drift_model.py` returns deterministic wind, current, release-time, and confidence values while reserving a boundary for a real ocean model.
- **PostGIS:** `data/postgis_schema.sql` documents future spatial tables and indexes. The current service uses local JSON through `services/data_store.py`.

## Future Production Implementation

A production deployment would replace local JSON with PostGIS repositories, validate and archive Sentinel-1 products, add a tested model-serving path, ingest an authorized AIS source, and use observed wind/current fields. Attribution scores in this prototype are evidence-oriented demonstration values, not legally conclusive findings.
