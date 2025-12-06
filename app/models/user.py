from datetime import datetime
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    """
    User model for authentication and authorization
    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # Email as username (unique)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)

    # Hashed password
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # User information
    full_name: Mapped[str] = mapped_column(String(100), nullable=True)

    # Role
    role: Mapped[UserRole] = mapped_column(
        default=UserRole.USER,
        nullable=False,
        index=True
    )

    # Account status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    last_login: Mapped[datetime] = mapped_column(
        DateTime, nullable=True
    )
