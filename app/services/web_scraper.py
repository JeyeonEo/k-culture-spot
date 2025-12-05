"""
Web scraping service for K-Culture data.

This module provides web scraping capabilities for various K-culture
related websites such as Visit Korea, KOCIS, etc.
"""

import asyncio
import logging
import re
from typing import Optional
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup

from app.models.spot import Category
from app.schemas.spot import SpotCreate, RelatedContentCreate

logger = logging.getLogger(__name__)


class WebScraper:
    """Base web scraper with common functionality."""

    def __init__(self, timeout: float = 30.0, max_retries: int = 3):
        self.timeout = timeout
        self.max_retries = max_retries
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        }

    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetch HTML content from a URL with retry logic."""
        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(
                    timeout=self.timeout,
                    follow_redirects=True
                ) as client:
                    response = await client.get(url, headers=self.headers)
                    response.raise_for_status()
                    return response.text
            except httpx.HTTPError as e:
                logger.warning(f"Attempt {attempt + 1} failed for {url}: {e}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Failed to fetch {url} after {self.max_retries} attempts")
                    return None
        return None

    def parse_html(self, html: str) -> BeautifulSoup:
        """Parse HTML content into BeautifulSoup object."""
        return BeautifulSoup(html, "html.parser")

    def clean_text(self, text: Optional[str]) -> Optional[str]:
        """Clean and normalize text content."""
        if not text:
            return None
        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text.strip())
        return text if text else None

    def extract_coordinates(self, text: str) -> tuple[Optional[float], Optional[float]]:
        """Extract latitude and longitude from text."""
        # Pattern for coordinates like "37.5665, 126.9780" or "37.5665°N, 126.9780°E"
        pattern = r"(\d+\.?\d*)[°]?\s*[NS]?\s*[,\s]\s*(\d+\.?\d*)[°]?\s*[EW]?"
        match = re.search(pattern, text)
        if match:
            try:
                lat = float(match.group(1))
                lng = float(match.group(2))
                return lat, lng
            except ValueError:
                return None, None
        return None, None


class VisitKoreaScraper(WebScraper):
    """Scraper for Visit Korea (한국관광공사) website."""

    BASE_URL = "https://korean.visitkorea.or.kr"

    async def search_locations(
        self,
        keyword: str,
        category: Category = Category.DRAMA,
        limit: int = 20
    ) -> list[SpotCreate]:
        """Search for locations on Visit Korea website."""
        spots = []
        # Note: This is a template - actual implementation would depend on
        # the specific website structure and search functionality
        search_url = f"{self.BASE_URL}/search/search.do"

        html = await self.fetch_page(f"{search_url}?keyword={keyword}")
        if not html:
            return spots

        soup = self.parse_html(html)

        # Example: Extract search results (adjust selectors based on actual site)
        results = soup.select(".search-result-item")[:limit]

        for item in results:
            try:
                spot = self._parse_search_result(item, category)
                if spot:
                    spots.append(spot)
            except Exception as e:
                logger.error(f"Error parsing search result: {e}")
                continue

        return spots

    def _parse_search_result(
        self,
        item: BeautifulSoup,
        category: Category
    ) -> Optional[SpotCreate]:
        """Parse a search result item into SpotCreate."""
        # This is a template - adjust based on actual HTML structure
        title_elem = item.select_one(".title")
        if not title_elem:
            return None

        name = self.clean_text(title_elem.get_text())
        if not name:
            return None

        description = self.clean_text(
            item.select_one(".description").get_text()
            if item.select_one(".description") else None
        )

        address = self.clean_text(
            item.select_one(".address").get_text()
            if item.select_one(".address") else None
        )

        image_url = None
        img_elem = item.select_one("img")
        if img_elem and img_elem.get("src"):
            image_url = urljoin(self.BASE_URL, img_elem["src"])

        return SpotCreate(
            name=name,
            description=description,
            address=address,
            category=category,
            image_url=image_url,
            images=[image_url] if image_url else [],
            tags=[],
        )


class NaverPlaceScraper(WebScraper):
    """Scraper for extracting place information from Naver."""

    async def get_place_info(self, place_name: str) -> Optional[dict]:
        """Get place information from Naver search."""
        # Note: Using Naver's public search - for production use,
        # consider using official Naver API
        search_url = f"https://search.naver.com/search.naver?query={place_name}"

        html = await self.fetch_page(search_url)
        if not html:
            return None

        soup = self.parse_html(html)

        # Extract place information from search results
        place_info = {}

        # Try to find place box (adjust selectors as needed)
        place_box = soup.select_one(".place_bluelink")
        if place_box:
            place_info["name"] = self.clean_text(place_box.get_text())

        address_elem = soup.select_one(".addr")
        if address_elem:
            place_info["address"] = self.clean_text(address_elem.get_text())

        return place_info if place_info else None


class KCultureDataScraper:
    """
    Main scraper that combines multiple sources for K-Culture data.
    """

    def __init__(self):
        self.visit_korea = VisitKoreaScraper()
        self.naver = NaverPlaceScraper()

    async def scrape_drama_locations(
        self,
        drama_name: str,
        limit: int = 10
    ) -> list[SpotCreate]:
        """Scrape filming locations for a specific drama."""
        spots = []

        # Search on Visit Korea
        keywords = [
            f"{drama_name} 촬영지",
            f"{drama_name} 로케이션",
        ]

        for keyword in keywords:
            results = await self.visit_korea.search_locations(
                keyword,
                category=Category.DRAMA,
                limit=limit
            )
            spots.extend(results)

            # Avoid rate limiting
            await asyncio.sleep(1)

        # Remove duplicates based on name
        seen_names = set()
        unique_spots = []
        for spot in spots:
            if spot.name not in seen_names:
                seen_names.add(spot.name)
                unique_spots.append(spot)

        return unique_spots[:limit]

    async def scrape_kpop_venues(
        self,
        artist_name: str,
        limit: int = 10
    ) -> list[SpotCreate]:
        """Scrape venues related to a K-pop artist."""
        spots = []

        keywords = [
            f"{artist_name} 콘서트장",
            f"{artist_name} 팬미팅",
            f"{artist_name} 소속사",
        ]

        for keyword in keywords:
            results = await self.visit_korea.search_locations(
                keyword,
                category=Category.KPOP,
                limit=limit
            )
            spots.extend(results)
            await asyncio.sleep(1)

        # Remove duplicates
        seen_names = set()
        unique_spots = []
        for spot in spots:
            if spot.name not in seen_names:
                seen_names.add(spot.name)
                unique_spots.append(spot)

        return unique_spots[:limit]

    async def enrich_spot_data(self, spot: SpotCreate) -> SpotCreate:
        """Enrich spot data with additional information from Naver."""
        if not spot.name:
            return spot

        place_info = await self.naver.get_place_info(spot.name)
        if place_info:
            if not spot.address and place_info.get("address"):
                spot.address = place_info["address"]

        return spot
