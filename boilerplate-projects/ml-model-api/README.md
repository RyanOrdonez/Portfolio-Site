# Sentiment Analysis API

A production-ready machine learning API that performs sentiment analysis on text inputs. Built with FastAPI and scikit-learn, containerized with Docker, and designed for real-world deployment.

## How It Works

The API uses a **TF-IDF + Logistic Regression** pipeline trained on labeled sentiment data. Text input is vectorized using term frequency-inverse document frequency with bigram support, then classified into **positive**, **negative**, or **neutral** sentiment with a confidence score.

```
POST /predict
{"text": "This product is absolutely wonderful!"}

→ {"text": "...", "sentiment": "positive", "confidence": 0.9231}
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| API Framework | FastAPI |
| ML Pipeline | scikit-learn (TF-IDF + LogisticRegression) |
| Validation | Pydantic v2 |
| Server | Uvicorn (ASGI) |
| Container | Docker (Python 3.11-slim) |
| Testing | pytest + httpx |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check and service status |
| `POST` | `/predict` | Single text sentiment prediction |
| `POST` | `/predict/batch` | Batch prediction (up to 32 texts) |
| `GET` | `/model/info` | Model metadata, version, and training info |
| `GET` | `/docs` | Interactive Swagger UI documentation |

## Quick Start

### Local Development

```bash
# Clone and enter the project
git clone https://github.com/RyanOrdonez/sentiment-analysis-api.git
cd sentiment-analysis-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
docker build -t sentiment-api .
docker run -p 8000:8000 sentiment-api
```

### Run Tests

```bash
pytest tests/ -v
```

## Usage Examples

### Single Prediction

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This is the best product I have ever used!"}'
```

```json
{
  "text": "This is the best product I have ever used!",
  "sentiment": "positive",
  "confidence": 0.9124
}
```

### Batch Prediction

```bash
curl -X POST http://localhost:8000/predict/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Love it!", "Terrible quality.", "It was okay."]}'
```

```json
{
  "predictions": [
    {"text": "Love it!", "sentiment": "positive", "confidence": 0.8876},
    {"text": "Terrible quality.", "sentiment": "negative", "confidence": 0.9102},
    {"text": "It was okay.", "sentiment": "neutral", "confidence": 0.7234}
  ]
}
```

### Model Info

```bash
curl http://localhost:8000/model/info
```

```json
{
  "model_type": "TF-IDF + Logistic Regression",
  "version": "1.0.0",
  "labels": ["positive", "negative", "neutral"],
  "training_samples": 60,
  "is_loaded": true,
  "features": 5000
}
```

## Project Structure

```
sentiment-analysis-api/
├── app/
│   ├── __init__.py       # Package init
│   ├── main.py           # FastAPI app, routes, lifespan
│   ├── model.py          # TF-IDF + LR pipeline, training, inference
│   └── schemas.py        # Pydantic request/response models
├── tests/
│   └── test_api.py       # Endpoint tests (health, predict, batch, model info)
├── Dockerfile            # Production container config
├── requirements.txt      # Python dependencies
├── .gitignore
└── README.md
```

## Model Details

- **Vectorizer:** TF-IDF with unigrams + bigrams, English stopword removal, sublinear TF scaling, max 5,000 features
- **Classifier:** Multinomial Logistic Regression with balanced class weights
- **Training:** 60 labeled examples (20 positive, 20 negative, 20 neutral) built into the application
- **Extensible:** Supports loading pre-trained models from disk via joblib for production datasets

## Roadmap

- [x] TF-IDF + Logistic Regression sentiment model
- [x] Single prediction endpoint with confidence scores
- [x] Batch prediction endpoint (up to 32 texts)
- [x] Model info/metadata endpoint
- [x] Structured logging
- [x] Docker containerization
- [x] Comprehensive test suite
- [ ] Train on larger dataset (IMDB, Amazon reviews)
- [ ] Add model versioning and hot-swapping
- [ ] Prometheus metrics integration
- [ ] Rate limiting and API key authentication
- [ ] CI/CD pipeline with GitHub Actions

## License

MIT
