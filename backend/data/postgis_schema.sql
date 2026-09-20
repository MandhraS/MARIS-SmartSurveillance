-- Conceptual PostGIS schema for a future persistent deployment.
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE incidents (
    incident_id TEXT PRIMARY KEY,
    classification TEXT NOT NULL,
    risk TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    detected_at TIMESTAMPTZ,
    location geometry(Point, 4326) NOT NULL
);

CREATE TABLE spill_detections (
    detection_id BIGSERIAL PRIMARY KEY,
    incident_id TEXT REFERENCES incidents(incident_id),
    classification TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    spill_area_km2 DOUBLE PRECISION NOT NULL,
    boundary geometry(Polygon, 4326),
    centroid geometry(Point, 4326) NOT NULL
);

CREATE TABLE vessels (
    vessel_id TEXT PRIMARY KEY,
    vessel_name TEXT NOT NULL,
    vessel_type TEXT NOT NULL
);

CREATE TABLE ais_positions (
    position_id BIGSERIAL PRIMARY KEY,
    vessel_id TEXT REFERENCES vessels(vessel_id),
    observed_at TIMESTAMPTZ NOT NULL,
    speed_knots DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    location geometry(Point, 4326) NOT NULL
);

CREATE TABLE source_candidates (
    candidate_id BIGSERIAL PRIMARY KEY,
    incident_id TEXT REFERENCES incidents(incident_id),
    vessel_id TEXT REFERENCES vessels(vessel_id),
    confidence INTEGER NOT NULL,
    evidence JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX incidents_location_gix ON incidents USING GIST (location);
CREATE INDEX spill_detections_boundary_gix ON spill_detections USING GIST (boundary);
CREATE INDEX ais_positions_location_gix ON ais_positions USING GIST (location);
