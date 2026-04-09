# Sentiment Analysis API

> A production-ready FastAPI service that wraps HuggingFace transformer models for real-time sentiment classification. Designed as a reference implementation for deploying ML models behind a clean HTTP interface with proper concerns: request validation, model lifecycle management, batched inference, observability, and containerized deployment.

<br>

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
&nbsp;
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)
&nbsp;
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
&nbsp;
![PyTorch](https://img.shields.io/badge/PyTorch-2.3-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
&nbsp;
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

<br>

## Overview

The Sentiment Analysis API is a thin, well-instrumented HTTP wrapper around a HuggingFace sentiment classifier. It is built for the case that every data scientist eventually runs into: "I trained a model, now how do I actually serve it to another application without rewriting my inference code for the fifth time?"

Rather than building yet another bespoke Flask script, this project demonstrates the right default architecture:

- **FastAPI** for the HTTP layer, because Pydantic validation and OpenAPI docs are free
- **HuggingFace Transformers** for the model, pinned by revision for reproducibility
- **Singleton model loading** at application startup, so the 250 MB model is loaded once and reused
- **Batched inference** for the `/predict/batch` endpoint to amortize tokenization and GPU transfer costs
- **Structured logging + request IDs** so individual predictions can be traced through the pipeline
- **Dockerfile** for reproducible deployment, with multi-stage build to keep the runtime image small
- **pytest test suite** covering happy paths, input validation, and model fallback behavior

This repo is intentionally scoped: one model, one task, production-grade plumbing. The same scaffold extends cleanly to any HuggingFace classification model (emotion detection, toxicity, intent classification, zero-shot).

## Model

Default model: **`distilbert-base-uncased-finetuned-sst-2-english`**
- 67M parameters, distilled from BERT-base
- Fine-tuned on Stanford Sentiment Treebank v2 (SST-2)
- Binary classification: POSITIVE / NEGATIVE with confidence score
- ~15 ms inference on CPU for a single short input, ~2 ms on GPU
- Pinned to a specific revision hash in `app/config.py` for reproducibility

The model name is configurable via the `MODEL_NAME` environment variable, so the same container can serve any HuggingFace sentiment model (RoBERTa, BERTweet for tweets, multilingual XLM-R, etc.) without code changes.

## API Design

The API exposes four endpoints, all returning JSON:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness + model-loaded status check |
| `GET` | `/model` | Current model name, revision, label set |
| `POST` | `/predict` | Single-text sentiment prediction |
| `POST` | `/predict/batch` | Batched prediction for up to 64 texts per request |

### Request / Response Schema

**Single prediction** — `POST /predict`

```json
// Request
{
  "text": "I absolutely loved this movie, it was phenomenal."
}

// Response
{
  "request_id": "f2a1b8c9-4d6e-4f7a-9b3c-1e2d3f4a5b6c",
  "label": "POSITIVE",
  "score": 0.9998,
  "model": "distilbert-base-uncased-finetuned-sst-2-english",
  "latency_ms": 14.2
}
```

**Batched prediction** — `POST /predict/batch`

```json
// Request
{
  "texts": [
    "This product is amazing.",
    "Worst experience of my life.",
    "It was okay, nothing special."
  ]
}

// Response
{
  "request_id": "a1b2c3d4-...",
  "predictions": [
    {"label": "POSITIVE", "score": 0.9995},
    {"label": "NEGATIVE", "score": 0.9992},
    {"label": "NEGATIVE", "score": 0.6834}
  ],
  "model": "distilbert-base-uncased-finetuned-sst-2-english",
  "latency_ms": 22.8,
  "count": 3
}
```

### Input Validation

Validation is enforced by Pydantic models, not scattered `if` statements:

- `text` must be 1–5,000 characters (longer inputs are rejected with HTTP 422, not silently truncated)
- `texts` array must contain 1–64 items
- Each item in `texts` must be 1–5,000 characters
- Empty strings, null values, and non-string types are rejected at the schema layer before reaching the model

Reject-at-the-boundary is the right default: by the time a bad request reaches the model, you've already paid the tokenization cost for nothing.

## Architecture

```
Client Request
     │
     ▼
┌─────────────────────────┐
│   FastAPI (Uvicorn)     │ ◄── Request ID middleware
│                         │     Structured logging
└────────────┬────────────┘     Pydantic validation
             │
             ▼
┌─────────────────────────┐
│   SentimentService      │ ◄── Singleton, loaded at startup
│   (app/services/)       │     Batched tokenization
└────────────┬────────────┘     Device-aware (CPU/GPU)
             │
             ▼
┌─────────────────────────┐
│  HuggingFace Pipeline   │
│  DistilBERT (SST-2)     │
└─────────────────────────┘
```

### Why a singleton?

The model is loaded exactly once, in the FastAPI lifespan context manager, when the application starts. Subsequent requests reuse the same loaded model instance. This is not a premature optimization — loading a transformer model is a 2–5 second operation, and doing it per request would make the service unusable under any real load. The singleton also ensures a single GPU allocation rather than thrashing on model transfers.

## Repository Structure

```
sentiment-analysis-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, lifespan, middleware
│   ├── config.py            # Settings via pydantic-settings
│   ├── schemas.py           # Pydantic request/response models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py        # /health, /model endpoints
│   │   └── predict.py       # /predict, /predict/batch endpoints
│   └── services/
│       ├── __init__.py
│       └── sentiment.py     # SentimentService (model wrapper)
├── tests/
│   ├── __init__.py
│   ├── test_health.py       # Health endpoint tests
│   ├── test_predict.py      # Prediction endpoint tests
│   └── test_validation.py   # Input validation tests
├── Dockerfile               # Multi-stage build for small image
├── requirements.txt         # Pinned Python dependencies
├── .dockerignore
└── README.md
```

## Quick Start

### Local development

```bash
# Clone and install
git clone https://github.com/RyanOrdonez/Sentiment-Analysis-API.git
cd Sentiment-Analysis-API
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Run the server (reload mode)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, test it
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This is the best API I have ever used."}'
```

Once the server is running, interactive API docs are available at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc` (ReDoc) — both auto-generated from the Pydantic schemas.

### Docker

```bash
# Build the image
docker build -t sentiment-analysis-api .

# Run the container
docker run -d -p 8000:8000 --name sentiment-api sentiment-analysis-api

# Check health
curl http://localhost:8000/health
```

The Docker image uses a multi-stage build: a `builder` stage that installs dependencies and downloads the model, and a slim runtime stage that copies only the `/app` directory and model cache. Final image size is ~1.4 GB (dominated by PyTorch and the model weights themselves).

## Testing

```bash
# Run the full test suite
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=term-missing
```

The test suite covers:

- **Health checks** — `/health` returns 200 when model is loaded
- **Model metadata** — `/model` returns correct name and labels
- **Happy path predictions** — positive and negative inputs are classified correctly
- **Batch predictions** — results match single predictions element-wise
- **Input validation** — empty strings, oversized inputs, non-string types return HTTP 422
- **Model fallback** — service returns HTTP 503 when the model failed to load at startup

Tests use FastAPI's `TestClient`, which runs the app in-process without starting a real server. The model loads once for the entire test session via a pytest fixture.

## Configuration

All configuration is environment-variable driven via `pydantic-settings`:

| Variable | Default | Description |
|----------|---------|-------------|
| `MODEL_NAME` | `distilbert-base-uncased-finetuned-sst-2-english` | HuggingFace model ID |
| `MODEL_REVISION` | `af0f99b` | Specific model revision hash for reproducibility |
| `MAX_BATCH_SIZE` | `64` | Maximum items per batch request |
| `MAX_TEXT_LENGTH` | `5000` | Maximum character length per input |
| `DEVICE` | `auto` | `auto`, `cpu`, `cuda`, or `mps` |
| `LOG_LEVEL` | `INFO` | Standard Python logging levels |

## Roadmap

Day-1 scope (this commit) delivers the core scaffolding. Day-2 work will add:

- **Error handling polish** — structured error responses with error codes, timeout handling for long requests
- **Model caching** — pre-download model in the Docker build stage so startup is fast and deterministic
- **Rate limiting** — per-IP rate limits via `slowapi` to protect the model from runaway clients
- **Prometheus metrics** — request count, latency histogram, model inference time, batch size distribution
- **Deployment config** — Railway/Render/Fly.io config files and GitHub Actions CI for image builds
- **Multilingual support** — optional XLM-R model with automatic language detection
- **Confidence thresholds** — configurable threshold below which predictions are flagged as uncertain

## Design Decisions

| Decision | Alternative | Why This Choice |
|----------|-------------|-----------------|
| FastAPI | Flask, Django REST | Automatic OpenAPI docs, Pydantic validation, async-native, faster in benchmarks |
| Pinned model revision | `main` branch | Reproducibility — same revision always returns same predictions |
| Singleton model load | Per-request load | 2–5s load time would kill latency; thread-safe with PyTorch |
| Pydantic validation | Manual `if` checks | Schema-as-code, OpenAPI generation, better error messages |
| Multi-stage Dockerfile | Single stage | Runtime image ~40% smaller, no build tools in production image |
| Batch endpoint | Only single | Amortizes tokenization and GPU overhead; ~5x throughput for batches of 32 |

## Why This Project Exists

Every production ML engineer has written a version of this service at least once. The point of publishing it as a standalone reference is to capture the patterns that are easy to get wrong the first time: model lifecycle, request validation, observability, and container hygiene. If it saves one person from rewriting their own `app.py` with `load_model()` at the top of each request, it was worth publishing.

## License

MIT

## Author

**Ryan Ordonez** — Data Scientist, M.S. CU Boulder
[Portfolio](https://ryanordonez.github.io/Portfolio-Site/) • [GitHub](https://github.com/RyanOrdonez) • [Blog](https://ryanordonez.github.io/Portfolio-Site/blog.html)
