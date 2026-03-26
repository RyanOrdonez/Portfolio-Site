# WeatherETL - Automated Weather Data Pipeline

**Status: In Development**

An automated ETL (Extract, Transform, Load) pipeline that collects weather data from the OpenWeatherMap API, transforms and cleans it, stores it in a database, and serves an interactive Streamlit dashboard for visualization and analysis.

---

## Project Overview

WeatherETL is designed to run on a schedule, continuously collecting weather observations for configurable locations. The pipeline handles data extraction, cleaning, enrichment, and storage, while a separate dashboard application provides real-time and historical weather visualizations.

## Architecture

```
+---------------------+     +---------------------+     +---------------------+
|     EXTRACT         |     |     TRANSFORM       |     |       LOAD          |
|                     |     |                     |     |                     |
| OpenWeatherMap API  | --> | Clean & validate    | --> | SQLite / PostgreSQL |
| Fetch current +     |     | Unit conversions    |     | Upsert records      |
| forecast data       |     | Derived metrics     |     | Handle duplicates   |
+---------------------+     +---------------------+     +---------------------+
                                                                  |
                                                                  v
                                                        +---------------------+
                                                        |     DASHBOARD       |
                                                        |                     |
                                                        | Streamlit app       |
                                                        | Charts & tables     |
                                                        | Historical trends   |
                                                        +---------------------+

Orchestrator: Scheduled execution via Python `schedule` library
              Runs extract -> transform -> load at configurable intervals
```

## Tech Stack

- **Data Extraction:** requests (OpenWeatherMap API)
- **Data Processing:** pandas
- **Database:** SQLAlchemy (SQLite for dev, PostgreSQL for prod)
- **Dashboard:** Streamlit
- **Scheduling:** schedule
- **Configuration:** python-dotenv

## Planned Features

- [ ] Current weather data extraction for multiple cities
- [ ] 5-day forecast extraction
- [ ] Data validation and cleaning pipeline
- [ ] Unit conversions (Kelvin to Celsius/Fahrenheit)
- [ ] Derived metrics (heat index, wind chill, comfort index)
- [ ] SQLite storage with SQLAlchemy ORM
- [ ] PostgreSQL support for production deployment
- [ ] Configurable scheduling (hourly, daily, custom cron)
- [ ] Interactive Streamlit dashboard with historical trends
- [ ] Weather comparison across cities
- [ ] Alert system for extreme weather conditions
- [ ] Data export to CSV/JSON
- [ ] Error handling and retry logic with exponential backoff
- [ ] Logging and monitoring

## Planned Schedule

| Task                  | Frequency     | Description                        |
|-----------------------|---------------|------------------------------------|
| Current weather fetch | Every 30 min  | Pull current conditions per city   |
| Forecast fetch        | Every 6 hours | Pull 5-day forecast per city       |
| Data cleanup          | Daily         | Remove records older than 90 days  |
| Dashboard refresh     | Real-time     | Auto-refresh on page load          |

## Setup Instructions

```bash
# Navigate to the project
cd data-pipeline

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your OpenWeatherMap API key

# Run the pipeline once
python -m pipeline.orchestrator

# Launch the dashboard
streamlit run dashboard/app.py
```

## Project Structure

```
data-pipeline/
  pipeline/
    extract.py        # API data extraction from OpenWeatherMap
    transform.py      # Data cleaning and transformation
    load.py           # Database loading and storage
    orchestrator.py   # Scheduled pipeline execution
  dashboard/
    app.py            # Streamlit visualization dashboard
  .env.example
  requirements.txt
  .gitignore
  README.md
```

## License

MIT
