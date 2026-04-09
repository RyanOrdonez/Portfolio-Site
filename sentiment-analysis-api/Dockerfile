# syntax=docker/dockerfile:1.6
#
# Multi-stage Dockerfile for the Sentiment Analysis API.
#
# Stage 1 (builder): install Python dependencies and pre-download the model
# into the HuggingFace cache directory so subsequent container starts don't
# need network access.
#
# Stage 2 (runtime): slim Python image with only the installed site-packages,
# the model cache, and the application source code.

ARG PYTHON_VERSION=3.11

# ---------- builder ----------
FROM python:${PYTHON_VERSION}-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/opt/hf-cache

WORKDIR /build

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --prefix=/install -r requirements.txt

# Pre-download the model so the runtime image boots without network access.
ENV PYTHONPATH=/install/lib/python${PYTHON_VERSION}/site-packages
RUN python -c "\
from transformers import AutoTokenizer, AutoModelForSequenceClassification; \
name='distilbert-base-uncased-finetuned-sst-2-english'; \
AutoTokenizer.from_pretrained(name); \
AutoModelForSequenceClassification.from_pretrained(name)"

# ---------- runtime ----------
FROM python:${PYTHON_VERSION}-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/opt/hf-cache \
    PORT=8000

WORKDIR /app

# Non-root user for the runtime process.
RUN groupadd --system --gid 1001 app \
    && useradd --system --uid 1001 --gid app --create-home app

COPY --from=builder /install /usr/local
COPY --from=builder /opt/hf-cache /opt/hf-cache
COPY --chown=app:app app/ ./app/

USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request,sys; \
sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/health').status==200 else 1)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
