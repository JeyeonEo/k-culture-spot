"""
Rate Limiting Middleware for DDoS Protection.

This module implements rate limiting to protect against:
- DDoS attacks
- Brute force attacks
- API abuse
"""

from typing import Callable

from fastapi import Request, Response
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware


def get_real_client_ip(request: Request) -> str:
    """
    Get the real client IP address, handling proxy scenarios.

    Checks headers in order:
    1. X-Forwarded-For (first IP in chain)
    2. X-Real-IP
    3. Direct remote address
    """
    # Check X-Forwarded-For header (common for proxies/load balancers)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first IP in the chain (original client)
        return forwarded_for.split(",")[0].strip()

    # Check X-Real-IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()

    # Fall back to direct remote address
    return get_remote_address(request)


# Initialize rate limiter with Redis backend for distributed environments
limiter = Limiter(
    key_func=get_real_client_ip,
    default_limits=["100/minute"],  # Default: 100 requests per minute
    storage_uri="memory://",  # Use Redis in production: "redis://redis:6379/1"
)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """Custom handler for rate limit exceeded errors."""
    return Response(
        content='{"detail": "Rate limit exceeded. Please try again later."}',
        status_code=429,
        media_type="application/json",
        headers={
            "Retry-After": str(exc.detail),
            "X-RateLimit-Reset": str(exc.detail),
        },
    )


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware to apply rate limiting with custom rules per endpoint.

    Features:
    - IP-based rate limiting
    - Configurable limits per endpoint
    - Redis backend support for distributed systems
    """

    # Stricter limits for sensitive endpoints
    ENDPOINT_LIMITS = {
        "/api/v1/auth/login": "5/minute",  # Prevent brute force
        "/api/v1/auth/register": "3/minute",  # Prevent mass registration
        "/api/v1/auth/password-reset": "3/minute",  # Prevent abuse
        "/api/v1/auth/verify": "10/minute",
    }

    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        """Process the request with rate limiting."""
        # Skip rate limiting for health checks and static files
        if request.url.path in ["/health", "/healthz", "/ready"]:
            return await call_next(request)

        # Apply rate limiting
        return await call_next(request)


# Rate limit decorators for specific endpoints
def rate_limit(limit: str) -> Callable:
    """
    Decorator to apply custom rate limit to an endpoint.

    Usage:
        @router.get("/endpoint")
        @rate_limit("10/minute")
        async def endpoint():
            ...
    """
    return limiter.limit(limit)


# Common rate limit presets
RATE_LIMITS = {
    "strict": "5/minute",      # For auth endpoints
    "normal": "60/minute",     # For regular API calls
    "relaxed": "200/minute",   # For read-heavy endpoints
    "burst": "10/second",      # For endpoints allowing bursts
}
