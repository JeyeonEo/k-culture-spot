"""
CORS (Cross-Origin Resource Sharing) Configuration.

This module configures CORS to:
- Restrict cross-origin requests to allowed domains
- Prevent unauthorized API access from malicious websites
- Control which HTTP methods and headers are allowed
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def configure_cors(
    app: FastAPI,
    allowed_origins: list[str] | None = None,
    allow_credentials: bool = True,
    max_age: int = 600,
) -> None:
    """
    Configure CORS middleware for the FastAPI application.

    Args:
        app: The FastAPI application instance
        allowed_origins: List of allowed origins (domains)
        allow_credentials: Whether to allow credentials (cookies, auth headers)
        max_age: How long browsers should cache preflight responses (seconds)

    Security considerations:
    - Never use ["*"] in production with credentials
    - Always specify exact origins in production
    - Be restrictive with allowed methods and headers
    """
    # Default to restrictive settings
    if allowed_origins is None:
        allowed_origins = [
            "http://localhost:3000",  # React dev server
            "http://localhost:8080",  # Vue dev server
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8080",
        ]

    # Allowed HTTP methods (be restrictive)
    allowed_methods = [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ]

    # Allowed headers (be restrictive)
    allowed_headers = [
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-CSRF-Token",
    ]

    # Headers exposed to the browser
    expose_headers = [
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
        "X-Request-ID",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=allow_credentials,
        allow_methods=allowed_methods,
        allow_headers=allowed_headers,
        expose_headers=expose_headers,
        max_age=max_age,
    )


class CORSConfig:
    """
    CORS configuration class for different environments.

    Usage:
        config = CORSConfig.for_environment("production")
        configure_cors(app, **config.as_dict())
    """

    def __init__(
        self,
        allowed_origins: list[str],
        allow_credentials: bool = True,
        max_age: int = 600,
    ):
        self.allowed_origins = allowed_origins
        self.allow_credentials = allow_credentials
        self.max_age = max_age

    def as_dict(self) -> dict:
        """Return configuration as dictionary."""
        return {
            "allowed_origins": self.allowed_origins,
            "allow_credentials": self.allow_credentials,
            "max_age": self.max_age,
        }

    @classmethod
    def for_development(cls) -> "CORSConfig":
        """Create CORS config for development environment."""
        return cls(
            allowed_origins=[
                "http://localhost:3000",
                "http://localhost:8080",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:8080",
            ],
            allow_credentials=True,
            max_age=600,
        )

    @classmethod
    def for_production(cls, origins: list[str]) -> "CORSConfig":
        """
        Create CORS config for production environment.

        Args:
            origins: List of allowed production origins
        """
        if not origins:
            raise ValueError("Production CORS requires explicit origins")

        return cls(
            allowed_origins=origins,
            allow_credentials=True,
            max_age=3600,  # Longer cache in production
        )

    @classmethod
    def for_environment(
        cls, env: str, production_origins: list[str] | None = None
    ) -> "CORSConfig":
        """
        Create CORS config based on environment name.

        Args:
            env: Environment name (development, staging, production)
            production_origins: Required for production environment
        """
        if env == "development":
            return cls.for_development()
        elif env in ("staging", "production"):
            if not production_origins:
                raise ValueError(f"{env} environment requires explicit origins")
            return cls.for_production(production_origins)
        else:
            # Default to restrictive settings
            return cls(allowed_origins=[], allow_credentials=False)
