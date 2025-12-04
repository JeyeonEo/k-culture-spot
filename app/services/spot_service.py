from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import Optional

from app.models.spot import Spot, RelatedContent, Category
from app.schemas.spot import SpotCreate, SpotUpdate


class SpotService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_spots(
        self,
        page: int = 1,
        page_size: int = 20,
        category: Optional[Category] = None,
        query: Optional[str] = None,
    ) -> tuple[list[Spot], int]:
        stmt = select(Spot).options(selectinload(Spot.related_contents))

        # Apply filters
        if category:
            stmt = stmt.where(Spot.category == category)

        if query:
            search_filter = or_(
                Spot.name.ilike(f"%{query}%"),
                Spot.name_en.ilike(f"%{query}%"),
                Spot.description.ilike(f"%{query}%"),
                Spot.description_en.ilike(f"%{query}%"),
                Spot.tags.any(query),
            )
            stmt = stmt.where(search_filter)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await self.db.scalar(count_stmt) or 0

        # Apply pagination and ordering
        stmt = stmt.order_by(Spot.view_count.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        spots = list(result.scalars().all())

        return spots, total

    async def get_spot_by_id(self, spot_id: int) -> Optional[Spot]:
        stmt = (
            select(Spot)
            .options(selectinload(Spot.related_contents))
            .where(Spot.id == spot_id)
        )
        result = await self.db.execute(stmt)
        spot = result.scalar_one_or_none()

        # Increment view count
        if spot:
            spot.view_count += 1
            await self.db.commit()

        return spot

    async def get_featured_spots(self, limit: int = 8) -> list[Spot]:
        stmt = (
            select(Spot)
            .options(selectinload(Spot.related_contents))
            .order_by(Spot.view_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_popular_spots(self, limit: int = 8) -> list[Spot]:
        stmt = (
            select(Spot)
            .options(selectinload(Spot.related_contents))
            .order_by(Spot.view_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_spots_by_category(
        self, category: Category, page: int = 1, page_size: int = 20
    ) -> tuple[list[Spot], int]:
        return await self.get_spots(page=page, page_size=page_size, category=category)

    async def search_spots(self, query: str, limit: int = 20) -> list[Spot]:
        spots, _ = await self.get_spots(page=1, page_size=limit, query=query)
        return spots

    async def create_spot(self, spot_data: SpotCreate) -> Spot:
        # Create spot
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
        spot = await self.get_spot_by_id(spot_id)
        if not spot:
            return None

        update_data = spot_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(spot, field, value)

        await self.db.commit()
        await self.db.refresh(spot)

        return spot

    async def delete_spot(self, spot_id: int) -> bool:
        spot = await self.get_spot_by_id(spot_id)
        if not spot:
            return False

        await self.db.delete(spot)
        await self.db.commit()

        return True

    async def get_spot_by_content_id(self, content_id: str) -> Optional[Spot]:
        stmt = select(Spot).where(Spot.content_id == content_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
