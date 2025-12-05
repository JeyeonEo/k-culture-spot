from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY

from app.core.database import Base


class Tour(Base):
    """
    Tour course managed by administrators
    A tour can include multiple spots in a specific order
    """
    __tablename__ = "tours"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

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

    # Tour metadata
    duration_hours: Mapped[float] = mapped_column(Float, nullable=True)  # Estimated duration
    distance_km: Mapped[float] = mapped_column(Float, nullable=True)  # Total distance

    # Images
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    images: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Difficulty level: easy, moderate, hard
    difficulty: Mapped[str] = mapped_column(String(20), nullable=True)

    # Tags for search
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Stats
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    # Related content (optional)
    content_id: Mapped[int] = mapped_column(
        ForeignKey("contents.id"), nullable=True
    )

    # Is this tour featured/recommended?
    is_featured: Mapped[bool] = mapped_column(default=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    tour_spots: Mapped[list["TourSpot"]] = relationship(
        back_populates="tour",
        cascade="all, delete-orphan",
        order_by="TourSpot.order"
    )
    content: Mapped["Content"] = relationship(back_populates="tours")


class TourSpot(Base):
    """
    Many-to-many relationship between Tours and Spots with ordering
    Represents the sequence of spots in a tour
    """
    __tablename__ = "tour_spots"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tour_id: Mapped[int] = mapped_column(ForeignKey("tours.id"), nullable=False)
    spot_id: Mapped[int] = mapped_column(ForeignKey("spots.id"), nullable=False)

    # Order of this spot in the tour (1, 2, 3, ...)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    # Optional: note about this stop
    note: Mapped[str] = mapped_column(Text, nullable=True)
    note_en: Mapped[str] = mapped_column(Text, nullable=True)

    # Estimated time to spend at this spot (minutes)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )

    # Relationships
    tour: Mapped["Tour"] = relationship(back_populates="tour_spots")
    spot: Mapped["Spot"] = relationship()
