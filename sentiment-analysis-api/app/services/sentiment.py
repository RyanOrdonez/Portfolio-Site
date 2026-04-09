"""Sentiment analysis service.

Wraps a HuggingFace sequence classification pipeline so that model loading,
device placement, and batched inference are handled once, at startup, in a
single place. The rest of the application should treat this as a simple
``predict`` / ``predict_batch`` interface.
"""

from __future__ import annotations

import logging
import time
from typing import List, Optional

import torch
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    pipeline,
)

from app.config import Settings

logger = logging.getLogger(__name__)


class SentimentService:
    """Singleton wrapper around a HuggingFace text-classification pipeline.

    Loaded once at application startup (via FastAPI lifespan) and reused for
    every subsequent request. Exposes two methods: ``predict`` for a single
    string and ``predict_batch`` for a list of strings.
    """

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._pipeline: Optional[pipeline] = None
        self._labels: List[str] = []
        self._device_str: str = "cpu"

    @property
    def is_loaded(self) -> bool:
        return self._pipeline is not None

    @property
    def labels(self) -> List[str]:
        return list(self._labels)

    @property
    def device(self) -> str:
        return self._device_str

    def _resolve_device(self) -> int | str:
        """Return the torch device spec.

        ``pipeline`` accepts either an int (GPU index) or a string ("cpu",
        "mps"). We centralize the logic here so the config value stays
        declarative.
        """
        requested = self._settings.device
        if requested == "auto":
            if torch.cuda.is_available():
                self._device_str = "cuda:0"
                return 0
            if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
                self._device_str = "mps"
                return "mps"
            self._device_str = "cpu"
            return -1
        if requested == "cuda":
            if not torch.cuda.is_available():
                logger.warning("cuda requested but not available, falling back to cpu")
                self._device_str = "cpu"
                return -1
            self._device_str = "cuda:0"
            return 0
        if requested == "mps":
            self._device_str = "mps"
            return "mps"
        self._device_str = "cpu"
        return -1

    def load(self) -> None:
        """Load the tokenizer and model into memory.

        Separated from __init__ so the FastAPI lifespan can catch load failures
        cleanly and report them via /health rather than crashing on first
        request.
        """
        if self._pipeline is not None:
            return

        model_name = self._settings.model_name
        revision = self._settings.model_revision
        device = self._resolve_device()

        logger.info(
            "loading sentiment model name=%s revision=%s device=%s",
            model_name,
            revision,
            self._device_str,
        )
        load_start = time.perf_counter()

        tokenizer = AutoTokenizer.from_pretrained(model_name, revision=revision)
        model = AutoModelForSequenceClassification.from_pretrained(
            model_name, revision=revision
        )
        self._pipeline = pipeline(
            task="sentiment-analysis",
            model=model,
            tokenizer=tokenizer,
            device=device,
            truncation=True,
        )
        self._labels = sorted(model.config.id2label.values())

        elapsed = (time.perf_counter() - load_start) * 1000.0
        logger.info(
            "model loaded labels=%s elapsed_ms=%.1f",
            self._labels,
            elapsed,
        )

    def predict(self, text: str) -> dict:
        """Classify a single text. Returns ``{"label": ..., "score": ...}``."""
        if self._pipeline is None:
            raise RuntimeError("model is not loaded")
        result = self._pipeline(text)[0]
        return {"label": result["label"], "score": float(result["score"])}

    def predict_batch(self, texts: List[str]) -> List[dict]:
        """Classify a batch of texts.

        The pipeline handles tokenization and padding internally. We don't
        pre-chunk because the caller's batch size is already bounded by the
        request schema.
        """
        if self._pipeline is None:
            raise RuntimeError("model is not loaded")
        results = self._pipeline(texts)
        return [
            {"label": r["label"], "score": float(r["score"])} for r in results
        ]
