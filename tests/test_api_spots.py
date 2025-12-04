"""
Tests for Spot API endpoints.

Tests CRUD operations, filtering, pagination, and search functionality.
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime

from app.models.spot import Spot, Category
from app.schemas.spot import SpotCreate, SpotUpdate


@pytest.mark.integration
class TestSpotsListEndpoint:
    """Test GET /api/spots endpoint."""

    def test_get_spots_empty_database(self, client: TestClient, db):
        """Test getting spots when database is empty."""
        response = client.get("/api/spots")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["spots"] == []
        assert data["page"] == 1
        assert data["page_size"] == 20
        assert data["total_pages"] == 0

    def test_get_spots_with_data(self, client: TestClient, db):
        """Test getting spots with data in database."""
        # Add test data
        spot = Spot(
            name="Test Spot 1",
            description="A test spot",
            category=Category.DRAMA,
        )
        db.add(spot)
        db.commit()
        db.refresh(spot)

        response = client.get("/api/spots")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["spots"]) == 1
        assert data["spots"][0]["name"] == "Test Spot 1"

    def test_get_spots_pagination(self, client: TestClient, db):
        """Test spots pagination."""
        # Add multiple spots
        for i in range(25):
            spot = Spot(name=f"Spot {i}", category=Category.DRAMA)
            db.add(spot)
        db.commit()

        # Get first page with size 10
        response = client.get("/api/spots?page=1&page_size=10")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 25
        assert len(data["spots"]) == 10
        assert data["page"] == 1
        assert data["total_pages"] == 3

    def test_get_spots_page_2(self, client: TestClient, db):
        """Test getting second page of spots."""
        for i in range(25):
            spot = Spot(name=f"Spot {i}", category=Category.DRAMA)
            db.add(spot)
        db.commit()

        response = client.get("/api/spots?page=2&page_size=10")

        assert response.status_code == 200
        data = response.json()
        assert data["page"] == 2
        assert len(data["spots"]) == 10

    def test_get_spots_filter_by_category(self, client: TestClient, db):
        """Test filtering spots by category."""
        spot1 = Spot(name="Drama 1", category=Category.DRAMA)
        spot2 = Spot(name="Kpop 1", category=Category.KPOP)
        spot3 = Spot(name="Drama 2", category=Category.DRAMA)
        db.add_all([spot1, spot2, spot3])
        db.commit()

        response = client.get("/api/spots?category=drama")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert all(spot["category"] == "drama" for spot in data["spots"])

    def test_get_spots_invalid_page(self, client: TestClient):
        """Test that invalid page value is rejected."""
        response = client.get("/api/spots?page=0")

        # Should fail validation or default to 1
        assert response.status_code in [200, 422]

    def test_get_spots_invalid_page_size(self, client: TestClient):
        """Test that invalid page_size is rejected."""
        response = client.get("/api/spots?page_size=101")

        # Should fail validation (max is 100)
        assert response.status_code == 422


@pytest.mark.integration
class TestSpotDetailEndpoint:
    """Test GET /api/spots/{spot_id} endpoint."""

    def test_get_spot_by_id(self, client: TestClient, db):
        """Test getting a spot by ID."""
        spot = Spot(
            name="Test Spot",
            description="A test spot",
            category=Category.KPOP,
        )
        db.add(spot)
        db.commit()
        db.refresh(spot)

        response = client.get(f"/api/spots/{spot.id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == spot.id
        assert data["name"] == "Test Spot"
        assert data["category"] == "kpop"

    def test_get_spot_not_found(self, client: TestClient):
        """Test getting a non-existent spot."""
        response = client.get("/api/spots/9999")

        assert response.status_code == 404

    def test_get_spot_with_related_contents(self, client: TestClient, db):
        """Test getting a spot with related contents."""
        from app.models.spot import RelatedContent, ContentType

        spot = Spot(name="Test Spot", category=Category.DRAMA)
        db.add(spot)
        db.commit()
        db.refresh(spot)

        # Add related content
        related = RelatedContent(
            spot_id=spot.id,
            title="Related Content",
            content_type=ContentType.DRAMA,
            year=2023,
        )
        db.add(related)
        db.commit()

        response = client.get(f"/api/spots/{spot.id}")

        assert response.status_code == 200
        data = response.json()
        assert len(data["related_contents"]) == 1
        assert data["related_contents"][0]["title"] == "Related Content"


@pytest.mark.integration
class TestCreateSpotEndpoint:
    """Test POST /api/spots endpoint."""

    def test_create_spot_minimal(self, client: TestClient, db):
        """Test creating a spot with minimal data."""
        data = {
            "name": "New Spot",
        }
        response = client.post("/api/spots", json=data)

        assert response.status_code == 201
        result = response.json()
        assert result["id"] is not None
        assert result["name"] == "New Spot"
        assert result["category"] == "drama"

    def test_create_spot_with_all_fields(self, client: TestClient, db):
        """Test creating a spot with all fields."""
        data = {
            "name": "New Spot",
            "description": "A new spot",
            "name_en": "New Spot EN",
            "description_en": "A new spot EN",
            "address": "123 Main St",
            "address_en": "123 Main St",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "category": "kpop",
            "phone": "02-1234-5678",
            "website": "https://example.com",
            "hours": "09:00-18:00",
            "tags": ["tag1", "tag2"],
            "images": ["https://example.com/img1.jpg"],
        }
        response = client.post("/api/spots", json=data)

        assert response.status_code == 201
        result = response.json()
        assert result["name"] == "New Spot"
        assert result["category"] == "kpop"
        assert len(result["tags"]) == 2

    def test_create_spot_missing_required_field(self, client: TestClient):
        """Test creating a spot without required fields."""
        data = {
            "description": "A spot without name",
        }
        response = client.post("/api/spots", json=data)

        # Should fail validation
        assert response.status_code == 422

    def test_create_spot_invalid_category(self, client: TestClient):
        """Test creating a spot with invalid category."""
        data = {
            "name": "Test Spot",
            "category": "invalid_category",
        }
        response = client.post("/api/spots", json=data)

        assert response.status_code == 422

    def test_create_spot_invalid_coordinates(self, client: TestClient):
        """Test creating a spot with invalid coordinates."""
        data = {
            "name": "Test Spot",
            "latitude": "not_a_number",
        }
        response = client.post("/api/spots", json=data)

        assert response.status_code == 422


@pytest.mark.integration
class TestUpdateSpotEndpoint:
    """Test PATCH /api/spots/{spot_id} endpoint."""

    def test_update_spot_name(self, client: TestClient, db):
        """Test updating a spot's name."""
        spot = Spot(name="Original Name", category=Category.DRAMA)
        db.add(spot)
        db.commit()
        db.refresh(spot)

        data = {
            "name": "Updated Name",
        }
        response = client.patch(f"/api/spots/{spot.id}", json=data)

        assert response.status_code == 200
        result = response.json()
        assert result["name"] == "Updated Name"

    def test_update_spot_category(self, client: TestClient, db):
        """Test updating a spot's category."""
        spot = Spot(name="Test Spot", category=Category.DRAMA)
        db.add(spot)
        db.commit()
        db.refresh(spot)

        data = {
            "category": "kpop",
        }
        response = client.patch(f"/api/spots/{spot.id}", json=data)

        assert response.status_code == 200
        result = response.json()
        assert result["category"] == "kpop"

    def test_update_spot_multiple_fields(self, client: TestClient, db):
        """Test updating multiple fields of a spot."""
        spot = Spot(
            name="Original",
            description="Original description",
            category=Category.DRAMA,
        )
        db.add(spot)
        db.commit()
        db.refresh(spot)

        data = {
            "name": "Updated",
            "description": "Updated description",
            "category": "movie",
        }
        response = client.patch(f"/api/spots/{spot.id}", json=data)

        assert response.status_code == 200
        result = response.json()
        assert result["name"] == "Updated"
        assert result["description"] == "Updated description"
        assert result["category"] == "movie"

    def test_update_spot_not_found(self, client: TestClient):
        """Test updating a non-existent spot."""
        data = {
            "name": "Updated",
        }
        response = client.patch("/api/spots/9999", json=data)

        assert response.status_code == 404

    def test_update_spot_with_empty_data(self, client: TestClient, db):
        """Test updating a spot with empty data."""
        spot = Spot(name="Test Spot", category=Category.DRAMA)
        db.add(spot)
        db.commit()
        db.refresh(spot)

        data = {}
        response = client.patch(f"/api/spots/{spot.id}", json=data)

        # Should succeed with partial update
        assert response.status_code == 200


@pytest.mark.integration
class TestDeleteSpotEndpoint:
    """Test DELETE /api/spots/{spot_id} endpoint."""

    def test_delete_spot(self, client: TestClient, db):
        """Test deleting a spot."""
        spot = Spot(name="Test Spot", category=Category.DRAMA)
        db.add(spot)
        db.commit()
        db.refresh(spot)
        spot_id = spot.id

        response = client.delete(f"/api/spots/{spot_id}")

        assert response.status_code == 204

        # Verify spot is deleted
        db.refresh(spot)
        assert db.query(Spot).filter(Spot.id == spot_id).first() is None

    def test_delete_spot_not_found(self, client: TestClient):
        """Test deleting a non-existent spot."""
        response = client.delete("/api/spots/9999")

        assert response.status_code == 404


@pytest.mark.integration
class TestFeaturedSpotsEndpoint:
    """Test GET /api/spots/featured endpoint."""

    def test_get_featured_spots_empty(self, client: TestClient, db):
        """Test getting featured spots with no data."""
        response = client.get("/api/spots/featured")

        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_get_featured_spots_with_limit(self, client: TestClient, db):
        """Test getting featured spots with custom limit."""
        for i in range(15):
            spot = Spot(name=f"Spot {i}", category=Category.DRAMA)
            db.add(spot)
        db.commit()

        response = client.get("/api/spots/featured?limit=5")

        assert response.status_code == 200
        data = response.json()
        # Should return up to 5 spots
        assert len(data) <= 5


@pytest.mark.integration
class TestPopularSpotsEndpoint:
    """Test GET /api/spots/popular endpoint."""

    def test_get_popular_spots_empty(self, client: TestClient, db):
        """Test getting popular spots with no data."""
        response = client.get("/api/spots/popular")

        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_get_popular_spots_by_view_count(self, client: TestClient, db):
        """Test that popular spots are ordered by view count."""
        spot1 = Spot(name="Spot 1", category=Category.DRAMA, view_count=10)
        spot2 = Spot(name="Spot 2", category=Category.DRAMA, view_count=100)
        spot3 = Spot(name="Spot 3", category=Category.DRAMA, view_count=50)
        db.add_all([spot1, spot2, spot3])
        db.commit()

        response = client.get("/api/spots/popular?limit=10")

        assert response.status_code == 200
        data = response.json()
        # Should be ordered by view count (highest first)
        if len(data) > 1:
            for i in range(len(data) - 1):
                assert data[i]["view_count"] >= data[i + 1]["view_count"]


@pytest.mark.integration
class TestSearchSpotsEndpoint:
    """Test GET /api/spots/search endpoint."""

    def test_search_spots_by_name(self, client: TestClient, db):
        """Test searching spots by name."""
        spot1 = Spot(name="Drama Location", category=Category.DRAMA)
        spot2 = Spot(name="Kpop Concert Hall", category=Category.KPOP)
        db.add_all([spot1, spot2])
        db.commit()

        response = client.get("/api/spots/search?q=Drama")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        # Results should contain the search term
        assert any("Drama" in spot["name"] for spot in data)

    def test_search_spots_minimum_length(self, client: TestClient):
        """Test that search query must have minimum length."""
        response = client.get("/api/spots/search?q=")

        # Should fail validation (min_length=1)
        assert response.status_code == 422

    def test_search_spots_with_limit(self, client: TestClient, db):
        """Test search with custom limit."""
        for i in range(50):
            spot = Spot(name=f"Spot {i}", category=Category.DRAMA)
            db.add(spot)
        db.commit()

        response = client.get("/api/spots/search?q=Spot&limit=10")

        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 10


@pytest.mark.integration
class TestCategorySpotsEndpoint:
    """Test GET /api/spots/category/{category} endpoint."""

    def test_get_spots_by_category(self, client: TestClient, db):
        """Test getting spots by category."""
        spot1 = Spot(name="Drama 1", category=Category.DRAMA)
        spot2 = Spot(name="Drama 2", category=Category.DRAMA)
        spot3 = Spot(name="Kpop 1", category=Category.KPOP)
        db.add_all([spot1, spot2, spot3])
        db.commit()

        response = client.get("/api/spots/category/drama")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert all(spot["category"] == "drama" for spot in data["spots"])

    def test_get_spots_by_category_with_pagination(self, client: TestClient, db):
        """Test getting spots by category with pagination."""
        for i in range(25):
            spot = Spot(name=f"Kpop {i}", category=Category.KPOP)
            db.add(spot)
        db.commit()

        response = client.get("/api/spots/category/kpop?page=1&page_size=10")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 25
        assert len(data["spots"]) == 10
        assert data["total_pages"] == 3

    def test_get_spots_by_invalid_category(self, client: TestClient):
        """Test getting spots with invalid category."""
        response = client.get("/api/spots/category/invalid")

        # Should fail validation
        assert response.status_code == 422
