"""
WeatherETL - Data Transformation

Cleans, validates, and enriches raw weather data.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

import pandas as pd

logger = logging.getLogger(__name__)


def validate_record(record: Dict[str, Any]) -> bool:
    """
    Validate that a raw weather record has the required fields.

    Args:
        record: Raw API response dictionary.

    Returns:
        True if the record is valid, False otherwise.

    TODO: Add more thorough validation:
        - Check value ranges (temperature, humidity, pressure)
        - Validate coordinate bounds
        - Check for stale timestamps
    """
    required_fields = ["main", "weather", "name"]
    return all(field in record for field in required_fields)


def transform_record(record: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Transform a single raw weather record into a clean, flat structure.

    Args:
        record: Raw API response dictionary.

    Returns:
        Cleaned and flattened dictionary, or None if validation fails.

    TODO: Add derived metrics:
        - Heat index calculation
        - Wind chill factor
        - Comfort index
        - Dew point
    """
    if not validate_record(record):
        logger.warning("Invalid record skipped: %s", record.get("name", "unknown"))
        return None

    main = record.get("main", {})
    weather = record.get("weather", [{}])[0]
    wind = record.get("wind", {})

    transformed = {
        "city": record.get("name", ""),
        "country": record.get("sys", {}).get("country", ""),
        "latitude": record.get("coord", {}).get("lat"),
        "longitude": record.get("coord", {}).get("lon"),
        "temperature_c": main.get("temp"),
        "feels_like_c": main.get("feels_like"),
        "temp_min_c": main.get("temp_min"),
        "temp_max_c": main.get("temp_max"),
        "humidity_pct": main.get("humidity"),
        "pressure_hpa": main.get("pressure"),
        "weather_condition": weather.get("main", ""),
        "weather_description": weather.get("description", ""),
        "wind_speed_ms": wind.get("speed"),
        "wind_direction_deg": wind.get("deg"),
        "visibility_m": record.get("visibility"),
        "cloudiness_pct": record.get("clouds", {}).get("all"),
        "extracted_at": record.get("_extracted_at", datetime.utcnow().isoformat()),
        "transformed_at": datetime.utcnow().isoformat(),
    }

    return transformed


def transform_all(raw_records: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Transform a list of raw weather records into a clean DataFrame.

    Args:
        raw_records: List of raw API response dictionaries.

    Returns:
        pandas DataFrame with cleaned and structured weather data.
    """
    transformed = []
    for record in raw_records:
        result = transform_record(record)
        if result is not None:
            transformed.append(result)

    df = pd.DataFrame(transformed)

    if not df.empty:
        # TODO: Add temperature unit conversion columns (Fahrenheit)
        # df["temperature_f"] = df["temperature_c"] * 9/5 + 32

        # TODO: Add data quality flags
        # TODO: Handle missing values with appropriate defaults or interpolation

        logger.info("Transformed %d records into DataFrame", len(df))
    else:
        logger.warning("No valid records after transformation")

    return df


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    # Test with sample data
    sample = [
        {
            "name": "TestCity",
            "main": {"temp": 20.0, "feels_like": 19.0, "humidity": 65, "pressure": 1013},
            "weather": [{"main": "Clear", "description": "clear sky"}],
            "wind": {"speed": 3.5, "deg": 180},
            "coord": {"lat": 51.5, "lon": -0.1},
            "sys": {"country": "GB"},
            "visibility": 10000,
            "clouds": {"all": 5},
        }
    ]
    df = transform_all(sample)
    print(df.to_string())
