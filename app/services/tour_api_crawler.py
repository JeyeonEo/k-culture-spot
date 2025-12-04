import httpx
from typing import Optional
import logging

from app.core.config import settings
from app.models.spot import Category
from app.schemas.spot import SpotCreate

logger = logging.getLogger(__name__)


class TourAPICrawler:
    """Crawler for Korea Tourism Organization (KTO) Tour API."""

    def __init__(self):
        self.base_url = settings.tour_api_base_url
        self.api_key = settings.tour_api_key
        self.timeout = 30.0

    async def _make_request(self, endpoint: str, params: dict) -> Optional[dict]:
        """Make HTTP request to Tour API."""
        url = f"{self.base_url}/{endpoint}"
        params = {
            **params,
            "serviceKey": self.api_key,
            "MobileOS": "ETC",
            "MobileApp": "KCultureSpot",
            "_type": "json",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                if "response" in data and "body" in data["response"]:
                    return data["response"]["body"]
                return None

        except httpx.HTTPError as e:
            logger.error(f"HTTP error while calling Tour API: {e}")
            return None
        except Exception as e:
            logger.error(f"Error while calling Tour API: {e}")
            return None

    async def search_keyword(
        self,
        keyword: str,
        content_type_id: str = "12",  # 12: 관광지
        num_of_rows: int = 20,
        page_no: int = 1,
    ) -> list[dict]:
        """Search spots by keyword."""
        params = {
            "keyword": keyword,
            "contentTypeId": content_type_id,
            "numOfRows": num_of_rows,
            "pageNo": page_no,
        }

        body = await self._make_request("searchKeyword1", params)
        if not body or "items" not in body:
            return []

        items = body["items"]
        if not items or "item" not in items:
            return []

        item_list = items["item"]
        return item_list if isinstance(item_list, list) else [item_list]

    async def get_detail_info(self, content_id: str, content_type_id: str = "12") -> Optional[dict]:
        """Get detailed information for a specific content."""
        params = {
            "contentId": content_id,
            "contentTypeId": content_type_id,
            "defaultYN": "Y",
            "firstImageYN": "Y",
            "addrinfoYN": "Y",
            "mapinfoYN": "Y",
            "overviewYN": "Y",
        }

        body = await self._make_request("detailCommon1", params)
        if not body or "items" not in body:
            return None

        items = body["items"]
        if not items or "item" not in items:
            return None

        item_list = items["item"]
        return item_list[0] if isinstance(item_list, list) else item_list

    async def get_detail_intro(self, content_id: str, content_type_id: str = "12") -> Optional[dict]:
        """Get introduction details (hours, phone, etc.)."""
        params = {
            "contentId": content_id,
            "contentTypeId": content_type_id,
        }

        body = await self._make_request("detailIntro1", params)
        if not body or "items" not in body:
            return None

        items = body["items"]
        if not items or "item" not in items:
            return None

        item_list = items["item"]
        return item_list[0] if isinstance(item_list, list) else item_list

    async def get_area_based_list(
        self,
        area_code: str = "",
        sigungu_code: str = "",
        content_type_id: str = "12",
        num_of_rows: int = 20,
        page_no: int = 1,
    ) -> list[dict]:
        """Get spots by area."""
        params = {
            "contentTypeId": content_type_id,
            "numOfRows": num_of_rows,
            "pageNo": page_no,
        }

        if area_code:
            params["areaCode"] = area_code
        if sigungu_code:
            params["sigunguCode"] = sigungu_code

        body = await self._make_request("areaBasedList1", params)
        if not body or "items" not in body:
            return []

        items = body["items"]
        if not items or "item" not in items:
            return []

        item_list = items["item"]
        return item_list if isinstance(item_list, list) else [item_list]

    def parse_spot_data(self, item: dict, category: Category = Category.DRAMA) -> SpotCreate:
        """Parse Tour API item to SpotCreate schema."""
        return SpotCreate(
            name=item.get("title", ""),
            description=item.get("overview", ""),
            address=item.get("addr1", "") + " " + item.get("addr2", ""),
            latitude=float(item.get("mapy", 0)) if item.get("mapy") else None,
            longitude=float(item.get("mapx", 0)) if item.get("mapx") else None,
            category=category,
            image_url=item.get("firstimage", ""),
            images=[item.get("firstimage", ""), item.get("firstimage2", "")]
            if item.get("firstimage")
            else [],
            phone=item.get("tel", ""),
            website=item.get("homepage", ""),
            content_id=item.get("contentid", ""),
            tags=[],
        )

    async def crawl_drama_locations(self, keywords: list[str]) -> list[SpotCreate]:
        """Crawl drama filming locations by keywords."""
        spots = []

        for keyword in keywords:
            items = await self.search_keyword(keyword)
            for item in items:
                # Get detailed info
                content_id = item.get("contentid")
                if content_id:
                    detail = await self.get_detail_info(content_id)
                    if detail:
                        item.update(detail)

                    intro = await self.get_detail_intro(content_id)
                    if intro:
                        item.update(intro)

                spot_data = self.parse_spot_data(item, Category.DRAMA)
                spot_data.tags = [keyword]
                spots.append(spot_data)

        return spots

    async def crawl_kpop_locations(self, keywords: list[str]) -> list[SpotCreate]:
        """Crawl K-POP related locations."""
        spots = []

        for keyword in keywords:
            items = await self.search_keyword(keyword)
            for item in items:
                content_id = item.get("contentid")
                if content_id:
                    detail = await self.get_detail_info(content_id)
                    if detail:
                        item.update(detail)

                spot_data = self.parse_spot_data(item, Category.KPOP)
                spot_data.tags = [keyword]
                spots.append(spot_data)

        return spots
