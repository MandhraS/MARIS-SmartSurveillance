from __future__ import annotations

from math import asin, cos, radians, sin, sqrt
from typing import Any

CENTROID = (18.925, 71.650)


def distance_nm(first: tuple[float, float], second: tuple[float, float]) -> float:
    """Great-circle distance in nautical miles, with no GIS dependency."""
    lat1, lon1, lat2, lon2 = map(radians, (*first, *second))
    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1
    value = sin(delta_lat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(delta_lon / 2) ** 2
    return 3440.065 * 2 * asin(sqrt(value))


def spill_polygon() -> list[list[float]]:
    return [
        [18.960, 71.630], [18.970, 71.665], [18.945, 71.690],
        [18.910, 71.685], [18.895, 71.660], [18.900, 71.625],
        [18.930, 71.615], [18.960, 71.630],
    ]


def point_in_demo_region(latitude: float, longitude: float) -> bool:
    return 18.895 <= latitude <= 18.970 and 71.615 <= longitude <= 71.690


def rank_vessel(vessel: dict[str, Any]) -> float:
    return distance_nm(CENTROID, (vessel["latitude"], vessel["longitude"]))


def geospatial_capabilities() -> dict[str, bool]:
    try:
        import geopandas  # noqa: F401
        import shapely  # noqa: F401
        return {"geopandas": True, "shapely": True}
    except ImportError:
        return {"geopandas": False, "shapely": False}
