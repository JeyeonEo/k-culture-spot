from datetime import datetime
from sqlalchemy import String, Text, Float, Integer, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
import enum

from app.core.database import Base


class Category(str, enum.Enum):
    DRAMA = "drama"
    KPOP = "kpop"
    MOVIE = "movie"
    VARIETY = "variety"


class ContentType(str, enum.Enum):
    DRAMA = "drama"
    MOVIE = "movie"
    MUSIC = "music"
    VARIETY = "variety"


class Spot(Base):
    __tablename__ = "spots"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # Korean name and description
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # English translations
    name_en: Mapped[str] = mapped_column(String(200), nullable=True)
    description_en: Mapped[str] = mapped_column(Text, nullable=True)

    # Japanese translations
    name_ja: Mapped[str] = mapped_column(String(200), nullable=True)
    description_ja: Mapped[str] = mapped_column(Text, nullable=True)

    # Chinese translations
    name_zh: Mapped[str] = mapped_column(String(200), nullable=True)
    description_zh: Mapped[str] = mapped_column(Text, nullable=True)

    # Location
    address: Mapped[str] = mapped_column(String(500), nullable=True)
    address_en: Mapped[str] = mapped_column(String(500), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)

    # Category
    category: Mapped[Category] = mapped_column(
        SQLEnum(Category, name="category_enum"),
        default=Category.DRAMA,
        index=True
    )

    # Images
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    images: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Contact info
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    website: Mapped[str] = mapped_column(String(500), nullable=True)
    hours: Mapped[str] = mapped_column(String(200), nullable=True)

    # Tags for search
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Stats
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    # External ID from Tour API
    content_id: Mapped[str] = mapped_column(String(50), nullable=True, unique=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    related_contents: Mapped[list["RelatedContent"]] = relationship(
        back_populates="spot", cascade="all, delete-orphan"
    )
    spot_contents: Mapped[list["SpotContent"]] = relationship(
        back_populates="spot"
    )
    tour_spots: Mapped[list["TourSpot"]] = relationship(
        back_populates="spot"
    )


class RelatedContent(Base):
    __tablename__ = "related_contents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    spot_id: Mapped[int] = mapped_column(ForeignKey("spots.id"), nullable=False)

    # Title in multiple languages
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    title_en: Mapped[str] = mapped_column(String(200), nullable=True)
    title_ja: Mapped[str] = mapped_column(String(200), nullable=True)
    title_zh: Mapped[str] = mapped_column(String(200), nullable=True)

    content_type: Mapped[ContentType] = mapped_column(
        SQLEnum(ContentType, name="content_type_enum"),
        default=ContentType.DRAMA
    )
    year: Mapped[int] = mapped_column(Integer, nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Relationship
    spot: Mapped["Spot"] = relationship(back_populates="related_contents")
