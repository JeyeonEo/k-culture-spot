"""Reusable mixins for Pydantic schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MultilingualNameMixin(BaseModel):
    """
    Mixin for multilingual name fields in Pydantic schemas.

    Provides:
        - name: Primary name (Korean, required)
        - name_en: English name
        - name_ja: Japanese name
        - name_zh: Chinese name

    Usage:
        class SpotBase(MultilingualNameMixin):
            address: Optional[str] = None
    """

    name: str
    name_en: Optional[str] = None
    name_ja: Optional[str] = None
    name_zh: Optional[str] = None


class MultilingualNameOptionalMixin(BaseModel):
    """
    Mixin for optional multilingual name fields (for update schemas).

    All fields are optional.

    Usage:
        class SpotUpdate(MultilingualNameOptionalMixin):
            address: Optional[str] = None
    """

    name: Optional[str] = None
    name_en: Optional[str] = None
    name_ja: Optional[str] = None
    name_zh: Optional[str] = None


class MultilingualTitleMixin(BaseModel):
    """
    Mixin for multilingual title fields in Pydantic schemas.

    Provides:
        - title: Primary title (Korean, required)
        - title_en: English title
        - title_ja: Japanese title
        - title_zh: Chinese title

    Usage:
        class ContentBase(MultilingualTitleMixin):
            year: Optional[int] = None
    """

    title: str
    title_en: Optional[str] = None
    title_ja: Optional[str] = None
    title_zh: Optional[str] = None


class MultilingualTitleOptionalMixin(BaseModel):
    """
    Mixin for optional multilingual title fields (for update schemas).

    All fields are optional.

    Usage:
        class ContentUpdate(MultilingualTitleOptionalMixin):
            year: Optional[int] = None
    """

    title: Optional[str] = None
    title_en: Optional[str] = None
    title_ja: Optional[str] = None
    title_zh: Optional[str] = None


class MultilingualDescriptionMixin(BaseModel):
    """
    Mixin for multilingual description fields.

    All description fields are optional.

    Usage:
        class SpotBase(MultilingualNameMixin, MultilingualDescriptionMixin):
            pass
    """

    description: Optional[str] = None
    description_en: Optional[str] = None
    description_ja: Optional[str] = None
    description_zh: Optional[str] = None


class TimestampResponseMixin(BaseModel):
    """
    Mixin for timestamp fields in response schemas.

    Usage:
        class SpotResponse(SpotBase, TimestampResponseMixin):
            id: int
    """

    created_at: datetime
    updated_at: datetime


class ViewCountResponseMixin(BaseModel):
    """
    Mixin for view count in response schemas.

    Usage:
        class SpotResponse(SpotBase, ViewCountResponseMixin):
            id: int
    """

    view_count: int = 0


class PaginationMixin(BaseModel):
    """
    Mixin for pagination fields in list response schemas.

    Usage:
        class SpotListResponse(PaginationMixin):
            spots: list[SpotResponse]
    """

    total: int
    page: int
    page_size: int
    total_pages: int


class IdMixin(BaseModel):
    """
    Mixin for ID field in response schemas.

    Usage:
        class SpotResponse(SpotBase, IdMixin):
            pass
    """

    id: int


class BaseResponseMixin(IdMixin, TimestampResponseMixin, ViewCountResponseMixin):
    """
    Combined mixin for common response fields.

    Provides:
        - id
        - created_at, updated_at
        - view_count

    Usage:
        class SpotResponse(SpotBase, BaseResponseMixin):
            pass
    """

    pass


class OrmConfigMixin(BaseModel):
    """
    Mixin that adds ORM mode configuration for Pydantic.

    Usage:
        class SpotResponse(SpotBase, OrmConfigMixin):
            id: int

    Note: from_attributes = True enables automatic conversion
    from SQLAlchemy models.
    """

    class Config:
        from_attributes = True


# Convenience combinations

class MultilingualSpotMixin(MultilingualNameMixin, MultilingualDescriptionMixin):
    """Combined mixin for spot schemas with name and description."""

    pass


class MultilingualSpotOptionalMixin(
    MultilingualNameOptionalMixin, MultilingualDescriptionMixin
):
    """Combined optional mixin for spot update schemas."""

    pass


class MultilingualContentMixin(MultilingualTitleMixin, MultilingualDescriptionMixin):
    """Combined mixin for content schemas with title and description."""

    pass


class MultilingualContentOptionalMixin(
    MultilingualTitleOptionalMixin, MultilingualDescriptionMixin
):
    """Combined optional mixin for content update schemas."""

    pass
