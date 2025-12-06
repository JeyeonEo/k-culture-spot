from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from math import ceil

from app.core.database import get_db
from app.core.deps import get_current_admin_user
from app.models.user import User
from app.services.content_service import ContentService
from app.schemas.content import (
    ContentCreate,
    ContentUpdate,
    ContentResponse,
    ContentWithSpotsResponse,
    ContentListResponse,
    ContentSearchParams,
)
from app.models.spot import ContentType

router = APIRouter(prefix="/api/contents", tags=["contents"])


@router.get("", response_model=ContentListResponse)
async def get_contents(
    page: int = 1,
    page_size: int = 20,
    content_type: ContentType | None = None,
    year: int | None = None,
    genre: str | None = None,
    query: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Get paginated list of contents with optional filters

    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20)
    - **content_type**: Filter by type (drama, movie, music, variety)
    - **year**: Filter by release year
    - **genre**: Filter by genre
    - **query**: Search query
    """
    service = ContentService(db)
    contents, total = await service.get_contents(
        page=page,
        page_size=page_size,
        content_type=content_type,
        year=year,
        genre=genre,
        query=query,
    )

    total_pages = ceil(total / page_size) if total > 0 else 0

    return ContentListResponse(
        contents=contents,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/featured", response_model=list[ContentResponse])
async def get_featured_contents(
    content_type: ContentType | None = None,
    limit: int = 8,
    db: AsyncSession = Depends(get_db),
):
    """
    Get featured contents (highest rated/most viewed)

    - **content_type**: Filter by type (optional)
    - **limit**: Number of contents to return (default: 8)
    """
    service = ContentService(db)
    contents = await service.get_featured_contents(content_type=content_type, limit=limit)
    return contents


@router.get("/popular", response_model=list[ContentResponse])
async def get_popular_contents(
    content_type: ContentType | None = None,
    limit: int = 8,
    db: AsyncSession = Depends(get_db),
):
    """
    Get popular contents (most viewed)

    - **content_type**: Filter by type (optional)
    - **limit**: Number of contents to return (default: 8)
    """
    service = ContentService(db)
    contents = await service.get_popular_contents(content_type=content_type, limit=limit)
    return contents


@router.get("/recent", response_model=list[ContentResponse])
async def get_recent_contents(
    content_type: ContentType | None = None,
    limit: int = 8,
    db: AsyncSession = Depends(get_db),
):
    """
    Get recently added contents

    - **content_type**: Filter by type (optional)
    - **limit**: Number of contents to return (default: 8)
    """
    service = ContentService(db)
    contents = await service.get_recent_contents(content_type=content_type, limit=limit)
    return contents


@router.get("/search", response_model=list[ContentResponse])
async def search_contents(
    q: str,
    content_type: ContentType | None = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """
    Search contents by query

    - **q**: Search query (required)
    - **content_type**: Filter by type (optional)
    - **limit**: Maximum results (default: 20)
    """
    service = ContentService(db)
    contents = await service.search_contents(
        query=q, content_type=content_type, limit=limit
    )
    return contents


@router.get("/{content_id}", response_model=ContentWithSpotsResponse)
async def get_content(content_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get content by ID with related spots

    - **content_id**: Content ID
    """
    service = ContentService(db)
    content = await service.get_content_by_id(content_id, with_spots=True)

    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Content with id {content_id} not found",
        )

    return content


@router.post("", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
async def create_content(
    content_data: ContentCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    """
    Create new content (admin only)

    Requires admin authentication.

    - **content_data**: Content information
    """
    service = ContentService(db)
    content = await service.create_content(content_data)
    return content


@router.patch("/{content_id}", response_model=ContentResponse)
async def update_content(
    content_id: int,
    content_data: ContentUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    """
    Update existing content (admin only)

    Requires admin authentication.

    - **content_id**: Content ID
    - **content_data**: Fields to update
    """
    service = ContentService(db)
    content = await service.update_content(content_id, content_data)

    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Content with id {content_id} not found",
        )

    return content


@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    content_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    """
    Delete content (admin only)

    Requires admin authentication.

    - **content_id**: Content ID
    """
    service = ContentService(db)
    deleted = await service.delete_content(content_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Content with id {content_id} not found",
        )

    return None


@router.post("/{content_id}/spots/{spot_id}", status_code=status.HTTP_201_CREATED)
async def link_spot_to_content(
    content_id: int,
    spot_id: int,
    scene_description: str | None = None,
    scene_description_en: str | None = None,
    episode_number: int | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    """
    Link a spot to content (admin only)

    Requires admin authentication.

    - **content_id**: Content ID
    - **spot_id**: Spot ID
    - **scene_description**: Optional description of the scene
    - **scene_description_en**: Optional English description
    - **episode_number**: Optional episode number
    """
    service = ContentService(db)
    spot_content = await service.link_spot_to_content(
        spot_id=spot_id,
        content_id=content_id,
        scene_description=scene_description,
        scene_description_en=scene_description_en,
        episode_number=episode_number,
    )
    return spot_content


@router.delete("/{content_id}/spots/{spot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlink_spot_from_content(
    content_id: int,
    spot_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    """
    Unlink a spot from content (admin only)

    Requires admin authentication.

    - **content_id**: Content ID
    - **spot_id**: Spot ID
    """
    service = ContentService(db)
    deleted = await service.unlink_spot_from_content(spot_id, content_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )

    return None


@router.get("/{content_id}/spots")
async def get_content_spots(content_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get all spots associated with a content

    - **content_id**: Content ID
    """
    service = ContentService(db)
    spot_contents = await service.get_spots_by_content(content_id)
    return spot_contents
