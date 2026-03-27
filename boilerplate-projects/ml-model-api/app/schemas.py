"""
Pydantic schemas for API request and response validation.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Schema for sentiment prediction input."""

    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Text to analyze for sentiment.",
        examples=["This product is absolutely wonderful!"],
    )


class PredictionResponse(BaseModel):
    """Schema for sentiment prediction output."""

    text: str = Field(description="The original input text.")
    sentiment: str = Field(
        description="Predicted sentiment label: positive, negative, or neutral."
    )
    confidence: float = Field(
        ge=0.0, le=1.0, description="Model confidence score between 0 and 1."
    )


class BatchPredictionRequest(BaseModel):
    """Schema for batch sentiment prediction input."""

    texts: List[str] = Field(
        ...,
        min_length=1,
        max_length=32,
        description="List of texts to analyze (max 32).",
        examples=[["Great product!", "Terrible service.", "It was okay."]],
    )


class BatchPredictionResponse(BaseModel):
    """Schema for batch sentiment prediction output."""

    predictions: List[PredictionResponse] = Field(
        description="List of prediction results."
    )


class HealthResponse(BaseModel):
    """Schema for health check response."""

    status: str = Field(description="Service status.")
    model_loaded: bool = Field(description="Whether the ML model is loaded and ready.")
    version: str = Field(description="API version string.")


class ModelInfoResponse(BaseModel):
    """Schema for model metadata response."""

    model_type: str = Field(description="Type of ML model.")
    version: str = Field(description="Model version string.")
    labels: List[str] = Field(description="Supported sentiment labels.")
    training_samples: int = Field(description="Number of training samples used.")
    is_loaded: bool = Field(description="Whether the model is loaded.")
    features: Optional[int] = Field(description="Max TF-IDF features.")
