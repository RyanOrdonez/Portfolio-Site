"""
Sentiment Analysis API - Main Application

FastAPI application serving a sentiment analysis ML model.
"""

from fastapi import FastAPI, HTTPException
from app.schemas import PredictionRequest, PredictionResponse, HealthResponse
from app.model import SentimentModel

app = FastAPI(
    title="Sentiment Analysis API",
    description="Production ML API for text sentiment analysis",
    version="0.1.0",
)

# TODO: Initialize model on startup instead of per-request
model = SentimentModel()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Return service health status and model readiness."""
    return HealthResponse(
        status="healthy",
        model_loaded=model.is_loaded,
        version="0.1.0",
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict_sentiment(request: PredictionRequest):
    """
    Predict sentiment for the given text input.

    Returns sentiment label and confidence score.
    """
    if not model.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please try again later.",
        )

    # TODO: Add input validation and preprocessing
    # TODO: Add request logging for monitoring
    result = model.predict(request.text)
    return PredictionResponse(
        text=request.text,
        sentiment=result["sentiment"],
        confidence=result["confidence"],
    )


# TODO: Add batch prediction endpoint
# @app.post("/predict/batch")
# async def predict_batch(requests: List[PredictionRequest]):
#     pass

# TODO: Add model info endpoint
# @app.get("/model/info")
# async def model_info():
#     pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
