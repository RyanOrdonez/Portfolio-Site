"""Tests for /predict and /predict/batch endpoints."""

from fastapi.testclient import TestClient


def test_predict_positive(client: TestClient) -> None:
    response = client.post(
        "/predict",
        json={"text": "I absolutely loved this movie, it was phenomenal."},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["label"] == "POSITIVE"
    assert 0.8 <= payload["score"] <= 1.0
    assert payload["request_id"]
    assert payload["latency_ms"] >= 0


def test_predict_negative(client: TestClient) -> None:
    response = client.post(
        "/predict",
        json={"text": "This was the worst experience of my life. Terrible."},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["label"] == "NEGATIVE"
    assert 0.8 <= payload["score"] <= 1.0


def test_predict_batch(client: TestClient) -> None:
    response = client.post(
        "/predict/batch",
        json={
            "texts": [
                "This product is amazing.",
                "Worst experience of my life.",
                "Highly recommend, five stars.",
            ]
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["count"] == 3
    assert len(payload["predictions"]) == 3
    assert payload["predictions"][0]["label"] == "POSITIVE"
    assert payload["predictions"][1]["label"] == "NEGATIVE"
    assert payload["predictions"][2]["label"] == "POSITIVE"


def test_predict_batch_matches_single(client: TestClient) -> None:
    """Batched and single predictions should agree on label for the same input."""
    text = "An utterly delightful experience from start to finish."
    single = client.post("/predict", json={"text": text}).json()
    batch = client.post("/predict/batch", json={"texts": [text]}).json()
    assert single["label"] == batch["predictions"][0]["label"]
