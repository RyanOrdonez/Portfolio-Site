"""
Sentiment Analysis API - Main Application

FastAPI application serving a TF-IDF + Logistic Regression sentiment model.
"""

import logging
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException
from app.schemas import (
    PredictionRequest,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    HealthResponse,
    ModelInfoResponse,
)
from app.model import SentimentModel

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

model: SentimentModel = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the ML model on startup."""
    global model
    logger.info("Loading sentiment model...")
    model = SentimentModel()
    logger.info("Model loaded and ready")
    yield
    logger.info("Shutting down")


app = FastAPI(
    title="Sentiment Analysis API",
    description="Production ML API for text sentiment analysis. "
    "Accepts text input and returns sentiment predictions (positive, negative, neutral) "
    "with confidence scores.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Return service health status and model readiness."""
    return HealthResponse(
        status="healthy",
        model_loaded=model.is_loaded if model else False,
        version="1.0.0",
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict_sentiment(request: PredictionRequest):
    """
    Predict sentiment for a single text input.

    Returns sentiment label (positive, negative, neutral) and confidence score.
    """
    if not model or not model.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please try again later.",
        )

    logger.info("Prediction request: %d characters", len(request.text))
    result = model.predict(request.text)
    return PredictionResponse(
        text=request.text,
        sentiment=result["sentiment"],
        confidence=result["confidence"],
    )


@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """
    Predict sentiment for multiple texts in a single request.

    Accepts up to 32 texts at once for efficient batch processing.
    """
    if not model or not model.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please try again later.",
        )

    logger.info("Batch prediction request: %d texts", len(request.texts))
    results = model.predict_batch(request.texts)
    predictions = [
        PredictionResponse(
            text=text,
            sentiment=r["sentiment"],
            confidence=r["confidence"],
        )
        for text, r in zip(request.texts, results)
    ]
    return BatchPredictionResponse(predictions=predictions)


@app.get("/model/info", response_model=ModelInfoResponse)
async def model_info():
    """Return model metadata including type, version, and training info."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not initialized.")

    info = model.get_info()
    return ModelInfoResponse(**info)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
