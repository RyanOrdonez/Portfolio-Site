"""
WeatherETL - Data Loading

Handles loading transformed weather data into the database.
"""

import os
import logging
from typing import Optional

import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

DB_URL = os.getenv("DB_URL", "sqlite:///weather.db")


def get_engine(db_url: Optional[str] = None):
    """
    Create a SQLAlchemy engine for database connections.

    Args:
        db_url: Database connection string. Defaults to DB_URL from env.

    Returns:
        SQLAlchemy engine instance.
    """
    url = db_url or DB_URL
    return create_engine(url, echo=False)


def initialize_database(engine=None) -> None:
    """
    Create the weather_observations table if it does not exist.

    TODO: Migrate to SQLAlchemy ORM models for better schema management.
    TODO: Add indexes on city and extracted_at columns for query performance.
    """
    engine = engine or get_engine()

    create_table_sql = text("""
        CREATE TABLE IF NOT EXISTS weather_observations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            city TEXT NOT NULL,
            country TEXT,
            latitude REAL,
            longitude REAL,
            temperature_c REAL,
            feels_like_c REAL,
            temp_min_c REAL,
            temp_max_c REAL,
            humidity_pct REAL,
            pressure_hpa REAL,
            weather_condition TEXT,
            weather_description TEXT,
            wind_speed_ms REAL,
            wind_direction_deg REAL,
            visibility_m REAL,
            cloudiness_pct REAL,
            extracted_at TEXT,
            transformed_at TEXT
        )
    """)

    with engine.begin() as conn:
        conn.execute(create_table_sql)
    logger.info("Database initialized successfully")


def load_dataframe(df: pd.DataFrame, engine=None) -> int:
    """
    Load a transformed DataFrame into the weather_observations table.

    Args:
        df: Cleaned weather data DataFrame from the transform step.
        engine: SQLAlchemy engine. Uses default if not provided.

    Returns:
        Number of records inserted.

    TODO: Implement upsert logic to handle duplicate records.
    TODO: Add batch insert for better performance with large datasets.
    """
    if df.empty:
        logger.warning("Empty DataFrame, nothing to load")
        return 0

    engine = engine or get_engine()
    initialize_database(engine)

    records_before = _count_records(engine)
    df.to_sql("weather_observations", engine, if_exists="append", index=False)
    records_after = _count_records(engine)

    inserted = records_after - records_before
    logger.info("Loaded %d new records into database", inserted)
    return inserted


def _count_records(engine) -> int:
    """Return the total number of records in weather_observations."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM weather_observations"))
        return result.scalar()


def query_recent(city: Optional[str] = None, limit: int = 100, engine=None) -> pd.DataFrame:
    """
    Query recent weather observations from the database.

    Args:
        city: Filter by city name. Returns all cities if None.
        limit: Maximum number of records to return.
        engine: SQLAlchemy engine.

    Returns:
        DataFrame of recent weather observations.
    """
    engine = engine or get_engine()

    query = "SELECT * FROM weather_observations"
    if city:
        query += f" WHERE city = '{city}'"
    query += f" ORDER BY extracted_at DESC LIMIT {limit}"

    return pd.read_sql(query, engine)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    initialize_database()
    print("Database initialized")
