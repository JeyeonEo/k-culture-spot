"""HTTP exception helpers for standardized error responses."""

from typing import Any, Optional
from fastapi import HTTPException, status


def raise_not_found(
    entity_name: str,
    entity_id: Optional[int | str] = None,
    detail: Optional[str] = None,
) -> None:
    """
    Raise HTTP 404 Not Found exception.

    Args:
        entity_name: Name of the entity (e.g., "Spot", "Tour")
        entity_id: Optional ID of the entity
        detail: Optional custom detail message

    Raises:
        HTTPException: 404 Not Found
    """
    if detail:
        message = detail
    elif entity_id is not None:
        message = f"{entity_name} with id {entity_id} not found"
    else:
        message = f"{entity_name} not found"

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=message,
    )


def raise_bad_request(
    detail: str = "Bad request",
    headers: Optional[dict[str, str]] = None,
) -> None:
    """
    Raise HTTP 400 Bad Request exception.

    Args:
        detail: Error detail message
        headers: Optional response headers

    Raises:
        HTTPException: 400 Bad Request
    """
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=detail,
        headers=headers,
    )


def raise_unauthorized(
    detail: str = "Not authenticated",
    headers: Optional[dict[str, str]] = None,
) -> None:
    """
    Raise HTTP 401 Unauthorized exception.

    Args:
        detail: Error detail message
        headers: Optional response headers (e.g., WWW-Authenticate)

    Raises:
        HTTPException: 401 Unauthorized
    """
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers=headers or {"WWW-Authenticate": "Bearer"},
    )


def raise_forbidden(
    detail: str = "Not enough permissions",
) -> None:
    """
    Raise HTTP 403 Forbidden exception.

    Args:
        detail: Error detail message

    Raises:
        HTTPException: 403 Forbidden
    """
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=detail,
    )


def raise_conflict(
    detail: str = "Resource already exists",
) -> None:
    """
    Raise HTTP 409 Conflict exception.

    Args:
        detail: Error detail message

    Raises:
        HTTPException: 409 Conflict
    """
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=detail,
    )


def raise_validation_error(
    detail: str | list[dict[str, Any]] = "Validation error",
) -> None:
    """
    Raise HTTP 422 Unprocessable Entity exception.

    Args:
        detail: Error detail message or list of validation errors

    Raises:
        HTTPException: 422 Unprocessable Entity
    """
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=detail,
    )


def raise_internal_error(
    detail: str = "Internal server error",
) -> None:
    """
    Raise HTTP 500 Internal Server Error exception.

    Args:
        detail: Error detail message

    Raises:
        HTTPException: 500 Internal Server Error
    """
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=detail,
    )


def check_not_found(
    item: Any,
    entity_name: str,
    entity_id: Optional[int | str] = None,
) -> None:
    """
    Check if item exists, raise 404 if not.

    Args:
        item: Item to check (None means not found)
        entity_name: Name of the entity for error message
        entity_id: Optional ID for error message

    Raises:
        HTTPException: 404 if item is None
    """
    if item is None:
        raise_not_found(entity_name, entity_id)


def ensure_found(
    item: Any,
    entity_name: str,
    entity_id: Optional[int | str] = None,
) -> Any:
    """
    Ensure item exists, return it or raise 404.

    Args:
        item: Item to check
        entity_name: Name of the entity for error message
        entity_id: Optional ID for error message

    Returns:
        The item if it exists

    Raises:
        HTTPException: 404 if item is None
    """
    check_not_found(item, entity_name, entity_id)
    return item
