"""
Security Utilities for Authentication and Cryptography.

This module provides:
- Password hashing and verification
- JWT token generation and validation
- Secure random token generation
"""

import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing context using bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=settings.security.password_hash_rounds,
)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Stored password hash

    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT access token.

    Args:
        data: Data to encode in the token
        expires_delta: Custom expiration time

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.security.jwt_access_token_expire_minutes
        )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(UTC),
        "type": "access",
    })

    return jwt.encode(
        to_encode,
        settings.security.secret_key,
        algorithm=settings.security.jwt_algorithm,
    )


def create_refresh_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT refresh token.

    Args:
        data: Data to encode in the token
        expires_delta: Custom expiration time

    Returns:
        Encoded JWT refresh token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            days=settings.security.jwt_refresh_token_expire_days
        )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(UTC),
        "type": "refresh",
    })

    return jwt.encode(
        to_encode,
        settings.security.secret_key,
        algorithm=settings.security.jwt_algorithm,
    )


def decode_token(token: str) -> dict[str, Any] | None:
    """
    Decode and validate a JWT token.

    Args:
        token: JWT token to decode

    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.security.secret_key,
            algorithms=[settings.security.jwt_algorithm],
        )
        return payload
    except JWTError:
        return None


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token.

    Args:
        length: Length of the token in bytes

    Returns:
        URL-safe base64 encoded token
    """
    return secrets.token_urlsafe(length)


def generate_password_reset_token() -> str:
    """Generate a secure token for password reset."""
    return generate_secure_token(32)


def generate_email_verification_token() -> str:
    """Generate a secure token for email verification."""
    return generate_secure_token(32)


def constant_time_compare(val1: str, val2: str) -> bool:
    """
    Compare two strings in constant time to prevent timing attacks.

    Args:
        val1: First string
        val2: Second string

    Returns:
        True if strings are equal, False otherwise
    """
    return secrets.compare_digest(val1.encode(), val2.encode())
