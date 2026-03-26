"""
StockScope - Main Dashboard Application

Interactive Streamlit dashboard for stock analysis and prediction.
"""

import streamlit as st
from datetime import datetime, timedelta

from app.data import StockDataFetcher
from app.models import PredictionEngine
from app.visualizations import ChartBuilder

# Page configuration
st.set_page_config(
    page_title="StockScope",
    layout="wide",
)

st.title("StockScope")
st.caption("Interactive stock analysis and ML-powered price prediction")


def initialize_session_state():
    """Initialize Streamlit session state variables."""
    if "data_fetcher" not in st.session_state:
        st.session_state.data_fetcher = StockDataFetcher()
    if "prediction_engine" not in st.session_state:
        st.session_state.prediction_engine = PredictionEngine()
    if "chart_builder" not in st.session_state:
        st.session_state.chart_builder = ChartBuilder()


initialize_session_state()

# --- Sidebar Controls ---
with st.sidebar:
    st.header("Stock Selection")

    ticker = st.text_input("Ticker Symbol", value="AAPL").upper()

    st.subheader("Date Range")
    end_date = datetime.today()
    start_date = end_date - timedelta(days=365)
    col1, col2 = st.columns(2)
    with col1:
        start = st.date_input("Start", value=start_date)
    with col2:
        end = st.date_input("End", value=end_date)

    st.divider()
    st.subheader("Technical Indicators")
    show_sma = st.checkbox("SMA (20, 50)", value=True)
    show_ema = st.checkbox("EMA (12, 26)")
    show_rsi = st.checkbox("RSI (14)")
    show_bollinger = st.checkbox("Bollinger Bands")
    show_volume = st.checkbox("Volume", value=True)

    st.divider()
    st.subheader("Prediction")
    prediction_model = st.selectbox("Model", ["None", "Prophet", "LSTM (planned)"])
    forecast_days = st.slider("Forecast horizon (days)", 7, 90, 30)

    run_prediction = st.button("Run Prediction")

# --- Main Content ---
# Fetch stock data
df = st.session_state.data_fetcher.fetch(ticker, str(start), str(end))

if df is None or df.empty:
    st.warning(f"No data available for ticker '{ticker}'. Check the symbol and try again.")
else:
    # Stock info header
    st.subheader(f"{ticker} - Stock Overview")
    info = st.session_state.data_fetcher.get_info(ticker)

    # Summary metrics
    metrics_cols = st.columns(4)
    if not df.empty:
        latest = df.iloc[-1]
        prev = df.iloc[-2] if len(df) > 1 else latest
        change = latest["Close"] - prev["Close"]
        pct_change = (change / prev["Close"]) * 100 if prev["Close"] != 0 else 0

        metrics_cols[0].metric("Close", f"${latest['Close']:.2f}", f"{change:+.2f}")
        metrics_cols[1].metric("Change %", f"{pct_change:+.2f}%")
        metrics_cols[2].metric("Volume", f"{latest.get('Volume', 0):,.0f}")
        metrics_cols[3].metric("52-Week Range", info.get("52_week", "N/A"))

    st.divider()

    # Price chart
    st.subheader("Price History")
    # TODO: Replace with interactive Plotly chart from ChartBuilder
    # fig = st.session_state.chart_builder.price_chart(
    #     df, show_sma=show_sma, show_ema=show_ema, show_bollinger=show_bollinger
    # )
    # st.plotly_chart(fig, use_container_width=True)
    st.line_chart(df["Close"])

    # Volume chart
    if show_volume:
        st.subheader("Volume")
        st.bar_chart(df.get("Volume", []))

    # RSI chart
    if show_rsi:
        st.subheader("RSI (14)")
        # TODO: Calculate and display RSI
        st.info("RSI indicator not yet implemented.")

    st.divider()

    # Prediction section
    if run_prediction and prediction_model != "None":
        st.subheader(f"Price Forecast ({prediction_model})")

        if prediction_model == "Prophet":
            # TODO: Run Prophet prediction
            # forecast = st.session_state.prediction_engine.predict_prophet(
            #     df, forecast_days=forecast_days
            # )
            # fig = st.session_state.chart_builder.forecast_chart(df, forecast)
            # st.plotly_chart(fig, use_container_width=True)
            st.info("Prophet forecasting not yet implemented.")

        elif prediction_model == "LSTM (planned)":
            st.info("LSTM model is planned for a future release.")

    # Raw data expander
    with st.expander("View Raw Data"):
        st.dataframe(df, use_container_width=True)
