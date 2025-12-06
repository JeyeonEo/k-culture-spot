from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.models.user import User, UserRole
from app.schemas.auth import UserRegister, TokenData
from app.core.security import hash_password, verify_password, create_access_token


class AuthService:
    """Service for user authentication and authorization"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_data: UserRegister) -> User:
        """
        Register a new user

        Args:
            user_data: User registration data

        Returns:
            Created user

        Raises:
            ValueError: If email already exists
        """
        # Check if user already exists
        existing_user = await self.get_user_by_email(user_data.email)
        if existing_user:
            raise ValueError("Email already registered")

        # Create new user with hashed password
        user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            full_name=user_data.full_name,
            role=UserRole.USER,  # Default role is USER
            is_active=True,
            is_verified=False,
        )

        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password

        Args:
            email: User email
            password: Plain text password

        Returns:
            User if authentication successful, None otherwise
        """
        user = await self.get_user_by_email(email)

        if not user:
            return None

        if not user.is_active:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        # Update last login
        user.last_login = datetime.utcnow()
        await self.db.commit()

        return user

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        stmt = select(User).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    def create_token(self, user: User) -> str:
        """
        Create access token for user

        Args:
            user: User object

        Returns:
            JWT access token
        """
        token_data = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role.value,
        }
        return create_access_token(token_data)

    async def promote_to_admin(self, user_id: int) -> Optional[User]:
        """
        Promote user to admin role

        Args:
            user_id: User ID to promote

        Returns:
            Updated user or None if not found
        """
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.role = UserRole.ADMIN
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def demote_from_admin(self, user_id: int) -> Optional[User]:
        """
        Demote admin to regular user

        Args:
            user_id: User ID to demote

        Returns:
            Updated user or None if not found
        """
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.role = UserRole.USER
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def deactivate_user(self, user_id: int) -> Optional[User]:
        """
        Deactivate user account

        Args:
            user_id: User ID to deactivate

        Returns:
            Updated user or None if not found
        """
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        user.is_active = False
        await self.db.commit()
        await self.db.refresh(user)

        return user
