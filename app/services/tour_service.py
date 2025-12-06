from sqlalchemy import select, func, or_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import Optional

from app.models.tour import Tour, TourSpot
from app.schemas.tour import TourCreate, TourUpdate, TourSpotCreate


class TourService:
    """Service for managing tour courses"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_tours(
        self,
        page: int = 1,
        page_size: int = 20,
        difficulty: Optional[str] = None,
        content_id: Optional[int] = None,
        is_featured: Optional[bool] = None,
        query: Optional[str] = None,
    ) -> tuple[list[Tour], int]:
        """Get paginated list of tours with filters"""
        stmt = select(Tour)

        # Apply filters
        if difficulty:
            stmt = stmt.where(Tour.difficulty == difficulty)

        if content_id:
            stmt = stmt.where(Tour.content_id == content_id)

        if is_featured is not None:
            stmt = stmt.where(Tour.is_featured == is_featured)

        if query:
            search_filter = or_(
                Tour.title.ilike(f"%{query}%"),
                Tour.title_en.ilike(f"%{query}%"),
                Tour.title_ja.ilike(f"%{query}%"),
                Tour.title_zh.ilike(f"%{query}%"),
                Tour.description.ilike(f"%{query}%"),
                Tour.description_en.ilike(f"%{query}%"),
                Tour.tags.any(query),
            )
            stmt = stmt.where(search_filter)

        # Get total count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = await self.db.scalar(count_stmt) or 0

        # Apply pagination and ordering
        stmt = stmt.order_by(Tour.is_featured.desc(), Tour.view_count.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(stmt)
        tours = list(result.scalars().all())

        return tours, total

    async def get_tour_by_id(
        self, tour_id: int, with_spots: bool = False
    ) -> Optional[Tour]:
        """Get tour by ID, optionally with ordered spots"""
        stmt = select(Tour).where(Tour.id == tour_id)

        if with_spots:
            stmt = stmt.options(
                selectinload(Tour.tour_spots).selectinload(TourSpot.spot)
            )

        result = await self.db.execute(stmt)
        tour = result.scalar_one_or_none()

        # Increment view count
        if tour:
            tour.view_count += 1
            await self.db.commit()

        return tour

    async def get_featured_tours(self, limit: int = 8) -> list[Tour]:
        """Get featured tours"""
        stmt = (
            select(Tour)
            .where(Tour.is_featured == True)
            .order_by(Tour.view_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_popular_tours(self, limit: int = 8) -> list[Tour]:
        """Get popular tours (most viewed)"""
        stmt = select(Tour).order_by(Tour.view_count.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_tours_by_content(
        self, content_id: int, page: int = 1, page_size: int = 20
    ) -> tuple[list[Tour], int]:
        """Get tours related to specific content"""
        return await self.get_tours(
            page=page, page_size=page_size, content_id=content_id
        )

    async def search_tours(self, query: str, limit: int = 20) -> list[Tour]:
        """Search tours by query"""
        tours, _ = await self.get_tours(page=1, page_size=limit, query=query)
        return tours

    async def create_tour(self, tour_data: TourCreate) -> Tour:
        """Create new tour with spots (admin only)"""
        # Create tour
        tour_dict = tour_data.model_dump(exclude={"tour_spots"})
        tour = Tour(**tour_dict)

        self.db.add(tour)
        await self.db.flush()  # Get tour ID

        # Create tour spots
        for spot_data in tour_data.tour_spots:
            tour_spot = TourSpot(tour_id=tour.id, **spot_data.model_dump())
            self.db.add(tour_spot)

        await self.db.commit()
        await self.db.refresh(tour)

        return tour

    async def update_tour(
        self, tour_id: int, tour_data: TourUpdate
    ) -> Optional[Tour]:
        """Update existing tour (admin only)"""
        tour = await self.get_tour_by_id(tour_id)
        if not tour:
            return None

        # Update fields that are not None
        update_data = tour_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tour, field, value)

        await self.db.commit()
        await self.db.refresh(tour)

        return tour

    async def delete_tour(self, tour_id: int) -> bool:
        """Delete tour (admin only)"""
        tour = await self.get_tour_by_id(tour_id)
        if not tour:
            return False

        await self.db.delete(tour)
        await self.db.commit()

        return True

    async def add_spot_to_tour(
        self, tour_id: int, spot_data: TourSpotCreate
    ) -> Optional[TourSpot]:
        """Add a spot to tour (admin only)"""
        # Verify tour exists
        tour = await self.get_tour_by_id(tour_id)
        if not tour:
            return None

        tour_spot = TourSpot(tour_id=tour_id, **spot_data.model_dump())

        self.db.add(tour_spot)
        await self.db.commit()
        await self.db.refresh(tour_spot)

        return tour_spot

    async def remove_spot_from_tour(
        self, tour_id: int, spot_id: int
    ) -> bool:
        """Remove a spot from tour (admin only)"""
        stmt = select(TourSpot).where(
            TourSpot.tour_id == tour_id, TourSpot.spot_id == spot_id
        )
        result = await self.db.execute(stmt)
        tour_spot = result.scalar_one_or_none()

        if not tour_spot:
            return False

        await self.db.delete(tour_spot)
        await self.db.commit()

        return True

    async def update_tour_spot_order(
        self, tour_id: int, spot_orders: list[dict[str, int]]
    ) -> bool:
        """
        Update the order of spots in a tour (admin only)
        spot_orders: [{"spot_id": 1, "order": 1}, {"spot_id": 2, "order": 2}, ...]
        """
        # Verify tour exists
        tour = await self.get_tour_by_id(tour_id)
        if not tour:
            return False

        # Update each spot's order
        for item in spot_orders:
            spot_id = item["spot_id"]
            new_order = item["order"]

            stmt = select(TourSpot).where(
                TourSpot.tour_id == tour_id, TourSpot.spot_id == spot_id
            )
            result = await self.db.execute(stmt)
            tour_spot = result.scalar_one_or_none()

            if tour_spot:
                tour_spot.order = new_order

        await self.db.commit()
        return True

    async def get_tour_spots(self, tour_id: int) -> list[TourSpot]:
        """Get all spots in a tour, ordered"""
        stmt = (
            select(TourSpot)
            .where(TourSpot.tour_id == tour_id)
            .options(selectinload(TourSpot.spot))
            .order_by(TourSpot.order)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
