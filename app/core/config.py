"""
Application Configuration with Security Settings.

This module manages all application settings with:
- Environment-based configuration
- Secure defaults
- Type validation using Pydantic
"""

import secrets
from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class SecuritySettings(BaseSettings):
    """Security-specific settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        json_schema_extra={
            "cors_origins": {"json_schema_extra": {"json_encoders": {list: lambda v: v}}}
        },
    )

    # Secret key for JWT and session management
    secret_key: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        description="Secret key for cryptographic operations",
    )

    # JWT settings
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    # Password hashing
    password_hash_rounds: int = 12

    # Rate limiting
    rate_limit_per_minute: int = 100
    rate_limit_burst: int = 20

    # CORS
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:8080"]
    )
    cors_allow_credentials: bool = True

    # Security headers
    enable_hsts: bool = True
    hsts_max_age: int = 31536000  # 1 year

    # Trusted hosts
    allowed_hosts: list[str] = Field(default=["localhost", "127.0.0.1"])
    
    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from environment variable."""
        if v is None:
            return ["http://localhost:3000", "http://localhost:8080"]  # Return default instead of None
        if isinstance(v, str):
            if not v.strip():
                return ["http://localhost:3000", "http://localhost:8080"]  # Return default instead of None
            # Try JSON parsing first
            import json
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, ValueError):
                pass
            # Fallback to comma-separated values
            origins = [origin.strip() for origin in v.split(",") if origin.strip()]
            return origins if origins else ["http://localhost:3000", "http://localhost:8080"]
        if isinstance(v, list):
            return v
        # If we can't parse it, return default
        return ["http://localhost:3000", "http://localhost:8080"]
    
    @field_validator("allowed_hosts", mode="before")
    @classmethod
    def parse_allowed_hosts(cls, v):
        """Parse allowed hosts from environment variable."""
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [host.strip() for host in v.split(",") if host.strip()]
        return v

    @field_validator("secret_key")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        """Ensure secret key is strong enough."""
        if len(v) < 32:
            raise ValueError("Secret key must be at least 32 characters")
        return v


class DatabaseSettings(BaseSettings):
    """Database connection settings."""

    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/k_culture_spot",
        description="Database connection URL",
    )

    # Connection pool settings
    pool_size: int = 5
    max_overflow: int = 10
    pool_timeout: int = 30
    pool_recycle: int = 1800  # 30 minutes

    # Security settings
    echo_sql: bool = False  # Never log SQL in production


class RedisSettings(BaseSettings):
    """Redis connection settings."""

    redis_url: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL",
    )

    # Rate limiter database
    rate_limit_redis_db: int = 1

    # Session database
    session_redis_db: int = 2


class TourismAPISettings(BaseSettings):
    """Korea Tourism Organization API settings."""

    tour_api_key: str = Field(
        default="",
        description="Korea Tourism Organization API key",
    )
    tour_api_base_url: str = Field(
        default="http://apis.data.go.kr/B551011/KorService1",
        description="Korea Tourism Organization API base URL",
    )


class Settings(BaseSettings):
    """Main application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "K-Culture-Spot"
    app_version: str = "0.1.0"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Security
    security: SecuritySettings = Field(default_factory=SecuritySettings)

    # Database
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)

    # Redis
    redis: RedisSettings = Field(default_factory=RedisSettings)

    # Tourism API
    tourism: TourismAPISettings = Field(default_factory=TourismAPISettings)

    # Logging
    log_level: str = "INFO"
    log_format: str = "json"  # json or text

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment == "production"

    @field_validator("debug")
    @classmethod
    def validate_debug(cls, v: bool, info) -> bool:
        """Ensure debug is disabled in production."""
        # Note: This validator runs before environment is set,
        # so we check via environment variable directly
        import os
        env = os.getenv("ENVIRONMENT", "development")
        if env == "production" and v:
            raise ValueError("Debug mode cannot be enabled in production")
        return v


@lru_cache
def get_settings() -> Settings:
    """
    Get cached application settings.

    Uses LRU cache to prevent repeated environment parsing.
    """
    return Settings()


# Singleton instance
settings = get_settings()
