"""Spot service with CRUD operations."""

from typing import Optional
from sqlalchemy.orm import selectinload

from app.models.spot import Spot, RelatedContent, Category
from app.schemas.spot import SpotCreate, SpotUpdate
from app.services.base_service import BaseService


class SpotService(BaseService[Spot, SpotCreate, SpotUpdate]):
    """Service for managing spots."""

    model = Spot
    searchable_fields = [
        "name",
        "name_en",
        "description",
        "description_en",
        "tags",
    ]
    default_order_by = ["-view_count"]

    async def get_spots(
        self,
        page: int = 1,
        page_size: int = 20,
        category: Optional[Category] = None,
        query: Optional[str] = None,
    ) -> tuple[list[Spot], int]:
        """Get paginated list of spots with optional filters."""
        filters = {}
        if category:
            filters["category"] = category

        return await self.get_items(
            page=page,
            page_size=page_size,
            query=query,
            filters=filters,
            options=[selectinload(Spot.related_contents)],
        )

    async def get_spot_by_id(self, spot_id: int) -> Optional[Spot]:
        """Get spot by ID with view count increment."""
        return await self.get_by_id(
            item_id=spot_id,
            options=[selectinload(Spot.related_contents)],
            increment_view=True,
        )

    async def get_featured_spots(self, limit: int = 8) -> list[Spot]:
        """Get featured spots ordered by view count."""
        return await self.get_featured(
            limit=limit,
            options=[selectinload(Spot.related_contents)],
        )

    async def get_popular_spots(self, limit: int = 8) -> list[Spot]:
        """Alias for get_featured_spots."""
        return await self.get_featured_spots(limit)

    async def get_spots_by_category(
        self, category: Category, page: int = 1, page_size: int = 20
    ) -> tuple[list[Spot], int]:
        """Get spots by category."""
        return await self.get_spots(page=page, page_size=page_size, category=category)

    async def search_spots(self, query: str, limit: int = 20) -> list[Spot]:
        """Search spots by query."""
        return await self.search(
            query=query,
            limit=limit,
            options=[selectinload(Spot.related_contents)],
        )

    async def create_spot(self, spot_data: SpotCreate) -> Spot:
        """Create new spot with related contents."""
        # Create spot without related_contents
        spot_dict = spot_data.model_dump(exclude={"related_contents"})
        spot = Spot(**spot_dict)

        # Create related contents
        for content_data in spot_data.related_contents:
            content = RelatedContent(**content_data.model_dump())
            spot.related_contents.append(content)

        self.db.add(spot)
        await self.db.commit()
        await self.db.refresh(spot)

        return spot

    async def update_spot(self, spot_id: int, spot_data: SpotUpdate) -> Optional[Spot]:
        """Update existing spot."""
        return await self.update(spot_id, spot_data)

    async def delete_spot(self, spot_id: int) -> bool:
        """Delete spot by ID."""
        return await self.delete(spot_id)

    async def get_spot_by_content_id(self, content_id: str) -> Optional[Spot]:
        """Get spot by external content ID."""
        return await self.get_by_field("content_id", content_id)

    async def count_spots(self) -> int:
        """Get total count of spots."""
        return await self.count()
