"""Reusable mixins for SQLAlchemy models."""

from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, declared_attr


class TimestampMixin:
    """
    Mixin that adds created_at and updated_at timestamps.

    Usage:
        class MyModel(Base, TimestampMixin):
            __tablename__ = "my_models"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class ViewCountMixin:
    """
    Mixin that adds view_count field for tracking popularity.

    Usage:
        class MyModel(Base, ViewCountMixin):
            __tablename__ = "my_models"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    view_count: Mapped[int] = mapped_column(Integer, default=0)


class MultilingualNameMixin:
    """
    Mixin for multilingual name fields (Korean, English, Japanese, Chinese).

    Provides:
        - name: Primary name (Korean)
        - name_en: English name
        - name_ja: Japanese name
        - name_zh: Chinese name

    Usage:
        class MyModel(Base, MultilingualNameMixin):
            __tablename__ = "my_models"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    name_en: Mapped[str | None] = mapped_column(String(200), nullable=True)
    name_ja: Mapped[str | None] = mapped_column(String(200), nullable=True)
    name_zh: Mapped[str | None] = mapped_column(String(200), nullable=True)


class MultilingualTitleMixin:
    """
    Mixin for multilingual title fields (Korean, English, Japanese, Chinese).

    Provides:
        - title: Primary title (Korean)
        - title_en: English title
        - title_ja: Japanese title
        - title_zh: Chinese title

    Usage:
        class MyModel(Base, MultilingualTitleMixin):
            __tablename__ = "my_models"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    title_en: Mapped[str | None] = mapped_column(String(200), nullable=True)
    title_ja: Mapped[str | None] = mapped_column(String(200), nullable=True)
    title_zh: Mapped[str | None] = mapped_column(String(200), nullable=True)


class MultilingualDescriptionMixin:
    """
    Mixin for multilingual description fields.

    Provides:
        - description: Primary description (Korean)
        - description_en: English description
        - description_ja: Japanese description
        - description_zh: Chinese description

    Usage:
        class MyModel(Base, MultilingualDescriptionMixin):
            __tablename__ = "my_models"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    description_en: Mapped[str | None] = mapped_column(Text, nullable=True)
    description_ja: Mapped[str | None] = mapped_column(Text, nullable=True)
    description_zh: Mapped[str | None] = mapped_column(Text, nullable=True)


class MultilingualContentMixin(MultilingualTitleMixin, MultilingualDescriptionMixin):
    """
    Combined mixin for content with multilingual title and description.

    Provides all fields from MultilingualTitleMixin and MultilingualDescriptionMixin.

    Usage:
        class Content(Base, MultilingualContentMixin):
            __tablename__ = "contents"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    pass


class MultilingualSpotMixin(MultilingualNameMixin, MultilingualDescriptionMixin):
    """
    Combined mixin for spots with multilingual name and description.

    Provides all fields from MultilingualNameMixin and MultilingualDescriptionMixin.

    Usage:
        class Spot(Base, MultilingualSpotMixin):
            __tablename__ = "spots"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    pass


class BaseModelMixin(TimestampMixin, ViewCountMixin):
    """
    Base mixin combining common fields for most models.

    Provides:
        - created_at, updated_at (from TimestampMixin)
        - view_count (from ViewCountMixin)

    Usage:
        class MyModel(Base, BaseModelMixin):
            __tablename__ = "my_models"
            id: Mapped[int] = mapped_column(primary_key=True)
    """

    pass
