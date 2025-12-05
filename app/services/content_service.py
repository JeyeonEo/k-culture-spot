from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import Optional

from app.models.content import Content, SpotContent
from app.models.spot import ContentType
from app.schemas.content import ContentCreate, ContentUpdate


class ContentService:
    """Service for managing content (dramas, movies, music, variety)"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_contents(
        self,
        page: int = 1,
        page_size: int = 20,
        content_type: Optional[ContentType] = None,
        year: Optional[int] = None,
        genre: Optional[str] = None,
        query: Optional[str] = None,
    ) -> tuple[list[Content], int]:
        """Get paginated list of contents with filters"""
        stmt = select(Content)

        # Apply filters
        if content_type:
            stmt = stmt.where(Content.content_type == content_type)

        if year:
            stmt = stmt.where(Content.year == year)

        if genre:
            stmt = stmt.where(Content.genre.any(genre))

        if query:
            search_filter = or_(
                Content.title.ilike(f"%{query}%"),
                Content.title_en.ilike(f"%{query}%"),
                Content.title_ja.ilike(f"%{query}%"),
                Content.title_zh.ilike(f"%{query}%"),
                Content.description.ilike(f"%{query}%"),
                Content.description_en.ilike(f"%{query}%"),
                Content.tags.any(query),
            )
            stmt = stmt.where(search_filter)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await self.db.scalar(count_stmt) or 0

        # Apply pagination and ordering
        stmt = stmt.order_by(Content.view_count.desc(), Content.year.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        contents = list(result.scalars().all())

        return contents, total

    async def get_content_by_id(
        self, content_id: int, with_spots: bool = False
    ) -> Optional[Content]:
        """Get content by ID, optionally with related spots"""
        stmt = select(Content).where(Content.id == content_id)

        if with_spots:
            stmt = stmt.options(selectinload(Content.spot_contents))

        result = await self.db.execute(stmt)
        content = result.scalar_one_or_none()

        # Increment view count
        if content:
            content.view_count += 1
            await self.db.commit()

        return content

    async def get_featured_contents(
        self, content_type: Optional[ContentType] = None, limit: int = 8
    ) -> list[Content]:
        """Get featured contents (highest rated/most viewed)"""
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
        """Get popular contents (most viewed)"""
        stmt = select(Content).order_by(Content.view_count.desc())

        if content_type:
            stmt = stmt.where(Content.content_type == content_type)

        stmt = stmt.limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_recent_contents(
        self, content_type: Optional[ContentType] = None, limit: int = 8
    ) -> list[Content]:
        """Get recently added contents"""
        stmt = select(Content).order_by(Content.created_at.desc())

        if content_type:
            stmt = stmt.where(Content.content_type == content_type)

        stmt = stmt.limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def search_contents(
        self, query: str, content_type: Optional[ContentType] = None, limit: int = 20
    ) -> list[Content]:
        """Search contents by query"""
        contents, _ = await self.get_contents(
            page=1, page_size=limit, query=query, content_type=content_type
        )
        return contents

    async def create_content(self, content_data: ContentCreate) -> Content:
        """Create new content (admin only)"""
        content_dict = content_data.model_dump()
        content = Content(**content_dict)

        self.db.add(content)
        await self.db.commit()
        await self.db.refresh(content)

        return content

    async def update_content(
        self, content_id: int, content_data: ContentUpdate
    ) -> Optional[Content]:
        """Update existing content (admin only)"""
        content = await self.get_content_by_id(content_id)
        if not content:
            return None

        # Update fields that are not None
        update_data = content_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(content, field, value)

        await self.db.commit()
        await self.db.refresh(content)

        return content

    async def delete_content(self, content_id: int) -> bool:
        """Delete content (admin only)"""
        content = await self.get_content_by_id(content_id)
        if not content:
            return False

        await self.db.delete(content)
        await self.db.commit()

        return True

    async def link_spot_to_content(
        self,
        spot_id: int,
        content_id: int,
        scene_description: Optional[str] = None,
        scene_description_en: Optional[str] = None,
        episode_number: Optional[int] = None,
    ) -> SpotContent:
        """Link a spot to content (admin only)"""
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
        """Unlink a spot from content (admin only)"""
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
        """Get all spots associated with a content"""
        stmt = (
            select(SpotContent)
            .where(SpotContent.content_id == content_id)
            .options(selectinload(SpotContent.spot))
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
