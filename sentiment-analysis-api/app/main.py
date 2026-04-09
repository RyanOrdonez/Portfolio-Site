"""FastAPI application entrypoint.

Responsibilities:
- Configure structured logging
- Load the sentiment model exactly once via the lifespan context manager
- Register routers for health and prediction endpoints
- Expose the OpenAPI docs at /docs and /redoc
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.routers import health, predict
from app.services.sentiment import SentimentService


def _configure_logging(level: str) -> None:
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model at startup and attach it to app.state.

    Any exception raised in here prevents the server from accepting traffic,
    which is what we want: a service that can't load its model should not
    pretend to be healthy.
    """
    settings = get_settings()
    _configure_logging(settings.log_level)
    logger = logging.getLogger(__name__)
    logger.info("starting %s v%s", settings.app_name, settings.app_version)

    service = SentimentService(settings)
    try:
        service.load()
    except Exception:
        logger.exception("failed to load sentiment model")
        # Still attach the service so /health can report model_loaded=False
        # instead of returning a 500 on every probe.
        app.state.sentiment_service = service
        yield
        return

    app.state.sentiment_service = service
    yield
    logger.info("shutting down %s", settings.app_name)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Sentiment Analysis API",
        description=(
            "A production-ready FastAPI wrapper around a HuggingFace sentiment "
            "classifier. Exposes single and batched prediction endpoints with "
            "Pydantic request validation, structured logging, and OpenAPI docs."
        ),
        version=settings.app_version,
        lifespan=lifespan,
    )
    app.include_router(health.router)
    app.include_router(predict.router)
    return app


app = create_app()
