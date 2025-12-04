from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from app.models.spot import Category, ContentType


class RelatedContentBase(BaseModel):
    title: str
    title_en: Optional[str] = None
    title_ja: Optional[str] = None
    title_zh: Optional[str] = None
    content_type: ContentType = ContentType.DRAMA
    year: Optional[int] = None
    image_url: Optional[str] = None


class RelatedContentCreate(RelatedContentBase):
    pass


class RelatedContentResponse(RelatedContentBase):
    id: int

    class Config:
        from_attributes = True


class SpotBase(BaseModel):
    name: str
    description: Optional[str] = None
    name_en: Optional[str] = None
    description_en: Optional[str] = None
    name_ja: Optional[str] = None
    description_ja: Optional[str] = None
    name_zh: Optional[str] = None
    description_zh: Optional[str] = None
    address: Optional[str] = None
    address_en: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Category = Category.DRAMA
    image_url: Optional[str] = None
    images: list[str] = []
    phone: Optional[str] = None
    website: Optional[str] = None
    hours: Optional[str] = None
    tags: list[str] = []


class SpotCreate(SpotBase):
    content_id: Optional[str] = None
    related_contents: list[RelatedContentCreate] = []


class SpotUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    name_en: Optional[str] = None
    description_en: Optional[str] = None
    name_ja: Optional[str] = None
    description_ja: Optional[str] = None
    name_zh: Optional[str] = None
    description_zh: Optional[str] = None
    address: Optional[str] = None
    address_en: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Optional[Category] = None
    image_url: Optional[str] = None
    images: Optional[list[str]] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    hours: Optional[str] = None
    tags: Optional[list[str]] = None


class SpotResponse(SpotBase):
    id: int
    view_count: int
    content_id: Optional[str] = None
    related_contents: list[RelatedContentResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SpotListResponse(BaseModel):
    spots: list[SpotResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SearchParams(BaseModel):
    query: Optional[str] = None
    category: Optional[Category] = None
    page: int = 1
    page_size: int = 20
