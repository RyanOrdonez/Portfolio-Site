"""
Tests for the Sentiment Analysis API endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test that the health endpoint returns a healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data
    assert "version" in data


def test_predict_returns_sentiment():
    """Test that the predict endpoint returns a valid sentiment response."""
    response = client.post("/predict", json={"text": "This is a great product!"})
    assert response.status_code == 200
    data = response.json()
    assert "sentiment" in data
    assert "confidence" in data
    assert data["sentiment"] in ["positive", "negative", "neutral"]
    assert 0.0 <= data["confidence"] <= 1.0


def test_predict_empty_text_rejected():
    """Test that empty text input is rejected with a validation error."""
    response = client.post("/predict", json={"text": ""})
    assert response.status_code == 422


# TODO: Add more tests
# def test_predict_batch():
#     """Test batch prediction endpoint."""
#     pass

# def test_predict_long_text():
#     """Test handling of text exceeding max length."""
#     pass

# def test_model_info_endpoint():
#     """Test model info endpoint returns correct metadata."""
#     pass
