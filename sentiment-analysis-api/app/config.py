"""Application configuration via environment variables.

Uses pydantic-settings so the config is validated at startup rather than
discovered via AttributeError at the first request.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the sentiment analysis service."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Model selection. Any HuggingFace sentiment classifier works; the default is
    # the canonical DistilBERT fine-tuned on SST-2 — small, fast, and well-studied.
    model_name: str = Field(
        default="distilbert-base-uncased-finetuned-sst-2-english",
        description="HuggingFace model repository ID.",
    )
    model_revision: str = Field(
        default="af0f99b",
        description="Specific model revision (commit hash) for reproducibility.",
    )

    # Request shape limits. These are enforced at the Pydantic schema layer before
    # the request ever reaches the tokenizer, so oversized inputs cost nothing.
    max_batch_size: int = Field(default=64, ge=1, le=256)
    max_text_length: int = Field(default=5000, ge=1, le=20000)

    # Device placement. "auto" lets torch pick the best available device.
    device: Literal["auto", "cpu", "cuda", "mps"] = "auto"

    # Operational
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    app_name: str = "sentiment-analysis-api"
    app_version: str = "0.1.0"


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance.

    Cached so every module that imports this gets the same object and
    environment parsing happens exactly once per process.
    """
    return Settings()
