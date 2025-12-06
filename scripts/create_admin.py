"""
첫 관리자 계정을 생성하는 스크립트
This script creates the first admin account for the HypeSpot application.
"""
import asyncio
import sys
import getpass
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_maker, init_db
from app.models.user import User, UserRole
from app.core.security import hash_password


async def create_admin_user(
    db: AsyncSession,
    email: str,
    password: str,
    full_name: Optional[str] = None,
) -> User:
    """
    Create an admin user directly in the database.

    Args:
        db: Database session
        email: Admin email address
        password: Admin password (will be hashed)
        full_name: Optional full name

    Returns:
        Created admin user

    Raises:
        ValueError: If email already exists
    """
    # Check if user already exists
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise ValueError(f"User with email '{email}' already exists")

    # Create admin user
    admin_user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        role=UserRole.ADMIN,  # Set role to ADMIN directly
        is_active=True,
        is_verified=True,  # Admin accounts are verified by default
    )

    db.add(admin_user)
    await db.commit()
    await db.refresh(admin_user)

    return admin_user


async def main():
    """Main execution function."""
    print("=" * 60)
    print("HypeSpot - 관리자 계정 생성 (Create Admin Account)")
    print("=" * 60)
    print()

    # Get admin credentials
    email = input("관리자 이메일 (Admin Email): ").strip()

    if not email:
        print("❌ 오류: 이메일을 입력해주세요.")
        sys.exit(1)

    # Get password securely (won't echo to terminal)
    password = getpass.getpass("관리자 비밀번호 (Admin Password): ")

    if not password:
        print("❌ 오류: 비밀번호를 입력해주세요.")
        sys.exit(1)

    if len(password) < 6:
        print("❌ 오류: 비밀번호는 최소 6자 이상이어야 합니다.")
        sys.exit(1)

    # Confirm password
    password_confirm = getpass.getpass("비밀번호 확인 (Confirm Password): ")

    if password != password_confirm:
        print("❌ 오류: 비밀번호가 일치하지 않습니다.")
        sys.exit(1)

    # Optional: Get full name
    full_name = input("이름 (Full Name, optional): ").strip() or None

    print()
    print("데이터베이스 초기화 중...")

    # Initialize database
    try:
        await init_db()
        print("✅ 데이터베이스 초기화 완료")
    except Exception as e:
        print(f"❌ 데이터베이스 초기화 실패: {str(e)}")
        sys.exit(1)

    print()
    print("관리자 계정 생성 중...")

    # Create admin user
    try:
        async with async_session_maker() as db:
            admin_user = await create_admin_user(
                db=db,
                email=email,
                password=password,
                full_name=full_name,
            )

        print()
        print("=" * 60)
        print("✅ 관리자 계정 생성 완료!")
        print("=" * 60)
        print(f"  - ID: {admin_user.id}")
        print(f"  - Email: {admin_user.email}")
        print(f"  - Name: {admin_user.full_name or '(없음)'}")
        print(f"  - Role: {admin_user.role.value}")
        print(f"  - Created: {admin_user.created_at}")
        print("=" * 60)
        print()
        print("이제 다음 URL에서 로그인할 수 있습니다:")
        print("  http://localhost:3000/admin")
        print()

    except ValueError as e:
        print(f"❌ 오류: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 예상치 못한 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
