"""
Tests for the Sentiment Analysis API endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# --- Health Check ---

def test_health_check():
    """Test that the health endpoint returns a healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert "version" in data


# --- Single Prediction ---

def test_predict_positive_sentiment():
    """Test that clearly positive text returns positive sentiment."""
    response = client.post("/predict", json={"text": "This is a great product! I love it!"})
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] == "positive"
    assert data["confidence"] > 0.5
    assert data["text"] == "This is a great product! I love it!"


def test_predict_negative_sentiment():
    """Test that clearly negative text returns negative sentiment."""
    response = client.post("/predict", json={"text": "Terrible experience, worst purchase ever."})
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] == "negative"
    assert data["confidence"] > 0.5


def test_predict_returns_valid_structure():
    """Test that predict endpoint returns all required fields."""
    response = client.post("/predict", json={"text": "The item arrived on time."})
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert "text" in data
    assert data["sentiment"] in ["positive", "negative", "neutral"]
    assert 0.0 <= data["confidence"] <= 1.0


def test_predict_empty_text_rejected():
    """Test that empty text input is rejected with a validation error."""
    response = client.post("/predict", json={"text": ""})
    assert response.status_code == 422


def test_predict_long_text_rejected():
    """Test that text exceeding max length is rejected."""
    response = client.post("/predict", json={"text": "x" * 5001})
    assert response.status_code == 422


# --- Batch Prediction ---

def test_predict_batch():
    """Test that batch prediction returns correct number of results."""
    texts = [
        "Absolutely love this!",
        "Terrible, would not recommend.",
        "It was fine, nothing special.",
    ]
    response = client.post("/predict/batch", json={"texts": texts})
    assert response.status_code == 200
    data = response.json()
    assert len(data["predictions"]) == 3
    for pred in data["predictions"]:
        assert pred["sentiment"] in ["positive", "negative", "neutral"]
        assert 0.0 <= pred["confidence"] <= 1.0


def test_predict_batch_empty_rejected():
    """Test that an empty batch is rejected."""
    response = client.post("/predict/batch", json={"texts": []})
    assert response.status_code == 422


# --- Model Info ---

def test_model_info():
    """Test that model info endpoint returns correct metadata."""
    response = client.get("/model/info")
    assert response.status_code == 200
    data = response.json()
    assert data["model_type"] == "TF-IDF + Logistic Regression"
    assert data["is_loaded"] is True
    assert "positive" in data["labels"]
    assert "negative" in data["labels"]
    assert "neutral" in data["labels"]
    assert data["training_samples"] > 0
    assert data["version"] == "1.0.0"
