from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.spot_service import SpotService
from app.services.tour_api_crawler import TourAPICrawler

router = APIRouter(prefix="/crawler", tags=["crawler"])

# Predefined keywords for crawling
DRAMA_KEYWORDS = [
    "도깨비",
    "사랑의 불시착",
    "이태원 클라쓰",
    "호텔 델루나",
    "별에서 온 그대",
    "태양의 후예",
    "킹덤",
    "오징어 게임",
    "더 글로리",
]

KPOP_KEYWORDS = [
    "BTS",
    "BLACKPINK",
    "SM타운",
    "JYP",
    "HYBE",
    "K-POP",
    "아이돌",
]


async def crawl_and_save_spots(
    db: AsyncSession,
    crawler: TourAPICrawler,
    keywords: list[str],
    is_kpop: bool = False,
):
    """Background task to crawl and save spots."""
    service = SpotService(db)

    if is_kpop:
        spots_data = await crawler.crawl_kpop_locations(keywords)
    else:
        spots_data = await crawler.crawl_drama_locations(keywords)

    saved_count = 0
    for spot_data in spots_data:
        # Check if already exists
        if spot_data.content_id:
            existing = await service.get_spot_by_content_id(spot_data.content_id)
            if existing:
                continue

        await service.create_spot(spot_data)
        saved_count += 1

    return saved_count


@router.post("/drama")
async def crawl_drama_locations(
    background_tasks: BackgroundTasks,
    keywords: list[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Crawl drama filming locations from Tour API."""
    crawler = TourAPICrawler()
    target_keywords = keywords or DRAMA_KEYWORDS

    background_tasks.add_task(
        crawl_and_save_spots, db, crawler, target_keywords, False
    )

    return {
        "message": "Crawling started",
        "keywords": target_keywords,
    }


@router.post("/kpop")
async def crawl_kpop_locations(
    background_tasks: BackgroundTasks,
    keywords: list[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Crawl K-POP related locations from Tour API."""
    crawler = TourAPICrawler()
    target_keywords = keywords or KPOP_KEYWORDS

    background_tasks.add_task(
        crawl_and_save_spots, db, crawler, target_keywords, True
    )

    return {
        "message": "Crawling started",
        "keywords": target_keywords,
    }


@router.get("/status")
async def crawler_status():
    """Get crawler status and configuration."""
    return {
        "status": "ready",
        "available_keywords": {
            "drama": DRAMA_KEYWORDS,
            "kpop": KPOP_KEYWORDS,
        },
    }
