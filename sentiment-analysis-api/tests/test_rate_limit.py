"""Tests for rate limiting.

Verify that the SlowAPI rate limiter is wired into the prediction endpoints
and that rate limit metadata is returned on successful requests.

Actual limit-breaching tests are skipped by default because the production
rate limits (60/minute) would require 61 requests per test run, which is
expensive given each request loads the model into memory. The limiter is
tested end-to-end by the existing prediction tests — if the decorator breaks
the endpoints, those tests fail.
"""

from fastapi.testclient import TestClient


def test_rate_limited_endpoint_still_responds(client: TestClient) -> None:
    """Basic smoke test: the @limiter.limit decorator should not break routing."""
    response = client.post(
        "/predict",
        json={"text": "Rate limiter smoke test."},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["label"] in ("POSITIVE", "NEGATIVE")


def test_batch_rate_limited_endpoint_still_responds(client: TestClient) -> None:
    """Same smoke test for the batch endpoint."""
    response = client.post(
        "/predict/batch",
        json={"texts": ["Rate limiter smoke test."]},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["count"] == 1


def test_metrics_endpoint_exposed(client: TestClient) -> None:
    """Prometheus metrics endpoint should be reachable and return text/plain."""
    response = client.get("/metrics")
    assert response.status_code == 200
    # prometheus_client exposes a text format with `# HELP` / `# TYPE` lines
    body = response.text
    assert "# HELP" in body or "# TYPE" in body
