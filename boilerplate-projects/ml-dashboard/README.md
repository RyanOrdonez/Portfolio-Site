# StockScope - Interactive ML Stock Analysis Dashboard

**Status: In Development**

An interactive Streamlit dashboard for stock market analysis and price prediction. StockScope combines real-time market data with machine learning models to provide insights, visualizations, and forecasts for selected stocks.

---

## Project Overview

StockScope pulls historical and real-time stock data via yfinance, visualizes it with interactive Plotly charts, and applies machine learning models (LSTM neural networks, Facebook Prophet) to generate price forecasts. The dashboard is designed for exploration -- pick a stock, view its history, run a prediction, and compare model performance.

## Tech Stack

- **Dashboard:** Streamlit
- **Data Source:** yfinance
- **Visualization:** Plotly
- **Data Processing:** pandas
- **ML Models:** scikit-learn, Prophet
- **Deep Learning:** (planned) TensorFlow/Keras for LSTM

## Planned Features

- [ ] Stock selection with ticker search and sidebar controls
- [ ] Historical price charts (candlestick, line, OHLCV)
- [ ] Technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
- [ ] Volume analysis visualization
- [ ] Prophet time-series forecasting with confidence intervals
- [ ] LSTM neural network price prediction
- [ ] Model comparison dashboard (Prophet vs LSTM vs baseline)
- [ ] Portfolio tracker with aggregate performance
- [ ] Sector heatmap visualization
- [ ] News sentiment overlay (planned integration)
- [ ] Configurable prediction horizons (7, 30, 90 days)
- [ ] Model performance metrics (RMSE, MAE, MAPE)
- [ ] Data export to CSV

## Setup Instructions

```bash
# Navigate to the project
cd ml-dashboard

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Launch the dashboard
streamlit run app/main.py
```

## Project Structure

```
ml-dashboard/
  app/
    main.py              # Streamlit application entry point
    data.py              # Stock data fetching and caching
    models.py            # Prediction models (LSTM, Prophet)
    visualizations.py    # Chart generation with Plotly
  requirements.txt
  .gitignore
  README.md
```

## Usage

Once running, use the sidebar to:
1. Enter a stock ticker symbol (e.g., AAPL, GOOGL, TSLA)
2. Select a date range for historical data
3. Choose technical indicators to overlay
4. Run a prediction model and view forecasts

## License

MIT
