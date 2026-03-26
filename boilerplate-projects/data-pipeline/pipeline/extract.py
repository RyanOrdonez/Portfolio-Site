"""
WeatherETL - Data Extraction

Fetches weather data from the OpenWeatherMap API.
"""

import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# OpenWeatherMap API configuration
BASE_URL = "https://api.openweathermap.org/data/2.5"
API_KEY = os.getenv("API_KEY", "")

# Default cities to track
DEFAULT_CITIES = ["London", "New York", "Tokyo", "Sydney", "Berlin"]


def fetch_current_weather(city: str) -> Optional[Dict[str, Any]]:
    """
    Fetch current weather data for a given city.

    Args:
        city: City name (e.g., "London" or "London,UK").

    Returns:
        Raw API response as a dictionary, or None on failure.

    TODO: Implement proper error handling:
        - Retry logic with exponential backoff
        - Rate limiting awareness
        - API key validation on startup
    """
    if not API_KEY:
        logger.error("API_KEY not set. Please configure your .env file.")
        return None

    try:
        url = f"{BASE_URL}/weather"
        params = {
            "q": city,
            "appid": API_KEY,
            "units": "metric",
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        data["_extracted_at"] = datetime.utcnow().isoformat()
        logger.info("Successfully fetched weather for %s", city)
        return data

    except requests.RequestException as e:
        logger.error("Failed to fetch weather for %s: %s", city, e)
        return None


def fetch_forecast(city: str) -> Optional[Dict[str, Any]]:
    """
    Fetch 5-day weather forecast for a given city.

    Args:
        city: City name.

    Returns:
        Raw API response as a dictionary, or None on failure.

    TODO: Implement forecast extraction similar to current weather.
    """
    # TODO: Implement forecast API call
    # url = f"{BASE_URL}/forecast"
    # params = {"q": city, "appid": API_KEY, "units": "metric"}
    logger.warning("Forecast extraction not yet implemented for %s", city)
    return None


def extract_all(cities: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Extract current weather data for all configured cities.

    Args:
        cities: List of city names. Uses DEFAULT_CITIES if not provided.

    Returns:
        List of raw weather data dictionaries.
    """
    cities = cities or DEFAULT_CITIES
    results = []

    for city in cities:
        data = fetch_current_weather(city)
        if data is not None:
            results.append(data)

    logger.info("Extracted weather data for %d/%d cities", len(results), len(cities))
    return results


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    data = extract_all()
    print(f"Extracted {len(data)} records")
