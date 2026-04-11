"""Rate limiter configuration.

Separated into its own module to avoid circular imports between main.py
(which configures the app and exception handlers) and the routers (which
apply per-endpoint rate limits via the @limiter.limit decorator).
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
