"""
Security Headers Middleware.

This module implements security headers to protect against:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Information disclosure
- Protocol downgrade attacks
"""

from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.

    Implements OWASP recommended security headers.
    """

    # Security headers configuration
    SECURITY_HEADERS = {
        # Prevent XSS attacks by enabling browser's XSS filter
        "X-XSS-Protection": "1; mode=block",
        # Prevent MIME type sniffing
        "X-Content-Type-Options": "nosniff",
        # Prevent clickjacking attacks
        "X-Frame-Options": "DENY",
        # Control referrer information leakage
        "Referrer-Policy": "strict-origin-when-cross-origin",
        # Disable browser features that could be exploited
        "Permissions-Policy": (
            "accelerometer=(), "
            "ambient-light-sensor=(), "
            "autoplay=(), "
            "battery=(), "
            "camera=(), "
            "cross-origin-isolated=(), "
            "display-capture=(), "
            "document-domain=(), "
            "encrypted-media=(), "
            "execution-while-not-rendered=(), "
            "execution-while-out-of-viewport=(), "
            "fullscreen=(), "
            "geolocation=(), "
            "gyroscope=(), "
            "keyboard-map=(), "
            "magnetometer=(), "
            "microphone=(), "
            "midi=(), "
            "navigation-override=(), "
            "payment=(), "
            "picture-in-picture=(), "
            "publickey-credentials-get=(), "
            "screen-wake-lock=(), "
            "sync-xhr=(), "
            "usb=(), "
            "web-share=(), "
            "xr-spatial-tracking=()"
        ),
        # Prevent caching of sensitive data
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    # Content Security Policy - Adjust based on your needs
    CSP_DIRECTIVES = {
        "default-src": "'self'",
        "script-src": "'self'",
        "style-src": "'self' 'unsafe-inline'",  # Allow inline styles if needed
        "img-src": "'self' data: https:",
        "font-src": "'self'",
        "connect-src": "'self'",
        "frame-ancestors": "'none'",
        "form-action": "'self'",
        "base-uri": "'self'",
        "object-src": "'none'",
        "upgrade-insecure-requests": "",
    }

    def __init__(self, app, enable_hsts: bool = True, hsts_max_age: int = 31536000):
        """
        Initialize the security headers middleware.

        Args:
            app: The FastAPI application
            enable_hsts: Whether to enable HSTS (use in production with HTTPS)
            hsts_max_age: Max age for HSTS in seconds (default: 1 year)
        """
        super().__init__(app)
        self.enable_hsts = enable_hsts
        self.hsts_max_age = hsts_max_age

    def _build_csp_header(self) -> str:
        """Build the Content-Security-Policy header value."""
        directives = []
        for directive, value in self.CSP_DIRECTIVES.items():
            if value:
                directives.append(f"{directive} {value}")
            else:
                directives.append(directive)
        return "; ".join(directives)

    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        """Process the request and add security headers to response."""
        response = await call_next(request)

        # Add all security headers
        for header, value in self.SECURITY_HEADERS.items():
            response.headers[header] = value

        # Add Content-Security-Policy
        response.headers["Content-Security-Policy"] = self._build_csp_header()

        # Add HSTS header (only enable in production with HTTPS)
        if self.enable_hsts:
            response.headers["Strict-Transport-Security"] = (
                f"max-age={self.hsts_max_age}; includeSubDomains; preload"
            )

        # Remove potentially dangerous headers
        headers_to_remove = ["Server", "X-Powered-By", "X-AspNet-Version"]
        for header in headers_to_remove:
            if header in response.headers:
                del response.headers[header]

        return response


class TrustedHostMiddleware(BaseHTTPMiddleware):
    """
    Middleware to validate the Host header.

    Protects against:
    - Host header injection attacks
    - Cache poisoning
    - Password reset poisoning
    """

    def __init__(self, app, allowed_hosts: list[str] | None = None):
        """
        Initialize the trusted host middleware.

        Args:
            app: The FastAPI application
            allowed_hosts: List of allowed host names
        """
        super().__init__(app)
        self.allowed_hosts = allowed_hosts or ["localhost", "127.0.0.1"]

    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        """Validate the Host header before processing."""
        host = request.headers.get("host", "").split(":")[0]

        # Allow wildcard for development
        if "*" in self.allowed_hosts:
            return await call_next(request)

        if host not in self.allowed_hosts:
            return Response(
                content='{"detail": "Invalid host header"}',
                status_code=400,
                media_type="application/json",
            )

        return await call_next(request)
