"""Tests for /health and /model endpoints."""

from fastapi.testclient import TestClient


def test_health_returns_ok(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["model_loaded"] is True
    assert payload["model_name"]
    assert payload["version"]


def test_model_info_returns_labels(client: TestClient) -> None:
    response = client.get("/model")
    assert response.status_code == 200
    payload = response.json()
    assert payload["name"]
    assert payload["revision"]
    assert isinstance(payload["labels"], list)
    assert len(payload["labels"]) >= 2
    assert payload["device"]
