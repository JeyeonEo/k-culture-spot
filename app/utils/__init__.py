"""Utilities module for helper functions."""

from app.utils.pagination import (
    PaginationParams,
    PaginatedResponse,
    Paginator,
    calculate_total_pages,
    build_paginated_response,
    paginate_list,
)
from app.utils.search import (
    SearchFilterBuilder,
    build_search_filter,
    build_multilingual_search_filter,
)
from app.utils.exceptions import (
    raise_not_found,
    raise_bad_request,
    raise_unauthorized,
    raise_forbidden,
    raise_conflict,
    raise_validation_error,
    raise_internal_error,
    check_not_found,
    ensure_found,
)

__all__ = [
    # Pagination
    "PaginationParams",
    "PaginatedResponse",
    "Paginator",
    "calculate_total_pages",
    "build_paginated_response",
    "paginate_list",
    # Search
    "SearchFilterBuilder",
    "build_search_filter",
    "build_multilingual_search_filter",
    # Exceptions
    "raise_not_found",
    "raise_bad_request",
    "raise_unauthorized",
    "raise_forbidden",
    "raise_conflict",
    "raise_validation_error",
    "raise_internal_error",
    "check_not_found",
    "ensure_found",
]
