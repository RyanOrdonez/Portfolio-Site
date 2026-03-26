"""
WeatherETL - Dashboard

Streamlit dashboard for visualizing collected weather data.
"""

import streamlit as st
import pandas as pd

from pipeline.load import get_engine, query_recent

# Page configuration
st.set_page_config(
    page_title="WeatherETL Dashboard",
    layout="wide",
)

st.title("WeatherETL Dashboard")
st.caption("Real-time and historical weather data visualization")


@st.cache_data(ttl=300)
def load_data(city: str = None, limit: int = 500) -> pd.DataFrame:
    """Load weather data from the database with caching."""
    try:
        return query_recent(city=city, limit=limit)
    except Exception as e:
        st.error(f"Failed to load data: {e}")
        return pd.DataFrame()


# --- Sidebar ---
with st.sidebar:
    st.header("Filters")

    # TODO: Populate city list dynamically from database
    cities = ["All", "London", "New York", "Tokyo", "Sydney", "Berlin"]
    selected_city = st.selectbox("City", cities)

    date_range = st.date_input("Date range", value=[])

    st.divider()
    if st.button("Refresh Data"):
        st.cache_data.clear()

# --- Main Content ---
city_filter = None if selected_city == "All" else selected_city
df = load_data(city=city_filter)

if df.empty:
    st.info(
        "No weather data available. Run the pipeline first: "
        "`python -m pipeline.orchestrator --once`"
    )
else:
    # Summary metrics
    st.subheader("Current Conditions")
    cols = st.columns(4)

    # TODO: Implement real metric calculations from the data
    cols[0].metric("Temperature", "-- C", delta=None)
    cols[1].metric("Humidity", "-- %", delta=None)
    cols[2].metric("Wind Speed", "-- m/s", delta=None)
    cols[3].metric("Pressure", "-- hPa", delta=None)

    st.divider()

    # Temperature trend chart
    st.subheader("Temperature Trend")
    # TODO: Create proper time-series chart with plotly
    # import plotly.express as px
    # fig = px.line(df, x="extracted_at", y="temperature_c", color="city",
    #               title="Temperature Over Time")
    # st.plotly_chart(fig, use_container_width=True)
    st.info("Temperature trend chart not yet implemented.")

    st.divider()

    # Raw data table
    st.subheader("Raw Data")
    st.dataframe(df, use_container_width=True)

    # TODO: Add more visualizations:
    # - Humidity heatmap across cities
    # - Wind rose diagram
    # - Weather condition distribution (bar chart)
    # - City comparison scatter plots
    # - Forecast vs actual overlay
