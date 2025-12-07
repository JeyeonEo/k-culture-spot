"""Search filter builder utilities for SQLAlchemy queries."""

from typing import Any, Optional, Type
from sqlalchemy import or_
from sqlalchemy.orm import InstrumentedAttribute

from app.core.database import Base


class SearchFilterBuilder:
    """
    Builder for creating SQLAlchemy search filters.

    Supports building OR-based search filters for multiple fields
    with support for ILIKE text matching and ARRAY field searches.

    Usage:
        builder = SearchFilterBuilder(MyModel)
        filter = builder.build_filter(
            query="search term",
            fields=["name", "name_en", "description", "tags"]
        )
        stmt = stmt.where(filter)
    """

    def __init__(self, model: Type[Base]):
        """
        Initialize with SQLAlchemy model class.

        Args:
            model: SQLAlchemy model class to build filters for
        """
        self.model = model

    def _get_field(self, field_name: str) -> InstrumentedAttribute:
        """Get model attribute by name."""
        return getattr(self.model, field_name)

    def _is_array_field(self, field: InstrumentedAttribute) -> bool:
        """Check if field is an ARRAY type."""
        return hasattr(field.type, 'item_type')

    def build_filter(
        self,
        query: str,
        fields: list[str],
    ) -> Optional[Any]:
        """
        Build OR filter for searching across multiple fields.

        Args:
            query: Search query string
            fields: List of field names to search

        Returns:
            SQLAlchemy OR filter or None if no fields/query
        """
        if not query or not fields:
            return None

        filters = []
        for field_name in fields:
            if not hasattr(self.model, field_name):
                continue

            field = self._get_field(field_name)

            if self._is_array_field(field):
                # For ARRAY fields (like tags), use .any()
                filters.append(field.any(query))
            else:
                # For text fields, use ILIKE for case-insensitive search
                filters.append(field.ilike(f"%{query}%"))

        return or_(*filters) if filters else None

    def build_multilingual_filter(
        self,
        query: str,
        base_field: str,
        languages: list[str] = ["en", "ja", "zh"],
        include_description: bool = True,
    ) -> Optional[Any]:
        """
        Build filter for multilingual fields.

        Automatically includes base field and all language variants.

        Args:
            query: Search query string
            base_field: Base field name (e.g., "name" or "title")
            languages: Language suffixes to include
            include_description: Whether to include description fields

        Returns:
            SQLAlchemy OR filter
        """
        fields = [base_field]

        # Add language variants for main field
        for lang in languages:
            field_name = f"{base_field}_{lang}"
            if hasattr(self.model, field_name):
                fields.append(field_name)

        # Add description fields if requested
        if include_description:
            if hasattr(self.model, "description"):
                fields.append("description")
                for lang in languages:
                    desc_field = f"description_{lang}"
                    if hasattr(self.model, desc_field):
                        fields.append(desc_field)

        # Add tags if model has it
        if hasattr(self.model, "tags"):
            fields.append("tags")

        return self.build_filter(query, fields)


def build_search_filter(
    model: Type[Base],
    query: str,
    fields: list[str],
) -> Optional[Any]:
    """
    Convenience function to build search filter.

    Args:
        model: SQLAlchemy model class
        query: Search query string
        fields: List of field names to search

    Returns:
        SQLAlchemy OR filter or None
    """
    return SearchFilterBuilder(model).build_filter(query, fields)


def build_multilingual_search_filter(
    model: Type[Base],
    query: str,
    base_field: str = "name",
    include_description: bool = True,
) -> Optional[Any]:
    """
    Convenience function to build multilingual search filter.

    Args:
        model: SQLAlchemy model class
        query: Search query string
        base_field: Base field name (e.g., "name" or "title")
        include_description: Whether to include description fields

    Returns:
        SQLAlchemy OR filter or None
    """
    return SearchFilterBuilder(model).build_multilingual_filter(
        query=query,
        base_field=base_field,
        include_description=include_description,
    )
