"""
Pydantic schemas for API request and response validation.
"""

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


class HealthResponse(BaseModel):
    """Schema for health check response."""

    status: str = Field(description="Service status.")
    model_loaded: bool = Field(description="Whether the ML model is loaded and ready.")
    version: str = Field(description="API version string.")


# TODO: Add batch request/response schemas
# class BatchPredictionRequest(BaseModel):
#     texts: List[str]

# class BatchPredictionResponse(BaseModel):
#     predictions: List[PredictionResponse]
