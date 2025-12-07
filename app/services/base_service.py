"""Base service class with common CRUD operations."""

from typing import TypeVar, Generic, Optional, Any, Sequence
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from pydantic import BaseModel

from app.core.database import Base


ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Generic base service with common CRUD operations.

    Provides reusable methods for:
    - Paginated listing with search and filters
    - Get by ID with optional view count increment
    - Create, update, delete operations
    - Search functionality
    """

    model: type[ModelType]
    searchable_fields: list[str] = []
    default_order_by: list[str] = []

    def __init__(self, db: AsyncSession):
        self.db = db

    def _get_model_field(self, field_name: str) -> InstrumentedAttribute:
        """Get model attribute by field name."""
        return getattr(self.model, field_name)

    def build_search_filter(self, query: str) -> Any:
        """
        Build SQLAlchemy OR filter for search query.

        Override this method for custom search logic.
        """
        if not self.searchable_fields or not query:
            return None

        filters = []
        for field_name in self.searchable_fields:
            field = self._get_model_field(field_name)
            # Check if it's an ARRAY field (for tags)
            if hasattr(field.type, 'item_type'):
                filters.append(field.any(query))
            else:
                filters.append(field.ilike(f"%{query}%"))

        return or_(*filters) if filters else None

    def apply_ordering(self, stmt: Any) -> Any:
        """Apply default ordering to statement."""
        for field_name in self.default_order_by:
            if field_name.startswith("-"):
                field = self._get_model_field(field_name[1:])
                stmt = stmt.order_by(field.desc())
            else:
                field = self._get_model_field(field_name)
                stmt = stmt.order_by(field.asc())
        return stmt

    async def get_items(
        self,
        page: int = 1,
        page_size: int = 20,
        query: Optional[str] = None,
        filters: Optional[dict[str, Any]] = None,
        options: Optional[list] = None,
    ) -> tuple[list[ModelType], int]:
        """
        Get paginated list of items with optional search and filters.

        Args:
            page: Page number (1-indexed)
            page_size: Number of items per page
            query: Search query string
            filters: Dictionary of field:value filters
            options: SQLAlchemy relationship loading options

        Returns:
            Tuple of (items list, total count)
        """
        stmt = select(self.model)

        # Apply relationship loading options
        if options:
            for opt in options:
                stmt = stmt.options(opt)

        # Apply filters
        if filters:
            for field_name, value in filters.items():
                if value is not None:
                    field = self._get_model_field(field_name)
                    # Handle array field filtering
                    if hasattr(field.type, 'item_type'):
                        stmt = stmt.where(field.any(value))
                    else:
                        stmt = stmt.where(field == value)

        # Apply search
        if query:
            search_filter = self.build_search_filter(query)
            if search_filter is not None:
                stmt = stmt.where(search_filter)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await self.db.scalar(count_stmt) or 0

        # Apply ordering
        stmt = self.apply_ordering(stmt)

        # Apply pagination
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        items = list(result.scalars().all())

        return items, total

    async def get_by_id(
        self,
        item_id: int,
        options: Optional[list] = None,
        increment_view: bool = False,
    ) -> Optional[ModelType]:
        """
        Get item by ID.

        Args:
            item_id: Primary key ID
            options: SQLAlchemy relationship loading options
            increment_view: Whether to increment view_count if exists

        Returns:
            Item or None if not found
        """
        stmt = select(self.model).where(self.model.id == item_id)

        if options:
            for opt in options:
                stmt = stmt.options(opt)

        result = await self.db.execute(stmt)
        item = result.scalar_one_or_none()

        # Increment view count if requested and field exists
        if item and increment_view and hasattr(item, "view_count"):
            item.view_count += 1
            await self.db.commit()

        return item

    async def get_featured(
        self,
        limit: int = 8,
        filters: Optional[dict[str, Any]] = None,
        options: Optional[list] = None,
    ) -> list[ModelType]:
        """
        Get featured items ordered by view count.

        Args:
            limit: Maximum number of items to return
            filters: Additional filters to apply
            options: SQLAlchemy relationship loading options

        Returns:
            List of featured items
        """
        stmt = select(self.model)

        if options:
            for opt in options:
                stmt = stmt.options(opt)

        if filters:
            for field_name, value in filters.items():
                if value is not None:
                    field = self._get_model_field(field_name)
                    stmt = stmt.where(field == value)

        # Order by view_count if exists
        if hasattr(self.model, "view_count"):
            stmt = stmt.order_by(self.model.view_count.desc())

        stmt = stmt.limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_popular(
        self,
        limit: int = 8,
        options: Optional[list] = None,
    ) -> list[ModelType]:
        """Get popular items ordered by view count."""
        return await self.get_featured(limit=limit, options=options)

    async def search(
        self,
        query: str,
        limit: int = 20,
        options: Optional[list] = None,
    ) -> list[ModelType]:
        """Search items by query string."""
        items, _ = await self.get_items(
            page=1, page_size=limit, query=query, options=options
        )
        return items

    async def create(
        self,
        data: CreateSchemaType,
        exclude_fields: Optional[set[str]] = None,
    ) -> ModelType:
        """
        Create new item.

        Args:
            data: Pydantic schema with creation data
            exclude_fields: Fields to exclude from model creation

        Returns:
            Created item
        """
        item_dict = data.model_dump(exclude=exclude_fields)
        item = self.model(**item_dict)

        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)

        return item

    async def update(
        self,
        item_id: int,
        data: UpdateSchemaType,
    ) -> Optional[ModelType]:
        """
        Update existing item.

        Args:
            item_id: ID of item to update
            data: Pydantic schema with update data

        Returns:
            Updated item or None if not found
        """
        item = await self.get_by_id(item_id)
        if not item:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        await self.db.commit()
        await self.db.refresh(item)

        return item

    async def delete(self, item_id: int) -> bool:
        """
        Delete item by ID.

        Args:
            item_id: ID of item to delete

        Returns:
            True if deleted, False if not found
        """
        item = await self.get_by_id(item_id)
        if not item:
            return False

        await self.db.delete(item)
        await self.db.commit()

        return True

    async def count(self, filters: Optional[dict[str, Any]] = None) -> int:
        """Get total count of items with optional filters."""
        stmt = select(func.count()).select_from(self.model)

        if filters:
            for field_name, value in filters.items():
                if value is not None:
                    field = self._get_model_field(field_name)
                    stmt = stmt.where(field == value)

        result = await self.db.scalar(stmt)
        return result or 0

    async def get_by_field(
        self,
        field_name: str,
        value: Any,
        options: Optional[list] = None,
    ) -> Optional[ModelType]:
        """Get single item by specific field value."""
        field = self._get_model_field(field_name)
        stmt = select(self.model).where(field == value)

        if options:
            for opt in options:
                stmt = stmt.options(opt)

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
