# Sentiment Analysis API

**Status: In Development**

A production-ready machine learning API that performs sentiment analysis on text inputs. Built with FastAPI and scikit-learn, designed for deployment via Docker.

## Project Overview

This project serves a trained sentiment analysis model behind a RESTful API. It accepts text input and returns sentiment predictions (positive, negative, neutral) with confidence scores. The goal is to provide a clean, scalable template for deploying ML models in production environments.

## Tech Stack

- **API Framework:** FastAPI
- **ML Library:** scikit-learn
- **Data Processing:** pandas
- **Validation:** Pydantic
- **Server:** Uvicorn
- **Containerization:** Docker

## Planned Features

- [ ] Text preprocessing pipeline (tokenization, stopword removal, stemming)
- [ ] Trained sentiment classification model (TF-IDF + Logistic Regression baseline)
- [ ] Batch prediction endpoint for processing multiple texts at once
- [ ] Model versioning and hot-swapping
- [ ] Request logging and monitoring with structured logs
- [ ] Rate limiting and API key authentication
- [ ] Model performance metrics endpoint
- [ ] Prometheus metrics integration
- [ ] CI/CD pipeline with automated testing
- [ ] Load testing benchmarks

## API Endpoints

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | `/health`       | Health check and service status      |
| POST   | `/predict`      | Single text sentiment prediction     |
| POST   | `/predict/batch`| Batch sentiment prediction (planned) |
| GET    | `/model/info`   | Model metadata and version (planned) |
| GET    | `/metrics`      | Performance metrics (planned)        |

## Setup Instructions

### Local Development

```bash
# Clone the repository
git clone <repo-url>
cd ml-model-api

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
# Build the image
docker build -t sentiment-api .

# Run the container
docker run -p 8000:8000 sentiment-api
```

### Running Tests

```bash
pytest tests/ -v
```

## Project Structure

```
ml-model-api/
├── app/
│   ├── main.py          # FastAPI application and route definitions
│   ├── model.py         # Model loading and prediction logic
│   └── schemas.py       # Pydantic request/response schemas
├── tests/
│   └── test_api.py      # API endpoint tests
├── Dockerfile
├── requirements.txt
├── .gitignore
└── README.md
```

## License

MIT
