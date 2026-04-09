"""Shared pytest fixtures.

The ``client`` fixture loads the FastAPI app (and therefore the model) exactly
once per test session. Subsequent tests reuse the same in-process server.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    with TestClient(app) as c:
        yield c
