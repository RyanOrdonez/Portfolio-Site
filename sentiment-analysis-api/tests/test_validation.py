"""Tests for request validation.

Input validation errors should be returned as HTTP 422 (Unprocessable Entity)
before the request ever reaches the model.
"""

from fastapi.testclient import TestClient


def test_empty_text_rejected(client: TestClient) -> None:
    response = client.post("/predict", json={"text": ""})
    assert response.status_code == 422


def test_whitespace_only_text_rejected(client: TestClient) -> None:
    response = client.post("/predict", json={"text": "   "})
    assert response.status_code == 422


def test_missing_text_field_rejected(client: TestClient) -> None:
    response = client.post("/predict", json={})
    assert response.status_code == 422


def test_non_string_text_rejected(client: TestClient) -> None:
    response = client.post("/predict", json={"text": 42})
    assert response.status_code == 422


def test_oversized_text_rejected(client: TestClient) -> None:
    response = client.post("/predict", json={"text": "a" * 10000})
    assert response.status_code == 422


def test_empty_batch_rejected(client: TestClient) -> None:
    response = client.post("/predict/batch", json={"texts": []})
    assert response.status_code == 422


def test_oversized_batch_rejected(client: TestClient) -> None:
    response = client.post(
        "/predict/batch",
        json={"texts": ["ok"] * 100},
    )
    assert response.status_code == 422
