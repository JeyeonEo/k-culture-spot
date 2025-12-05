"""
test_db 폴더의 JSON 파일들을 데이터베이스에 로드하는 스크립트.
"""
import asyncio
import json
import os
from pathlib import Path
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_maker, init_db
from app.models.spot import Category, ContentType
from app.schemas.spot import SpotCreate, RelatedContentCreate
from app.services.spot_service import SpotService


# 프로젝트 루트 경로
PROJECT_ROOT = Path(__file__).parent.parent
TEST_DB_PATH = PROJECT_ROOT / "test_db"


# 카테고리 매핑: JSON 파일이 있는 폴더명 -> DB 카테고리
CATEGORY_MAPPING = {
    "drama": Category.DRAMA,
    "idol": Category.KPOP,  # idol 폴더는 kpop 카테고리로 매핑
    "movie": Category.MOVIE,
    "kpop": Category.KPOP,
    "variety": Category.VARIETY,
}


# 콘텐츠 타입 매핑: JSON의 content_type -> DB의 ContentType
CONTENT_TYPE_MAPPING = {
    "drama": ContentType.DRAMA,
    "movie": ContentType.MOVIE,
    "music": ContentType.MUSIC,
    "variety": ContentType.VARIETY,
}


def load_json_file(file_path: Path) -> dict:
    """JSON 파일을 로드합니다."""
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_spot_from_json(
    json_data: dict, folder_category: str
) -> SpotCreate:
    """JSON 데이터를 SpotCreate 스키마로 변환합니다."""
    # 카테고리 결정: JSON의 category 필드 우선, 없으면 폴더명 기반
    category_str = json_data.get("category", folder_category).lower()
    category = CATEGORY_MAPPING.get(category_str, Category.DRAMA)

    # Spot 데이터 구성
    spot_data = {
        "name": json_data["name"],
        "description": json_data.get("description"),
        "name_en": json_data.get("name_en"),
        "description_en": json_data.get("description_en"),
        "name_ja": json_data.get("name_ja"),
        "description_ja": json_data.get("description_ja"),
        "name_zh": json_data.get("name_zh"),
        "description_zh": json_data.get("description_zh"),
        "address": json_data.get("address"),
        "address_en": json_data.get("address_en"),
        "latitude": json_data.get("latitude"),
        "longitude": json_data.get("longitude"),
        "category": category,
        "image_url": json_data.get("image_url"),
        "images": json_data.get("images", []),
        "phone": json_data.get("phone"),
        "website": json_data.get("website"),
        "hours": json_data.get("hours"),
        "tags": json_data.get("tags", []),
        "content_id": json_data.get("content_id"),
    }

    # Related contents 파싱
    related_contents_data = json_data.get("related_contents", [])
    related_contents = []
    for content in related_contents_data:
        content_type_str = content.get("content_type", "drama").lower()
        content_type = CONTENT_TYPE_MAPPING.get(
            content_type_str, ContentType.DRAMA
        )

        related_content = RelatedContentCreate(
            title=content["title"],
            title_en=content.get("title_en"),
            title_ja=content.get("title_ja"),
            title_zh=content.get("title_zh"),
            content_type=content_type,
            year=content.get("year"),
            image_url=content.get("image_url"),
        )
        related_contents.append(related_content)

    spot_create = SpotCreate(**spot_data, related_contents=related_contents)
    return spot_create


async def load_test_data(
    db: AsyncSession, 
    test_db_path: Optional[Path] = None,
    silent: bool = False
) -> tuple[int, int]:
    """
    test_db 폴더의 모든 JSON 파일을 데이터베이스에 로드합니다.
    
    Args:
        db: 데이터베이스 세션
        test_db_path: test_db 폴더 경로 (기본값: 프로젝트 루트/test_db)
        silent: True이면 출력을 최소화합니다
    
    Returns:
        (loaded_count, skipped_count): 로드된 항목 수, 스킵된 항목 수
    """
    service = SpotService(db)
    
    if test_db_path is None:
        test_db_path = TEST_DB_PATH
    
    if not test_db_path.exists():
        if not silent:
            print(f"경고: test_db 폴더를 찾을 수 없습니다: {test_db_path}")
        return 0, 0

    loaded_count = 0
    skipped_count = 0

    # 각 카테고리 폴더 순회
    for category_folder in test_db_path.iterdir():
        if not category_folder.is_dir():
            continue

        category_name = category_folder.name
        if not silent:
            print(f"\n처리 중: {category_name} 카테고리...")

        # 해당 폴더의 모든 JSON 파일 처리
        for json_file in category_folder.glob("*.json"):
            try:
                if not silent:
                    print(f"  - {json_file.name} 로드 중...")

                # JSON 파일 로드
                json_data = load_json_file(json_file)

                # Spot 데이터 파싱
                spot_create = parse_spot_from_json(json_data, category_name)

                # 중복 체크: content_id가 있으면 기존 항목 확인
                if spot_create.content_id:
                    existing_spot = await service.get_spot_by_content_id(
                        spot_create.content_id
                    )
                    if existing_spot:
                        if not silent:
                            print(f"    ⏭️  스킵: content_id '{spot_create.content_id}' 이미 존재")
                        skipped_count += 1
                        continue

                # 데이터베이스에 저장
                spot = await service.create_spot(spot_create)
                if not silent:
                    print(f"    ✅ 저장 완료: {spot.name} (ID: {spot.id})")
                loaded_count += 1

            except Exception as e:
                if not silent:
                    print(f"    ❌ 오류 발생 ({json_file.name}): {str(e)}")
                    import traceback
                    traceback.print_exc()
                else:
                    raise

    return loaded_count, skipped_count


async def main():
    """메인 실행 함수."""
    print("=" * 60)
    print("test_db 데이터 로드 스크립트")
    print("=" * 60)

    # 데이터베이스 초기화
    print("\n데이터베이스 초기화 중...")
    await init_db()

    # 데이터 로드
    async with async_session_maker() as db:
        loaded, skipped = await load_test_data(db)

    print("\n" + "=" * 60)
    print("로드 완료!")
    print(f"  - 로드된 항목: {loaded}개")
    print(f"  - 스킵된 항목: {skipped}개")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
