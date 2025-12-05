#!/usr/bin/env python
"""
K-Culture Spot 데이터 로더 CLI

데이터를 크롤링하고 DB에 적재하는 통합 CLI 도구입니다.

사용법:
    python scripts/data_loader_cli.py --help
    python scripts/data_loader_cli.py load-json
    python scripts/data_loader_cli.py crawl-tour --keyword "도깨비"
    python scripts/data_loader_cli.py scrape --drama "사랑의 불시착"
"""

import argparse
import asyncio
import logging
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from app.core.database import async_session_maker, init_db
from app.models.spot import Category
from app.services.spot_service import SpotService
from app.services.tour_api_crawler import TourAPICrawler
from app.services.web_scraper import KCultureDataScraper
from scripts.load_test_data import load_test_data

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class DataLoaderCLI:
    """K-Culture 데이터 로더 CLI 클래스."""

    def __init__(self):
        self.tour_crawler = TourAPICrawler()
        self.web_scraper = KCultureDataScraper()

    async def init_database(self):
        """데이터베이스를 초기화합니다."""
        logger.info("데이터베이스 초기화 중...")
        await init_db()
        logger.info("데이터베이스 초기화 완료")

    async def load_json_data(self, path: str = None) -> tuple[int, int]:
        """
        JSON 파일들을 DB에 로드합니다.

        Args:
            path: test_db 폴더 경로 (기본값: 프로젝트 루트/test_db)

        Returns:
            (loaded_count, skipped_count)
        """
        await self.init_database()

        test_db_path = Path(path) if path else None

        async with async_session_maker() as db:
            loaded, skipped = await load_test_data(db, test_db_path)

        logger.info(f"JSON 데이터 로드 완료: {loaded}개 로드, {skipped}개 스킵")
        return loaded, skipped

    async def crawl_tour_api(
        self,
        keywords: list[str],
        category: str = "drama",
        limit: int = 20
    ) -> int:
        """
        Tour API에서 데이터를 크롤링하여 DB에 저장합니다.

        Args:
            keywords: 검색 키워드 목록
            category: 카테고리 (drama, kpop, movie, variety)
            limit: 각 키워드당 최대 결과 수

        Returns:
            저장된 스팟 수
        """
        await self.init_database()

        category_enum = getattr(Category, category.upper(), Category.DRAMA)

        saved_count = 0
        async with async_session_maker() as db:
            service = SpotService(db)

            for keyword in keywords:
                logger.info(f"검색 중: {keyword}")

                # Search for spots
                items = await self.tour_crawler.search_keyword(
                    keyword,
                    num_of_rows=limit
                )

                for item in items:
                    content_id = item.get("contentid")

                    # Skip if already exists
                    if content_id:
                        existing = await service.get_spot_by_content_id(content_id)
                        if existing:
                            logger.debug(f"스킵: {content_id} 이미 존재")
                            continue

                    # Get detailed info
                    if content_id:
                        detail = await self.tour_crawler.get_detail_info(content_id)
                        if detail:
                            item.update(detail)

                        intro = await self.tour_crawler.get_detail_intro(content_id)
                        if intro:
                            item.update(intro)

                    # Parse and save
                    spot_data = self.tour_crawler.parse_spot_data(item, category_enum)
                    spot_data.tags = [keyword]

                    try:
                        await service.create_spot(spot_data)
                        saved_count += 1
                        logger.info(f"저장 완료: {spot_data.name}")
                    except Exception as e:
                        logger.error(f"저장 실패: {e}")

                # Rate limiting
                await asyncio.sleep(0.5)

        logger.info(f"Tour API 크롤링 완료: {saved_count}개 저장")
        return saved_count

    async def scrape_web(
        self,
        drama_name: str = None,
        artist_name: str = None,
        limit: int = 10
    ) -> int:
        """
        웹에서 데이터를 스크래핑하여 DB에 저장합니다.

        Args:
            drama_name: 드라마 이름
            artist_name: K-pop 아티스트 이름
            limit: 최대 결과 수

        Returns:
            저장된 스팟 수
        """
        await self.init_database()

        spots = []

        if drama_name:
            logger.info(f"드라마 촬영지 스크래핑: {drama_name}")
            spots.extend(
                await self.web_scraper.scrape_drama_locations(drama_name, limit)
            )

        if artist_name:
            logger.info(f"K-pop 관련 장소 스크래핑: {artist_name}")
            spots.extend(
                await self.web_scraper.scrape_kpop_venues(artist_name, limit)
            )

        saved_count = 0
        async with async_session_maker() as db:
            service = SpotService(db)

            for spot in spots:
                # Enrich data
                spot = await self.web_scraper.enrich_spot_data(spot)

                try:
                    await service.create_spot(spot)
                    saved_count += 1
                    logger.info(f"저장 완료: {spot.name}")
                except Exception as e:
                    logger.error(f"저장 실패: {e}")

        logger.info(f"웹 스크래핑 완료: {saved_count}개 저장")
        return saved_count

    async def show_stats(self):
        """DB 통계를 표시합니다."""
        await self.init_database()

        async with async_session_maker() as db:
            service = SpotService(db)
            total = await service.count_spots()

            # Get counts by category
            category_counts = {}
            for category in Category:
                spots, count = await service.get_spots_by_category(
                    category, page=1, page_size=1
                )
                category_counts[category.value] = count

        print("\n" + "=" * 50)
        print("📊 K-Culture Spot 데이터베이스 통계")
        print("=" * 50)
        print(f"\n총 스팟 수: {total}개")
        print("\n카테고리별:")
        for category, count in category_counts.items():
            print(f"  - {category}: {count}개")
        print("=" * 50)


def create_parser() -> argparse.ArgumentParser:
    """CLI 파서를 생성합니다."""
    parser = argparse.ArgumentParser(
        description="K-Culture Spot 데이터 로더",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  # JSON 파일에서 데이터 로드
  python scripts/data_loader_cli.py load-json

  # Tour API에서 드라마 촬영지 크롤링
  python scripts/data_loader_cli.py crawl-tour -k "도깨비" -k "사랑의 불시착"

  # 웹 스크래핑으로 드라마 촬영지 수집
  python scripts/data_loader_cli.py scrape --drama "이태원 클라쓰"

  # K-pop 관련 장소 스크래핑
  python scripts/data_loader_cli.py scrape --artist "BTS"

  # DB 통계 확인
  python scripts/data_loader_cli.py stats
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="명령어")

    # load-json command
    json_parser = subparsers.add_parser(
        "load-json",
        help="JSON 파일들을 DB에 로드"
    )
    json_parser.add_argument(
        "-p", "--path",
        help="test_db 폴더 경로 (기본값: 프로젝트 루트/test_db)"
    )

    # crawl-tour command
    tour_parser = subparsers.add_parser(
        "crawl-tour",
        help="Tour API에서 데이터 크롤링"
    )
    tour_parser.add_argument(
        "-k", "--keyword",
        action="append",
        dest="keywords",
        required=True,
        help="검색 키워드 (여러 개 지정 가능)"
    )
    tour_parser.add_argument(
        "-c", "--category",
        default="drama",
        choices=["drama", "kpop", "movie", "variety"],
        help="카테고리 (기본값: drama)"
    )
    tour_parser.add_argument(
        "-l", "--limit",
        type=int,
        default=20,
        help="각 키워드당 최대 결과 수 (기본값: 20)"
    )

    # scrape command
    scrape_parser = subparsers.add_parser(
        "scrape",
        help="웹에서 데이터 스크래핑"
    )
    scrape_parser.add_argument(
        "--drama",
        dest="drama_name",
        help="드라마 이름"
    )
    scrape_parser.add_argument(
        "--artist",
        dest="artist_name",
        help="K-pop 아티스트 이름"
    )
    scrape_parser.add_argument(
        "-l", "--limit",
        type=int,
        default=10,
        help="최대 결과 수 (기본값: 10)"
    )

    # stats command
    subparsers.add_parser("stats", help="DB 통계 확인")

    # all command (load all data)
    all_parser = subparsers.add_parser(
        "all",
        help="모든 데이터 소스에서 데이터 로드"
    )
    all_parser.add_argument(
        "--skip-tour",
        action="store_true",
        help="Tour API 크롤링 스킵"
    )

    return parser


async def main():
    """메인 함수."""
    parser = create_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    cli = DataLoaderCLI()

    print("\n" + "=" * 50)
    print("🇰🇷 K-Culture Spot 데이터 로더")
    print("=" * 50)

    if args.command == "load-json":
        await cli.load_json_data(args.path)

    elif args.command == "crawl-tour":
        await cli.crawl_tour_api(
            keywords=args.keywords,
            category=args.category,
            limit=args.limit
        )

    elif args.command == "scrape":
        if not args.drama_name and not args.artist_name:
            print("오류: --drama 또는 --artist 중 하나 이상을 지정해야 합니다.")
            return
        await cli.scrape_web(
            drama_name=args.drama_name,
            artist_name=args.artist_name,
            limit=args.limit
        )

    elif args.command == "stats":
        await cli.show_stats()

    elif args.command == "all":
        print("\n📂 JSON 데이터 로드 중...")
        await cli.load_json_data()

        if not args.skip_tour:
            print("\n🌐 Tour API 크롤링 중...")
            default_keywords = [
                "도깨비", "사랑의 불시착", "이태원 클라쓰",
                "BTS", "BLACKPINK"
            ]
            await cli.crawl_tour_api(default_keywords)

        await cli.show_stats()

    print("\n✅ 완료!")


if __name__ == "__main__":
    asyncio.run(main())
