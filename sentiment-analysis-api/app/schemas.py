"""Pydantic schemas for request and response validation.

Schema-as-code means the OpenAPI docs at /docs are generated automatically and
bad requests are rejected at the boundary with useful HTTP 422 errors.
"""

from typing import List

from pydantic import BaseModel, Field, field_validator

from app.config import get_settings

_settings = get_settings()


class PredictRequest(BaseModel):
    """Single-text prediction request."""

    text: str = Field(
        ...,
        min_length=1,
        max_length=_settings.max_text_length,
        description="The input text to classify.",
        examples=["I absolutely loved this product."],
    )

    @field_validator("text")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("text must contain non-whitespace characters")
        return stripped


class BatchPredictRequest(BaseModel):
    """Batched prediction request.

    Accepts between 1 and MAX_BATCH_SIZE texts. The upper bound exists because
    GPU memory and per-request latency both grow with batch size, and unbounded
    batches are a classic foot-gun for a public endpoint.
    """

    texts: List[str] = Field(
        ...,
        min_length=1,
        max_length=_settings.max_batch_size,
        description="List of input texts to classify.",
    )

    @field_validator("texts")
    @classmethod
    def validate_items(cls, v: List[str]) -> List[str]:
        cleaned: List[str] = []
        for i, item in enumerate(v):
            if not isinstance(item, str):
                raise ValueError(f"texts[{i}] must be a string")
            stripped = item.strip()
            if not stripped:
                raise ValueError(f"texts[{i}] must contain non-whitespace characters")
            if len(stripped) > _settings.max_text_length:
                raise ValueError(
                    f"texts[{i}] exceeds max length of {_settings.max_text_length} characters"
                )
            cleaned.append(stripped)
        return cleaned


class Prediction(BaseModel):
    """A single sentiment prediction."""

    label: str = Field(..., examples=["POSITIVE"])
    score: float = Field(..., ge=0.0, le=1.0, examples=[0.9998])


class PredictResponse(BaseModel):
    """Single-text prediction response."""

    request_id: str
    label: str
    score: float
    model: str
    latency_ms: float


class BatchPredictResponse(BaseModel):
    """Batched prediction response."""

    request_id: str
    predictions: List[Prediction]
    model: str
    latency_ms: float
    count: int


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    model_loaded: bool
    model_name: str
    version: str


class ModelInfoResponse(BaseModel):
    """Model metadata response."""

    name: str
    revision: str
    labels: List[str]
    device: str
