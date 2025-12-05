from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from app.models.spot import ContentType


class SpotContentBase(BaseModel):
    spot_id: int
    content_id: int
    scene_description: Optional[str] = None
    scene_description_en: Optional[str] = None
    episode_number: Optional[int] = None


class SpotContentCreate(SpotContentBase):
    pass


class SpotContentResponse(SpotContentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ContentBase(BaseModel):
    content_type: ContentType
    title: str
    description: Optional[str] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    title_ja: Optional[str] = None
    description_ja: Optional[str] = None
    title_zh: Optional[str] = None
    description_zh: Optional[str] = None
    year: Optional[int] = None
    image_url: Optional[str] = None
    images: list[str] = []
    director: Optional[str] = None
    director_en: Optional[str] = None
    cast: list[str] = []
    cast_en: list[str] = []
    genre: list[str] = []
    network: Optional[str] = None
    episodes: Optional[int] = None
    tags: list[str] = []
    tmdb_id: Optional[str] = None
    imdb_id: Optional[str] = None


class ContentCreate(ContentBase):
    """Schema for creating new content (admin only)"""
    pass


class ContentUpdate(BaseModel):
    """Schema for updating existing content (admin only)"""
    content_type: Optional[ContentType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    title_ja: Optional[str] = None
    description_ja: Optional[str] = None
    title_zh: Optional[str] = None
    description_zh: Optional[str] = None
    year: Optional[int] = None
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    director: Optional[str] = None
    director_en: Optional[str] = None
    cast: Optional[list[str]] = None
    cast_en: Optional[list[str]] = None
    genre: Optional[list[str]] = None
    network: Optional[str] = None
    episodes: Optional[int] = None
    tags: Optional[list[str]] = None
    tmdb_id: Optional[str] = None
    imdb_id: Optional[str] = None


class ContentResponse(ContentBase):
    """Schema for content response"""
    id: int
    rating: float
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentWithSpotsResponse(ContentResponse):
    """Content response with associated spots"""
    spot_contents: list[SpotContentResponse] = []


class ContentListResponse(BaseModel):
    """Paginated list of contents"""
    contents: list[ContentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ContentSearchParams(BaseModel):
    """Search parameters for content"""
    query: Optional[str] = None
    content_type: Optional[ContentType] = None
    year: Optional[int] = None
    genre: Optional[str] = None
    page: int = 1
    page_size: int = 20
