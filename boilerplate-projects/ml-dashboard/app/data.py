"""
StockScope - Data Fetching

Handles stock data retrieval from yfinance with caching.
"""

import logging
from typing import Optional, Dict, Any

import pandas as pd
import yfinance as yf

logger = logging.getLogger(__name__)


class StockDataFetcher:
    """
    Fetches and caches stock market data using yfinance.

    TODO: Add data validation and error handling for edge cases.
    TODO: Add support for multiple data sources as fallbacks.
    """

    def __init__(self):
        self._cache: Dict[str, pd.DataFrame] = {}

    def fetch(
        self,
        ticker: str,
        start: str,
        end: str,
        interval: str = "1d",
    ) -> Optional[pd.DataFrame]:
        """
        Fetch historical stock data for a given ticker.

        Args:
            ticker: Stock ticker symbol (e.g., "AAPL").
            start: Start date string (YYYY-MM-DD).
            end: End date string (YYYY-MM-DD).
            interval: Data interval ("1d", "1wk", "1mo").

        Returns:
            DataFrame with OHLCV data, or None on failure.

        TODO: Add more robust caching with TTL.
        TODO: Add pre-market and after-hours data option.
        """
        cache_key = f"{ticker}_{start}_{end}_{interval}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        try:
            stock = yf.Ticker(ticker)
            df = stock.history(start=start, end=end, interval=interval)

            if df.empty:
                logger.warning("No data returned for %s", ticker)
                return None

            self._cache[cache_key] = df
            logger.info("Fetched %d rows for %s", len(df), ticker)
            return df

        except Exception as e:
            logger.error("Failed to fetch data for %s: %s", ticker, e)
            return None

    def get_info(self, ticker: str) -> Dict[str, Any]:
        """
        Get stock metadata (company name, sector, market cap, etc.).

        Args:
            ticker: Stock ticker symbol.

        Returns:
            Dictionary of stock information.

        TODO: Parse and structure the yfinance info dict into a clean format.
        """
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            return {
                "name": info.get("longName", ticker),
                "sector": info.get("sector", "N/A"),
                "market_cap": info.get("marketCap", "N/A"),
                "52_week": (
                    f"${info.get('fiftyTwoWeekLow', 'N/A')} - "
                    f"${info.get('fiftyTwoWeekHigh', 'N/A')}"
                ),
                "pe_ratio": info.get("trailingPE", "N/A"),
                "dividend_yield": info.get("dividendYield", "N/A"),
            }
        except Exception as e:
            logger.error("Failed to get info for %s: %s", ticker, e)
            return {"name": ticker, "52_week": "N/A"}

    def fetch_multiple(
        self,
        tickers: list,
        start: str,
        end: str,
    ) -> Dict[str, pd.DataFrame]:
        """
        Fetch data for multiple tickers.

        Args:
            tickers: List of ticker symbols.
            start: Start date.
            end: End date.

        Returns:
            Dictionary mapping ticker to DataFrame.

        TODO: Implement parallel fetching for better performance.
        """
        results = {}
        for ticker in tickers:
            df = self.fetch(ticker, start, end)
            if df is not None:
                results[ticker] = df
        return results
