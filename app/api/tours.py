from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from math import ceil

from app.core.database import get_db
from app.services.tour_service import TourService
from app.schemas.tour import (
    TourCreate,
    TourUpdate,
    TourResponse,
    TourWithSpotsResponse,
    TourListResponse,
    TourSearchParams,
    TourSpotCreate,
    TourSpotResponse,
)

router = APIRouter(prefix="/api/tours", tags=["tours"])


@router.get("", response_model=TourListResponse)
async def get_tours(
    page: int = 1,
    page_size: int = 20,
    difficulty: str | None = None,
    content_id: int | None = None,
    is_featured: bool | None = None,
    query: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Get paginated list of tours with optional filters

    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20)
    - **difficulty**: Filter by difficulty (easy, moderate, hard)
    - **content_id**: Filter by related content
    - **is_featured**: Filter featured tours
    - **query**: Search query
    """
    service = TourService(db)
    tours, total = await service.get_tours(
        page=page,
        page_size=page_size,
        difficulty=difficulty,
        content_id=content_id,
        is_featured=is_featured,
        query=query,
    )

    total_pages = ceil(total / page_size) if total > 0 else 0

    return TourListResponse(
        tours=tours,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/featured", response_model=list[TourResponse])
async def get_featured_tours(
    limit: int = 8,
    db: AsyncSession = Depends(get_db),
):
    """
    Get featured tours

    - **limit**: Number of tours to return (default: 8)
    """
    service = TourService(db)
    tours = await service.get_featured_tours(limit=limit)
    return tours


@router.get("/popular", response_model=list[TourResponse])
async def get_popular_tours(
    limit: int = 8,
    db: AsyncSession = Depends(get_db),
):
    """
    Get popular tours (most viewed)

    - **limit**: Number of tours to return (default: 8)
    """
    service = TourService(db)
    tours = await service.get_popular_tours(limit=limit)
    return tours


@router.get("/search", response_model=list[TourResponse])
async def search_tours(
    q: str,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """
    Search tours by query

    - **q**: Search query (required)
    - **limit**: Maximum results (default: 20)
    """
    service = TourService(db)
    tours = await service.search_tours(query=q, limit=limit)
    return tours


@router.get("/{tour_id}", response_model=TourWithSpotsResponse)
async def get_tour(tour_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get tour by ID with ordered spots

    - **tour_id**: Tour ID
    """
    service = TourService(db)
    tour = await service.get_tour_by_id(tour_id, with_spots=True)

    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id {tour_id} not found",
        )

    return tour


@router.post("", response_model=TourResponse, status_code=status.HTTP_201_CREATED)
async def create_tour(
    tour_data: TourCreate,
    db: AsyncSession = Depends(get_db),
    # TODO: Add authentication dependency to verify admin role
):
    """
    Create new tour with spots (admin only)

    - **tour_data**: Tour information including spots
    """
    service = TourService(db)
    tour = await service.create_tour(tour_data)
    return tour


@router.patch("/{tour_id}", response_model=TourResponse)
async def update_tour(
    tour_id: int,
    tour_data: TourUpdate,
    db: AsyncSession = Depends(get_db),
    # TODO: Add authentication dependency to verify admin role
):
    """
    Update existing tour (admin only)

    - **tour_id**: Tour ID
    - **tour_data**: Fields to update
    """
    service = TourService(db)
    tour = await service.update_tour(tour_id, tour_data)

    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id {tour_id} not found",
        )

    return tour


@router.delete("/{tour_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tour(
    tour_id: int,
    db: AsyncSession = Depends(get_db),
    # TODO: Add authentication dependency to verify admin role
):
    """
    Delete tour (admin only)

    - **tour_id**: Tour ID
    """
    service = TourService(db)
    deleted = await service.delete_tour(tour_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id {tour_id} not found",
        )

    return None


@router.post("/{tour_id}/spots", response_model=TourSpotResponse, status_code=status.HTTP_201_CREATED)
async def add_spot_to_tour(
    tour_id: int,
    spot_data: TourSpotCreate,
    db: AsyncSession = Depends(get_db),
    # TODO: Add authentication dependency to verify admin role
):
    """
    Add a spot to tour (admin only)

    - **tour_id**: Tour ID
    - **spot_data**: Spot information with order
    """
    service = TourService(db)
    tour_spot = await service.add_spot_to_tour(tour_id, spot_data)

    if not tour_spot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id {tour_id} not found",
        )

    return tour_spot


@router.delete("/{tour_id}/spots/{spot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_spot_from_tour(
    tour_id: int,
    spot_id: int,
    db: AsyncSession = Depends(get_db),
    # TODO: Add authentication dependency to verify admin role
):
    """
    Remove a spot from tour (admin only)

    - **tour_id**: Tour ID
    - **spot_id**: Spot ID
    """
    service = TourService(db)
    deleted = await service.remove_spot_from_tour(tour_id, spot_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour spot not found",
        )

    return None


@router.put("/{tour_id}/spots/reorder", status_code=status.HTTP_200_OK)
async def reorder_tour_spots(
    tour_id: int,
    spot_orders: list[dict[str, int]] = Body(...),
    db: AsyncSession = Depends(get_db),
    # TODO: Add authentication dependency to verify admin role
):
    """
    Update the order of spots in a tour (admin only)

    - **tour_id**: Tour ID
    - **spot_orders**: Array of {spot_id, order} objects

    Example:
    ```json
    [
        {"spot_id": 1, "order": 1},
        {"spot_id": 2, "order": 2},
        {"spot_id": 3, "order": 3}
    ]
    ```
    """
    service = TourService(db)
    updated = await service.update_tour_spot_order(tour_id, spot_orders)

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id {tour_id} not found",
        )

    return {"message": "Tour spots reordered successfully"}


@router.get("/{tour_id}/spots", response_model=list[TourSpotResponse])
async def get_tour_spots(tour_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get all spots in a tour, ordered

    - **tour_id**: Tour ID
    """
    service = TourService(db)
    tour_spots = await service.get_tour_spots(tour_id)
    return tour_spots
