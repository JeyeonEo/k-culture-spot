"""
Tests for data models and Pydantic schemas.

Tests Spot model, Category enum, schemas validation, and relationships.
"""

import pytest
from datetime import datetime
from pydantic import ValidationError

from app.models.spot import Spot, RelatedContent, Category, ContentType
from app.schemas.spot import (
    SpotBase,
    SpotCreate,
    SpotUpdate,
    SpotResponse,
    RelatedContentBase,
    RelatedContentCreate,
    SearchParams,
)


class TestCategoryEnum:
    """Test Category enum."""

    @pytest.mark.unit
    def test_category_values(self):
        """Test Category enum values."""
        assert Category.DRAMA.value == "drama"
        assert Category.KPOP.value == "kpop"
        assert Category.MOVIE.value == "movie"
        assert Category.VARIETY.value == "variety"

    @pytest.mark.unit
    def test_category_from_string(self):
        """Test creating Category from string."""
        assert Category("drama") == Category.DRAMA
        assert Category("kpop") == Category.KPOP
        assert Category("movie") == Category.MOVIE
        assert Category("variety") == Category.VARIETY

    @pytest.mark.unit
    def test_category_invalid_value(self):
        """Test that invalid category raises error."""
        with pytest.raises(ValueError):
            Category("invalid")


class TestContentTypeEnum:
    """Test ContentType enum."""

    @pytest.mark.unit
    def test_content_type_values(self):
        """Test ContentType enum values."""
        assert ContentType.DRAMA.value == "drama"
        assert ContentType.MOVIE.value == "movie"
        assert ContentType.MUSIC.value == "music"
        assert ContentType.VARIETY.value == "variety"

    @pytest.mark.unit
    def test_content_type_from_string(self):
        """Test creating ContentType from string."""
        assert ContentType("drama") == ContentType.DRAMA
        assert ContentType("movie") == ContentType.MOVIE
        assert ContentType("music") == ContentType.MUSIC
        assert ContentType("variety") == ContentType.VARIETY


class TestSpotBase:
    """Test SpotBase schema."""

    @pytest.mark.unit
    def test_spot_base_required_fields(self):
        """Test SpotBase with only required fields."""
        data = {
            "name": "Test Spot",
        }
        spot = SpotBase(**data)

        assert spot.name == "Test Spot"
        assert spot.category == Category.DRAMA
        assert spot.images == []
        assert spot.tags == []

    @pytest.mark.unit
    def test_spot_base_all_fields(self):
        """Test SpotBase with all fields."""
        data = {
            "name": "Test Spot",
            "description": "A test spot",
            "name_en": "Test Spot EN",
            "description_en": "A test spot EN",
            "name_ja": "テストスポット",
            "description_ja": "テストの説明",
            "name_zh": "测试地点",
            "description_zh": "测试描述",
            "address": "123 Main St",
            "address_en": "123 Main St EN",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "category": Category.KPOP,
            "image_url": "https://example.com/image.jpg",
            "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
            "phone": "02-1234-5678",
            "website": "https://example.com",
            "hours": "09:00-18:00",
            "tags": ["tag1", "tag2"],
        }
        spot = SpotBase(**data)

        assert spot.name == "Test Spot"
        assert spot.description == "A test spot"
        assert spot.name_en == "Test Spot EN"
        assert spot.category == Category.KPOP
        assert len(spot.images) == 2
        assert len(spot.tags) == 2

    @pytest.mark.unit
    def test_spot_base_invalid_category(self):
        """Test SpotBase with invalid category."""
        data = {
            "name": "Test Spot",
            "category": "invalid",
        }

        with pytest.raises(ValidationError):
            SpotBase(**data)

    @pytest.mark.unit
    def test_spot_base_invalid_latitude(self):
        """Test SpotBase with invalid latitude."""
        data = {
            "name": "Test Spot",
            "latitude": "not_a_number",
        }

        with pytest.raises(ValidationError):
            SpotBase(**data)

    @pytest.mark.unit
    def test_spot_base_invalid_longitude(self):
        """Test SpotBase with invalid longitude."""
        data = {
            "name": "Test Spot",
            "longitude": "not_a_number",
        }

        with pytest.raises(ValidationError):
            SpotBase(**data)


class TestSpotCreate:
    """Test SpotCreate schema."""

    @pytest.mark.unit
    def test_spot_create_basic(self):
        """Test SpotCreate with basic fields."""
        data = {
            "name": "New Spot",
        }
        spot = SpotCreate(**data)

        assert spot.name == "New Spot"
        assert spot.content_id is None
        assert spot.related_contents == []

    @pytest.mark.unit
    def test_spot_create_with_content_id(self):
        """Test SpotCreate with content_id."""
        data = {
            "name": "New Spot",
            "content_id": "api123456",
        }
        spot = SpotCreate(**data)

        assert spot.name == "New Spot"
        assert spot.content_id == "api123456"

    @pytest.mark.unit
    def test_spot_create_with_related_contents(self):
        """Test SpotCreate with related contents."""
        data = {
            "name": "New Spot",
            "related_contents": [
                {
                    "title": "Drama Title",
                    "content_type": ContentType.DRAMA,
                    "year": 2023,
                },
                {
                    "title": "Movie Title",
                    "content_type": ContentType.MOVIE,
                    "year": 2023,
                },
            ],
        }
        spot = SpotCreate(**data)

        assert spot.name == "New Spot"
        assert len(spot.related_contents) == 2
        assert spot.related_contents[0].title == "Drama Title"
        assert spot.related_contents[1].title == "Movie Title"


class TestSpotUpdate:
    """Test SpotUpdate schema."""

    @pytest.mark.unit
    def test_spot_update_partial(self):
        """Test SpotUpdate with only some fields."""
        data = {
            "name": "Updated Name",
            "description": "Updated description",
        }
        spot = SpotUpdate(**data)

        assert spot.name == "Updated Name"
        assert spot.description == "Updated description"
        assert spot.category is None
        assert spot.images is None

    @pytest.mark.unit
    def test_spot_update_empty(self):
        """Test SpotUpdate with no fields."""
        data = {}
        spot = SpotUpdate(**data)

        assert spot.name is None
        assert spot.description is None
        assert spot.category is None

    @pytest.mark.unit
    def test_spot_update_category(self):
        """Test SpotUpdate with category."""
        data = {
            "category": Category.KPOP,
        }
        spot = SpotUpdate(**data)

        assert spot.category == Category.KPOP


class TestRelatedContentBase:
    """Test RelatedContentBase schema."""

    @pytest.mark.unit
    def test_related_content_base_required_fields(self):
        """Test RelatedContentBase with only required fields."""
        data = {
            "title": "Drama Title",
        }
        content = RelatedContentBase(**data)

        assert content.title == "Drama Title"
        assert content.content_type == ContentType.DRAMA

    @pytest.mark.unit
    def test_related_content_base_all_fields(self):
        """Test RelatedContentBase with all fields."""
        data = {
            "title": "Drama Title",
            "title_en": "Drama Title EN",
            "title_ja": "ドラマタイトル",
            "title_zh": "剧名",
            "content_type": ContentType.MOVIE,
            "year": 2023,
            "image_url": "https://example.com/image.jpg",
        }
        content = RelatedContentBase(**data)

        assert content.title == "Drama Title"
        assert content.title_en == "Drama Title EN"
        assert content.content_type == ContentType.MOVIE
        assert content.year == 2023

    @pytest.mark.unit
    def test_related_content_create(self):
        """Test RelatedContentCreate schema."""
        data = {
            "title": "Content Title",
            "content_type": ContentType.MUSIC,
        }
        content = RelatedContentCreate(**data)

        assert content.title == "Content Title"
        assert content.content_type == ContentType.MUSIC


class TestSpotResponse:
    """Test SpotResponse schema."""

    @pytest.mark.unit
    def test_spot_response_from_dict(self):
        """Test SpotResponse creation from dict."""
        data = {
            "id": 1,
            "name": "Test Spot",
            "description": "A test spot",
            "view_count": 100,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        spot = SpotResponse(**data)

        assert spot.id == 1
        assert spot.name == "Test Spot"
        assert spot.view_count == 100

    @pytest.mark.unit
    def test_spot_response_with_related_contents(self):
        """Test SpotResponse with related contents."""
        now = datetime.now()
        data = {
            "id": 1,
            "name": "Test Spot",
            "view_count": 100,
            "created_at": now,
            "updated_at": now,
            "related_contents": [
                {
                    "id": 1,
                    "title": "Drama Title",
                    "content_type": ContentType.DRAMA,
                    "year": 2023,
                },
            ],
        }
        spot = SpotResponse(**data)

        assert spot.id == 1
        assert len(spot.related_contents) == 1
        assert spot.related_contents[0].title == "Drama Title"


class TestSearchParams:
    """Test SearchParams schema."""

    @pytest.mark.unit
    def test_search_params_defaults(self):
        """Test SearchParams with default values."""
        params = SearchParams()

        assert params.query is None
        assert params.category is None
        assert params.page == 1
        assert params.page_size == 20

    @pytest.mark.unit
    def test_search_params_with_query(self):
        """Test SearchParams with query."""
        params = SearchParams(query="drama")

        assert params.query == "drama"

    @pytest.mark.unit
    def test_search_params_with_category(self):
        """Test SearchParams with category."""
        params = SearchParams(category=Category.KPOP)

        assert params.category == Category.KPOP

    @pytest.mark.unit
    def test_search_params_pagination(self):
        """Test SearchParams with pagination."""
        params = SearchParams(page=2, page_size=50)

        assert params.page == 2
        assert params.page_size == 50

    @pytest.mark.unit
    def test_search_params_all_fields(self):
        """Test SearchParams with all fields."""
        params = SearchParams(
            query="test",
            category=Category.MOVIE,
            page=3,
            page_size=30,
        )

        assert params.query == "test"
        assert params.category == Category.MOVIE
        assert params.page == 3
        assert params.page_size == 30


class TestSpotModel:
    """Test Spot ORM model."""

    @pytest.mark.unit
    def test_spot_model_creation(self, db):
        """Test creating a Spot model instance."""
        spot = Spot(
            name="Test Spot",
            description="A test spot",
            address="123 Main St",
            latitude=37.7749,
            longitude=-122.4194,
            category=Category.DRAMA,
            phone="02-1234-5678",
            website="https://example.com",
            hours="09:00-18:00",
        )

        assert spot.name == "Test Spot"
        assert spot.category == Category.DRAMA
        assert spot.created_at is None  # Not saved yet

    @pytest.mark.unit
    def test_spot_model_defaults(self, db):
        """Test Spot model default values."""
        spot = Spot(name="Test Spot")

        # Note: Some defaults may be set at the database level
        assert spot.name == "Test Spot"

    @pytest.mark.unit
    def test_spot_model_with_translations(self, db):
        """Test Spot model with multiple language translations."""
        spot = Spot(
            name="한국 이름",
            name_en="English Name",
            name_ja="日本語名",
            name_zh="中文名",
            description="한국어 설명",
            description_en="English Description",
            description_ja="日本語説明",
            description_zh="中文描述",
        )

        assert spot.name == "한국 이름"
        assert spot.name_en == "English Name"
        assert spot.name_ja == "日本語名"
        assert spot.name_zh == "中文名"

    @pytest.mark.unit
    def test_spot_model_arrays(self, db):
        """Test Spot model with array fields."""
        images = ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
        tags = ["tag1", "tag2", "tag3"]
        spot = Spot(
            name="Test Spot",
            images=images,
            tags=tags,
        )

        assert spot.images == images
        assert spot.tags == tags

    @pytest.mark.unit
    def test_spot_model_content_id(self, db):
        """Test Spot model with content_id."""
        spot = Spot(
            name="Test Spot",
            content_id="api_123456",
        )

        assert spot.content_id == "api_123456"


class TestRelatedContentModel:
    """Test RelatedContent ORM model."""

    @pytest.mark.unit
    def test_related_content_creation(self, db):
        """Test creating a RelatedContent model instance."""
        content = RelatedContent(
            spot_id=1,
            title="Drama Title",
            content_type=ContentType.DRAMA,
            year=2023,
        )

        assert content.spot_id == 1
        assert content.title == "Drama Title"
        assert content.content_type == ContentType.DRAMA
        assert content.year == 2023

    @pytest.mark.unit
    def test_related_content_with_translations(self, db):
        """Test RelatedContent with translations."""
        content = RelatedContent(
            spot_id=1,
            title="한국 제목",
            title_en="English Title",
            title_ja="日本語タイトル",
            title_zh="中文标题",
            content_type=ContentType.MOVIE,
        )

        assert content.title == "한국 제목"
        assert content.title_en == "English Title"
        assert content.title_ja == "日本語タイトル"
        assert content.title_zh == "中文标题"

    @pytest.mark.unit
    def test_related_content_defaults(self, db):
        """Test RelatedContent default values."""
        content = RelatedContent(
            spot_id=1,
            title="Title",
        )

        # Note: content_type default may be set at database level
        assert content.title == "Title"
        assert content.year is None
        assert content.image_url is None
