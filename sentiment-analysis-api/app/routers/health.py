"""Health and model metadata endpoints.

Kept separate from the prediction router so that observability endpoints can
evolve independently (e.g., adding /readiness or /metrics later) without
cluttering the main prediction API.
"""

from fastapi import APIRouter, Request

from app.config import get_settings
from app.schemas import HealthResponse, ModelInfoResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    """Liveness probe.

    Returns 200 with ``model_loaded=False`` if the service is up but the model
    failed to load. This lets orchestrators distinguish between "container is
    dead" and "container is alive but not ready to serve traffic."
    """
    settings = get_settings()
    service = request.app.state.sentiment_service
    return HealthResponse(
        status="ok",
        model_loaded=service.is_loaded,
        model_name=settings.model_name,
        version=settings.app_version,
    )


@router.get("/model", response_model=ModelInfoResponse)
async def model_info(request: Request) -> ModelInfoResponse:
    """Return metadata about the currently-loaded model."""
    settings = get_settings()
    service = request.app.state.sentiment_service
    return ModelInfoResponse(
        name=settings.model_name,
        revision=settings.model_revision,
        labels=service.labels,
        device=service.device,
    )
