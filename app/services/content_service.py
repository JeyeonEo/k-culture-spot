"""Content service with CRUD operations."""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.content import Content, SpotContent
from app.models.spot import ContentType
from app.schemas.content import ContentCreate, ContentUpdate
from app.services.base_service import BaseService


class ContentService(BaseService[Content, ContentCreate, ContentUpdate]):
    """Service for managing content (dramas, movies, music, variety)."""

    model = Content
    searchable_fields = [
        "title",
        "title_en",
        "title_ja",
        "title_zh",
        "description",
        "description_en",
        "tags",
    ]
    default_order_by = ["-view_count", "-year"]

    async def get_contents(
        self,
        page: int = 1,
        page_size: int = 20,
        content_type: Optional[ContentType] = None,
        year: Optional[int] = None,
        genre: Optional[str] = None,
        query: Optional[str] = None,
    ) -> tuple[list[Content], int]:
        """Get paginated list of contents with filters."""
        filters = {}
        if content_type:
            filters["content_type"] = content_type
        if year:
            filters["year"] = year
        if genre:
            filters["genre"] = genre

        return await self.get_items(
            page=page,
            page_size=page_size,
            query=query,
            filters=filters,
        )

    async def get_content_by_id(
        self, content_id: int, with_spots: bool = False
    ) -> Optional[Content]:
        """Get content by ID, optionally with related spots."""
        options = None
        if with_spots:
            options = [selectinload(Content.spot_contents)]

        return await self.get_by_id(
            item_id=content_id,
            options=options,
            increment_view=True,
        )

    async def get_featured_contents(
        self, content_type: Optional[ContentType] = None, limit: int = 8
    ) -> list[Content]:
        """Get featured contents (highest rated/most viewed)."""
        # Custom ordering for featured: rating first, then view_count
        stmt = select(Content).order_by(
            Content.rating.desc(), Content.view_count.desc()
        )

        if content_type:
            stmt = stmt.where(Content.content_type == content_type)

        stmt = stmt.limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_popular_contents(
        self, content_type: Optional[ContentType] = None, limit: int = 8
    ) -> list[Content]:
        """Get popular contents (most viewed)."""
        filters = {}
        if content_type:
            filters["content_type"] = content_type

        return await self.get_featured(limit=limit, filters=filters)

    async def get_recent_contents(
        self, content_type: Optional[ContentType] = None, limit: int = 8
    ) -> list[Content]:
        """Get recently added contents."""
        stmt = select(Content).order_by(Content.created_at.desc())

        if content_type:
            stmt = stmt.where(Content.content_type == content_type)

        stmt = stmt.limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def search_contents(
        self, query: str, content_type: Optional[ContentType] = None, limit: int = 20
    ) -> list[Content]:
        """Search contents by query."""
        contents, _ = await self.get_contents(
            page=1, page_size=limit, query=query, content_type=content_type
        )
        return contents

    async def create_content(self, content_data: ContentCreate) -> Content:
        """Create new content (admin only)."""
        return await self.create(content_data)

    async def update_content(
        self, content_id: int, content_data: ContentUpdate
    ) -> Optional[Content]:
        """Update existing content (admin only)."""
        return await self.update(content_id, content_data)

    async def delete_content(self, content_id: int) -> bool:
        """Delete content (admin only)."""
        return await self.delete(content_id)

    async def link_spot_to_content(
        self,
        spot_id: int,
        content_id: int,
        scene_description: Optional[str] = None,
        scene_description_en: Optional[str] = None,
        episode_number: Optional[int] = None,
    ) -> SpotContent:
        """Link a spot to content (admin only)."""
        spot_content = SpotContent(
            spot_id=spot_id,
            content_id=content_id,
            scene_description=scene_description,
            scene_description_en=scene_description_en,
            episode_number=episode_number,
        )

        self.db.add(spot_content)
        await self.db.commit()
        await self.db.refresh(spot_content)

        return spot_content

    async def unlink_spot_from_content(
        self, spot_id: int, content_id: int
    ) -> bool:
        """Unlink a spot from content (admin only)."""
        stmt = select(SpotContent).where(
            SpotContent.spot_id == spot_id,
            SpotContent.content_id == content_id,
        )
        result = await self.db.execute(stmt)
        spot_content = result.scalar_one_or_none()

        if not spot_content:
            return False

        await self.db.delete(spot_content)
        await self.db.commit()

        return True

    async def get_spots_by_content(self, content_id: int) -> list[SpotContent]:
        """Get all spots associated with a content."""
        stmt = (
            select(SpotContent)
            .where(SpotContent.content_id == content_id)
            .options(selectinload(SpotContent.spot))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
