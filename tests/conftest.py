import os
import pytest
import asyncio
from typing import AsyncGenerator, Generator
from unittest.mock import AsyncMock, MagicMock
import json

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, String, TypeDecorator, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.dialects.sqlite import base as sqlite_base

# Import app components
from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings


# Custom type for handling ARRAY in SQLite
class ArrayType(TypeDecorator):
    """SQLAlchemy type that handles ARRAY for both PostgreSQL and SQLite."""

    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == 'sqlite':
            return json.dumps(value) if value else '[]'
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return []
        if dialect.name == 'sqlite':
            try:
                return json.loads(value) if value else []
            except (json.JSONDecodeError, TypeError):
                return value if isinstance(value, list) else []
        return value or []


# We'll handle ARRAY compilation below


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=False,
)

# Override ARRAY type compiler for SQLite
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import compiler


class SQLiteArrayCompiler(compiler.SQLCompiler):
    """Custom compiler for ARRAY type in SQLite."""

    def visit_ARRAY(self, type_, **kw):
        return "TEXT"


# Add custom type compiler for SQLite
sqlite_dialect = engine.dialect
if not hasattr(sqlite_dialect, '_array_compiled'):
    from sqlalchemy.ext.compiler import compiles
    from sqlalchemy.dialects.postgresql import ARRAY as PostgresArray

    @compiles(PostgresArray, "sqlite")
    def compile_array_sqlite(type_, compiler, **kw):
        return "TEXT"

    sqlite_dialect._array_compiled = True


TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    """Create a new database session for a test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def override_get_db(db: Session) -> Generator[Session, None, None]:
    """Override the get_db dependency."""
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(db: Session) -> TestClient:
    """Create a test client with overridden database dependency."""
    app.dependency_overrides[get_db] = lambda: db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def mock_redis():
    """Create a mock Redis client."""
    redis_mock = AsyncMock()
    redis_mock.get = AsyncMock(return_value=None)
    redis_mock.set = AsyncMock(return_value=True)
    redis_mock.delete = AsyncMock(return_value=1)
    redis_mock.exists = AsyncMock(return_value=0)
    redis_mock.expire = AsyncMock(return_value=True)
    return redis_mock


@pytest.fixture
def mock_httpx_client():
    """Create a mock httpx client."""
    client_mock = AsyncMock()
    client_mock.get = AsyncMock()
    client_mock.post = AsyncMock()
    return client_mock
