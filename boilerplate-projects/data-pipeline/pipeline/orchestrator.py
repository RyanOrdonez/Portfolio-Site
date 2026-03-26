"""
WeatherETL - Pipeline Orchestrator

Schedules and runs the extract -> transform -> load pipeline.
"""

import logging
import time
from datetime import datetime

import schedule

from pipeline.extract import extract_all
from pipeline.transform import transform_all
from pipeline.load import load_dataframe, initialize_database

logger = logging.getLogger(__name__)


def run_pipeline() -> None:
    """
    Execute the full ETL pipeline: extract -> transform -> load.

    This is the main entry point for each scheduled pipeline run.
    """
    start_time = datetime.utcnow()
    logger.info("Pipeline run started at %s", start_time.isoformat())

    try:
        # Step 1: Extract
        logger.info("Step 1/3: Extracting weather data...")
        raw_data = extract_all()
        if not raw_data:
            logger.warning("No data extracted. Skipping transform and load.")
            return

        # Step 2: Transform
        logger.info("Step 2/3: Transforming data...")
        df = transform_all(raw_data)
        if df.empty:
            logger.warning("No valid data after transformation. Skipping load.")
            return

        # Step 3: Load
        logger.info("Step 3/3: Loading data to database...")
        records_inserted = load_dataframe(df)

        elapsed = (datetime.utcnow() - start_time).total_seconds()
        logger.info(
            "Pipeline run completed: %d records inserted in %.2f seconds",
            records_inserted,
            elapsed,
        )

    except Exception as e:
        logger.error("Pipeline run failed: %s", e, exc_info=True)
        # TODO: Add alerting (email, Slack webhook) on pipeline failures


def start_scheduler(interval_minutes: int = 30) -> None:
    """
    Start the scheduled pipeline execution.

    Args:
        interval_minutes: How often to run the pipeline in minutes.

    TODO: Replace with a more robust scheduler:
        - APScheduler for cron-like scheduling
        - Celery for distributed task execution
        - Airflow for complex DAG-based pipelines
    """
    logger.info("Starting scheduler: pipeline will run every %d minutes", interval_minutes)

    # Run immediately on startup
    run_pipeline()

    # Schedule recurring runs
    schedule.every(interval_minutes).minutes.do(run_pipeline)

    try:
        while True:
            schedule.run_pending()
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Scheduler stopped by user")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    import sys

    if "--once" in sys.argv:
        # Single run mode for testing
        initialize_database()
        run_pipeline()
    else:
        # Scheduled mode
        initialize_database()
        start_scheduler()
