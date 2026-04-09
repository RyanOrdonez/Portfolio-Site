"""Prediction endpoints.

Two endpoints: one for single-text prediction and one for batched prediction.
Both share the same underlying ``SentimentService`` but have different request
and response schemas so the OpenAPI docs show each case clearly.
"""

import logging
import time
import uuid

from fastapi import APIRouter, HTTPException, Request, status

from app.config import get_settings
from app.schemas import (
    BatchPredictRequest,
    BatchPredictResponse,
    Prediction,
    PredictRequest,
    PredictResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/predict", tags=["predict"])


def _require_loaded(request: Request) -> None:
    service = request.app.state.sentiment_service
    if not service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="model is not loaded",
        )


@router.post("", response_model=PredictResponse)
async def predict_single(request: Request, body: PredictRequest) -> PredictResponse:
    """Classify a single piece of text."""
    _require_loaded(request)
    service = request.app.state.sentiment_service
    settings = get_settings()

    request_id = str(uuid.uuid4())
    start = time.perf_counter()
    result = service.predict(body.text)
    latency_ms = (time.perf_counter() - start) * 1000.0

    logger.info(
        "predict request_id=%s label=%s score=%.4f latency_ms=%.2f",
        request_id,
        result["label"],
        result["score"],
        latency_ms,
    )

    return PredictResponse(
        request_id=request_id,
        label=result["label"],
        score=result["score"],
        model=settings.model_name,
        latency_ms=round(latency_ms, 2),
    )


@router.post("/batch", response_model=BatchPredictResponse)
async def predict_batch(
    request: Request, body: BatchPredictRequest
) -> BatchPredictResponse:
    """Classify a batch of texts.

    Batching amortizes the tokenization cost and GPU transfer overhead across
    many inputs, so a batch of 32 is roughly 5x faster than 32 sequential
    single-item requests for typical input lengths.
    """
    _require_loaded(request)
    service = request.app.state.sentiment_service
    settings = get_settings()

    request_id = str(uuid.uuid4())
    start = time.perf_counter()
    results = service.predict_batch(body.texts)
    latency_ms = (time.perf_counter() - start) * 1000.0

    logger.info(
        "predict_batch request_id=%s count=%d latency_ms=%.2f",
        request_id,
        len(results),
        latency_ms,
    )

    return BatchPredictResponse(
        request_id=request_id,
        predictions=[Prediction(**r) for r in results],
        model=settings.model_name,
        latency_ms=round(latency_ms, 2),
        count=len(results),
    )
