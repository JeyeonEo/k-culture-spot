from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class TourSpotBase(BaseModel):
    spot_id: int
    order: int
    note: Optional[str] = None
    note_en: Optional[str] = None
    duration_minutes: Optional[int] = None


class TourSpotCreate(TourSpotBase):
    """Schema for adding a spot to a tour"""
    pass


class TourSpotUpdate(BaseModel):
    """Schema for updating a tour spot"""
    order: Optional[int] = None
    note: Optional[str] = None
    note_en: Optional[str] = None
    duration_minutes: Optional[int] = None


class TourSpotResponse(TourSpotBase):
    id: int
    tour_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TourBase(BaseModel):
    title: str
    description: Optional[str] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    title_ja: Optional[str] = None
    description_ja: Optional[str] = None
    title_zh: Optional[str] = None
    description_zh: Optional[str] = None
    duration_hours: Optional[float] = None
    distance_km: Optional[float] = None
    image_url: Optional[str] = None
    images: list[str] = []
    difficulty: Optional[str] = None
    tags: list[str] = []
    content_id: Optional[int] = None
    is_featured: bool = False


class TourCreate(TourBase):
    """Schema for creating new tour (admin only)"""
    tour_spots: list[TourSpotCreate] = []


class TourUpdate(BaseModel):
    """Schema for updating existing tour (admin only)"""
    title: Optional[str] = None
    description: Optional[str] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    title_ja: Optional[str] = None
    description_ja: Optional[str] = None
    title_zh: Optional[str] = None
    description_zh: Optional[str] = None
    duration_hours: Optional[float] = None
    distance_km: Optional[float] = None
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    difficulty: Optional[str] = None
    tags: Optional[list[str]] = None
    content_id: Optional[int] = None
    is_featured: Optional[bool] = None


class TourResponse(TourBase):
    """Schema for tour response"""
    id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TourWithSpotsResponse(TourResponse):
    """Tour response with ordered spots"""
    tour_spots: list[TourSpotResponse] = []


class TourListResponse(BaseModel):
    """Paginated list of tours"""
    tours: list[TourResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class TourSearchParams(BaseModel):
    """Search parameters for tours"""
    query: Optional[str] = None
    difficulty: Optional[str] = None
    content_id: Optional[int] = None
    is_featured: Optional[bool] = None
    page: int = 1
    page_size: int = 20
