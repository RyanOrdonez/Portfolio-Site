"""FastAPI application entrypoint.

Responsibilities:
- Configure structured logging
- Load the sentiment model exactly once via the lifespan context manager
- Register routers for health and prediction endpoints
- Add per-IP rate limiting via SlowAPI
- Expose Prometheus metrics at /metrics
- Return structured error responses for validation failures
- Expose the OpenAPI docs at /docs and /redoc
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.rate_limit import limiter
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
            "Pydantic request validation, per-IP rate limiting, Prometheus "
            "metrics, structured logging, and OpenAPI docs."
        ),
        version=settings.app_version,
        lifespan=lifespan,
    )

    # --- Rate limiting ---
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # --- Structured validation error responses ---
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        errors = []
        for error in exc.errors():
            errors.append(
                {
                    "field": ".".join(str(loc) for loc in error["loc"]),
                    "message": error["msg"],
                    "type": error["type"],
                }
            )
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "validation_error",
                "detail": "Request validation failed",
                "errors": errors,
            },
        )

    # --- Prometheus metrics ---
    from prometheus_fastapi_instrumentator import Instrumentator

    Instrumentator(
        should_group_status_codes=False,
        should_ignore_untemplated=True,
        excluded_handlers=["/health", "/metrics"],
    ).instrument(app).expose(app, include_in_schema=False)

    app.include_router(health.router)
    app.include_router(predict.router)
    return app


app = create_app()
