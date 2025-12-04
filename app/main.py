"""
K-Culture-Spot Main Application.

This is the main entry point for the FastAPI application with
comprehensive security measures implemented.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import init_db
from app.api import api_router
from app.middleware.cors import configure_cors, CORSConfig
from app.middleware.rate_limiter import (
    limiter,
    rate_limit_exceeded_handler,
)
from app.middleware.security_headers import (
    SecurityHeadersMiddleware,
    TrustedHostMiddleware,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Application lifespan manager.

    Handles startup and shutdown events.
    """
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Environment: {settings.environment}")
    print(f"Debug mode: {settings.debug}")
    
    # Initialize database
    await init_db()

    yield

    # Shutdown
    print("Shutting down application...")


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Korean Culture Discovery and Exploration API",
        lifespan=lifespan,
        # Security: Disable docs in production
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
        openapi_url="/openapi.json" if settings.is_development else None,
    )

    # ===========================================
    # SECURITY MIDDLEWARE SETUP
    # ===========================================

    # 1. Rate Limiting (DDoS Protection)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

    # 2. Trusted Host Middleware (Host Header Injection Protection)
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.security.allowed_hosts
        if settings.is_production
        else ["*"],
    )

    # 3. Security Headers Middleware
    app.add_middleware(
        SecurityHeadersMiddleware,
        enable_hsts=settings.security.enable_hsts and settings.is_production,
        hsts_max_age=settings.security.hsts_max_age,
    )

    # 4. CORS Configuration
    if settings.is_development:
        cors_config = CORSConfig.for_development()
    else:
        cors_config = CORSConfig.for_production(settings.security.cors_origins)
    configure_cors(app, **cors_config.as_dict())

    # ===========================================
    # EXCEPTION HANDLERS
    # ===========================================

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """
        Global exception handler.

        Prevents information leakage in production.
        """
        if settings.is_development:
            return JSONResponse(
                status_code=500,
                content={
                    "detail": str(exc),
                    "type": type(exc).__name__,
                },
            )

        # In production, don't leak internal error details
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )

    # ===========================================
    # HEALTH CHECK ENDPOINTS
    # ===========================================

    @app.get("/health", tags=["Health"])
    async def health_check():
        """Basic health check endpoint."""
        return {"status": "healthy", "version": settings.app_version}

    @app.get("/healthz", tags=["Health"])
    async def kubernetes_health_check():
        """Kubernetes-style health check endpoint."""
        return {"status": "ok"}

    @app.get("/ready", tags=["Health"])
    async def readiness_check():
        """
        Readiness check endpoint.

        TODO: Add database and Redis connectivity checks.
        """
        return {
            "status": "ready",
            "checks": {
                "database": "ok",  # TODO: Implement actual check
                "redis": "ok",  # TODO: Implement actual check
            },
        }

    # ===========================================
    # API ROUTES
    # ===========================================

    @app.get("/", tags=["Root"])
    async def root():
        """Root endpoint."""
        return {
            "message": f"Welcome to {settings.app_name}",
            "version": settings.app_version,
            "docs": "/docs" if settings.is_development else "Disabled in production",
        }

    # Register API routers
    app.include_router(api_router)

    return app


# Create application instance
app = create_application()
