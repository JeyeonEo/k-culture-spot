"""
Input Sanitization and Validation Utilities.

This module provides utilities to protect against:
- XSS (Cross-Site Scripting)
- SQL Injection (when combined with ORM)
- Command Injection
- Path Traversal
- HTML Injection
"""

import html
import re
import unicodedata
from typing import Any

import bleach


# Allowed HTML tags for rich text content
ALLOWED_TAGS = [
    "a", "abbr", "acronym", "b", "blockquote", "br", "code",
    "em", "i", "li", "ol", "p", "pre", "strong", "ul",
]

# Allowed HTML attributes
ALLOWED_ATTRIBUTES = {
    "a": ["href", "title", "rel"],
    "abbr": ["title"],
    "acronym": ["title"],
}

# Allowed URL protocols
ALLOWED_PROTOCOLS = ["http", "https", "mailto"]


def sanitize_html(content: str) -> str:
    """
    Sanitize HTML content to prevent XSS attacks.

    Args:
        content: Raw HTML content

    Returns:
        Sanitized HTML with only allowed tags and attributes
    """
    if not content:
        return ""

    return bleach.clean(
        content,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
    )


def escape_html(content: str) -> str:
    """
    Escape all HTML characters to prevent XSS.

    Args:
        content: Raw content that may contain HTML

    Returns:
        Content with all HTML characters escaped
    """
    if not content:
        return ""

    return html.escape(content, quote=True)


def sanitize_string(
    value: str,
    max_length: int | None = None,
    strip_whitespace: bool = True,
    remove_control_chars: bool = True,
    normalize_unicode: bool = True,
) -> str:
    """
    General purpose string sanitization.

    Args:
        value: Input string to sanitize
        max_length: Maximum allowed length (truncate if exceeded)
        strip_whitespace: Remove leading/trailing whitespace
        remove_control_chars: Remove control characters
        normalize_unicode: Normalize Unicode characters (NFC form)

    Returns:
        Sanitized string
    """
    if not value:
        return ""

    result = value

    # Normalize Unicode to prevent homograph attacks
    if normalize_unicode:
        result = unicodedata.normalize("NFC", result)

    # Remove control characters (except newlines and tabs)
    if remove_control_chars:
        result = "".join(
            char for char in result
            if char in "\n\t" or not unicodedata.category(char).startswith("C")
        )

    # Strip whitespace
    if strip_whitespace:
        result = result.strip()

    # Truncate to max length
    if max_length and len(result) > max_length:
        result = result[:max_length]

    return result


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal attacks.

    Args:
        filename: Input filename

    Returns:
        Safe filename with dangerous characters removed
    """
    if not filename:
        return ""

    # Remove path separators and null bytes
    sanitized = filename.replace("/", "").replace("\\", "").replace("\x00", "")

    # Remove leading dots to prevent hidden files
    sanitized = sanitized.lstrip(".")

    # Remove dangerous characters
    sanitized = re.sub(r'[<>:"|?*]', "", sanitized)

    # Limit length
    if len(sanitized) > 255:
        name, ext = (
            (sanitized[:sanitized.rfind(".")], sanitized[sanitized.rfind("."):])
            if "." in sanitized
            else (sanitized, "")
        )
        sanitized = name[: 255 - len(ext)] + ext

    return sanitized or "unnamed"


def sanitize_url(url: str) -> str | None:
    """
    Sanitize and validate URL to prevent injection attacks.

    Args:
        url: Input URL

    Returns:
        Sanitized URL or None if invalid/dangerous
    """
    if not url:
        return None

    # Remove whitespace
    url = url.strip()

    # Check for dangerous protocols
    url_lower = url.lower()
    dangerous_protocols = ["javascript:", "data:", "vbscript:", "file:"]
    for protocol in dangerous_protocols:
        if url_lower.startswith(protocol):
            return None

    # Only allow http and https
    if not (url_lower.startswith("http://") or url_lower.startswith("https://")):
        # Assume https if no protocol
        if not url_lower.startswith("//"):
            url = f"https://{url}"

    return url


def sanitize_email(email: str) -> str | None:
    """
    Sanitize and validate email address.

    Args:
        email: Input email address

    Returns:
        Sanitized email or None if invalid
    """
    if not email:
        return None

    # Basic sanitization
    email = email.strip().lower()

    # Basic email pattern validation
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_pattern, email):
        return None

    return email


def sanitize_sql_identifier(identifier: str) -> str | None:
    """
    Sanitize SQL identifier (table name, column name).

    Note: Always prefer parameterized queries over this function.
    This is only for cases where you need dynamic identifiers.

    Args:
        identifier: SQL identifier to sanitize

    Returns:
        Sanitized identifier or None if invalid
    """
    if not identifier:
        return None

    # Only allow alphanumeric and underscore
    if not re.match(r"^[a-zA-Z_][a-zA-Z0-9_]*$", identifier):
        return None

    # Limit length
    if len(identifier) > 64:
        return None

    return identifier


def strip_null_bytes(value: str) -> str:
    """
    Remove null bytes from string to prevent injection attacks.

    Args:
        value: Input string

    Returns:
        String with null bytes removed
    """
    return value.replace("\x00", "") if value else ""


def sanitize_dict(
    data: dict[str, Any],
    html_fields: list[str] | None = None,
    escape_all: bool = False,
) -> dict[str, Any]:
    """
    Sanitize all string values in a dictionary.

    Args:
        data: Dictionary to sanitize
        html_fields: Fields that should allow safe HTML
        escape_all: If True, escape all HTML in non-html_fields

    Returns:
        Dictionary with sanitized values
    """
    html_fields = html_fields or []
    result = {}

    for key, value in data.items():
        if isinstance(value, str):
            if key in html_fields:
                result[key] = sanitize_html(value)
            elif escape_all:
                result[key] = escape_html(value)
            else:
                result[key] = sanitize_string(value)
        elif isinstance(value, dict):
            result[key] = sanitize_dict(value, html_fields, escape_all)
        elif isinstance(value, list):
            result[key] = [
                sanitize_dict(item, html_fields, escape_all)
                if isinstance(item, dict)
                else sanitize_string(item) if isinstance(item, str) else item
                for item in value
            ]
        else:
            result[key] = value

    return result
