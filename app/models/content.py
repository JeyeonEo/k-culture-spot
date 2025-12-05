from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY

from app.core.database import Base
from app.models.spot import ContentType


class Content(Base):
    """
    Independent content entity (Drama, Movie, Music, Variety)
    Managed by administrators only
    """
    __tablename__ = "contents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # Content type
    content_type: Mapped[ContentType] = mapped_column(
        SQLEnum(ContentType, name="content_type_enum", create_type=False),
        nullable=False,
        index=True
    )

    # Korean title and description
    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # English translations
    title_en: Mapped[str] = mapped_column(String(200), nullable=True)
    description_en: Mapped[str] = mapped_column(Text, nullable=True)

    # Japanese translations
    title_ja: Mapped[str] = mapped_column(String(200), nullable=True)
    description_ja: Mapped[str] = mapped_column(Text, nullable=True)

    # Chinese translations
    title_zh: Mapped[str] = mapped_column(String(200), nullable=True)
    description_zh: Mapped[str] = mapped_column(Text, nullable=True)

    # Release year
    year: Mapped[int] = mapped_column(Integer, nullable=True, index=True)

    # Poster/thumbnail image
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    images: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Additional metadata
    director: Mapped[str] = mapped_column(String(200), nullable=True)
    director_en: Mapped[str] = mapped_column(String(200), nullable=True)

    cast: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    cast_en: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    genre: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # For dramas/variety: network/platform (e.g., tvN, Netflix)
    network: Mapped[str] = mapped_column(String(100), nullable=True)

    # Number of episodes (for dramas/variety)
    episodes: Mapped[int] = mapped_column(Integer, nullable=True)

    # Rating (average user rating, 0-5)
    rating: Mapped[float] = mapped_column(nullable=True, default=0.0)

    # View count
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    # Tags for search
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # External IDs
    tmdb_id: Mapped[str] = mapped_column(String(50), nullable=True)  # TheMovieDB ID
    imdb_id: Mapped[str] = mapped_column(String(50), nullable=True)  # IMDB ID

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    spot_contents: Mapped[list["SpotContent"]] = relationship(
        back_populates="content", cascade="all, delete-orphan"
    )
    tours: Mapped[list["Tour"]] = relationship(
        back_populates="content"
    )


class SpotContent(Base):
    """
    Many-to-many relationship between Spots and Contents
    Links filming locations to content
    """
    __tablename__ = "spot_contents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    spot_id: Mapped[int] = mapped_column(ForeignKey("spots.id"), nullable=False)
    content_id: Mapped[int] = mapped_column(ForeignKey("contents.id"), nullable=False)

    # Optional: specific scene or note about this location
    scene_description: Mapped[str] = mapped_column(Text, nullable=True)
    scene_description_en: Mapped[str] = mapped_column(Text, nullable=True)

    # Episode number (for dramas/variety)
    episode_number: Mapped[int] = mapped_column(Integer, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    # Relationships
    spot: Mapped["Spot"] = relationship()
    content: Mapped["Content"] = relationship(back_populates="spot_contents")
