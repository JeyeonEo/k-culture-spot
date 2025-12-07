"""Spot API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.models.spot import Category
from app.schemas.spot import (
    SpotResponse,
    SpotListResponse,
    SpotCreate,
    SpotUpdate,
)
from app.services.spot_service import SpotService
from app.utils import Paginator, raise_not_found

router = APIRouter(prefix="/spots", tags=["spots"])


@router.get("", response_model=SpotListResponse)
async def get_spots(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[Category] = None,
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Get all spots with pagination and optional filtering."""
    service = SpotService(db)
    spots, total = await service.get_spots(
        page=page, page_size=page_size, category=category, query=q
    )

    paginator = Paginator(page, page_size)
    return paginator.build_response(
        items=spots,
        total=total,
        items_key="spots",
        item_transformer=lambda x: SpotResponse.model_validate(x),
    )


@router.get("/featured", response_model=list[SpotResponse])
async def get_featured_spots(
    limit: int = Query(8, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    """Get featured spots."""
    service = SpotService(db)
    spots = await service.get_featured_spots(limit=limit)
    return [SpotResponse.model_validate(spot) for spot in spots]


@router.get("/popular", response_model=list[SpotResponse])
async def get_popular_spots(
    limit: int = Query(8, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    """Get popular spots based on view count."""
    service = SpotService(db)
    spots = await service.get_popular_spots(limit=limit)
    return [SpotResponse.model_validate(spot) for spot in spots]


@router.get("/search", response_model=list[SpotResponse])
async def search_spots(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Search spots by name, description, or tags."""
    service = SpotService(db)
    spots = await service.search_spots(query=q, limit=limit)
    return [SpotResponse.model_validate(spot) for spot in spots]


@router.get("/category/{category}", response_model=SpotListResponse)
async def get_spots_by_category(
    category: Category,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get spots by category."""
    service = SpotService(db)
    spots, total = await service.get_spots_by_category(
        category=category, page=page, page_size=page_size
    )

    paginator = Paginator(page, page_size)
    return paginator.build_response(
        items=spots,
        total=total,
        items_key="spots",
        item_transformer=lambda x: SpotResponse.model_validate(x),
    )


@router.get("/{spot_id}", response_model=SpotResponse)
async def get_spot(
    spot_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific spot by ID."""
    service = SpotService(db)
    spot = await service.get_spot_by_id(spot_id)

    if not spot:
        raise_not_found("Spot", spot_id)

    return SpotResponse.model_validate(spot)


@router.post("", response_model=SpotResponse, status_code=201)
async def create_spot(
    spot_data: SpotCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new spot."""
    service = SpotService(db)
    spot = await service.create_spot(spot_data)
    return SpotResponse.model_validate(spot)


@router.patch("/{spot_id}", response_model=SpotResponse)
async def update_spot(
    spot_id: int,
    spot_data: SpotUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a spot."""
    service = SpotService(db)
    spot = await service.update_spot(spot_id, spot_data)

    if not spot:
        raise_not_found("Spot", spot_id)

    return SpotResponse.model_validate(spot)


@router.delete("/{spot_id}", status_code=204)
async def delete_spot(
    spot_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a spot."""
    service = SpotService(db)
    deleted = await service.delete_spot(spot_id)

    if not deleted:
        raise_not_found("Spot", spot_id)
