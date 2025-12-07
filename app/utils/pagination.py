"""Pagination utilities for API responses."""

from math import ceil
from typing import TypeVar, Generic, Sequence, Callable, Any
from pydantic import BaseModel


T = TypeVar("T")


class PaginationParams(BaseModel):
    """Standard pagination parameters."""

    page: int = 1
    page_size: int = 20

    @property
    def offset(self) -> int:
        """Calculate offset for database query."""
        return (self.page - 1) * self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response schema."""

    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


def calculate_total_pages(total: int, page_size: int) -> int:
    """
    Calculate total number of pages.

    Args:
        total: Total number of items
        page_size: Items per page

    Returns:
        Total number of pages (minimum 0)
    """
    if total <= 0 or page_size <= 0:
        return 0
    return ceil(total / page_size)


def build_paginated_response(
    items: Sequence[Any],
    total: int,
    page: int,
    page_size: int,
    item_transformer: Callable[[Any], Any] | None = None,
) -> dict:
    """
    Build a standardized paginated response dictionary.

    Args:
        items: List of items for current page
        total: Total count of all items
        page: Current page number
        page_size: Items per page
        item_transformer: Optional function to transform each item

    Returns:
        Dictionary with pagination info and items

    Example:
        response = build_paginated_response(
            items=spots,
            total=100,
            page=1,
            page_size=20,
            item_transformer=lambda x: SpotResponse.model_validate(x)
        )
    """
    transformed_items = items
    if item_transformer:
        transformed_items = [item_transformer(item) for item in items]

    return {
        "items": transformed_items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": calculate_total_pages(total, page_size),
    }


def paginate_list(
    items: Sequence[T],
    page: int,
    page_size: int,
) -> tuple[Sequence[T], int]:
    """
    Paginate an in-memory list.

    Useful for paginating results that are already loaded in memory.

    Args:
        items: Full list of items
        page: Page number (1-indexed)
        page_size: Items per page

    Returns:
        Tuple of (paginated items, total count)
    """
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return items[start:end], total


class Paginator:
    """
    Pagination helper class for consistent pagination handling.

    Usage:
        paginator = Paginator(page=1, page_size=20)

        # In your query
        stmt = stmt.offset(paginator.offset).limit(paginator.limit)

        # Build response
        response = paginator.build_response(
            items=results,
            total=total_count,
            items_key="spots"
        )
    """

    def __init__(self, page: int = 1, page_size: int = 20):
        """
        Initialize paginator.

        Args:
            page: Page number (1-indexed)
            page_size: Items per page
        """
        self.page = max(1, page)
        self.page_size = max(1, min(page_size, 100))  # Cap at 100

    @property
    def offset(self) -> int:
        """Calculate SQL offset."""
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Get SQL limit (same as page_size)."""
        return self.page_size

    def total_pages(self, total: int) -> int:
        """Calculate total pages for given total count."""
        return calculate_total_pages(total, self.page_size)

    def build_response(
        self,
        items: Sequence[Any],
        total: int,
        items_key: str = "items",
        item_transformer: Callable[[Any], Any] | None = None,
    ) -> dict:
        """
        Build paginated response dictionary.

        Args:
            items: Items for current page
            total: Total count of all items
            items_key: Key name for items in response
            item_transformer: Optional function to transform items

        Returns:
            Response dictionary with pagination metadata
        """
        transformed = items
        if item_transformer:
            transformed = [item_transformer(item) for item in items]

        return {
            items_key: transformed,
            "total": total,
            "page": self.page,
            "page_size": self.page_size,
            "total_pages": self.total_pages(total),
        }
