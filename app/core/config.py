from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "K-Culture Spot API"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/k_culture_spot"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Korea Tourism Organization API
    tour_api_key: str = ""
    tour_api_base_url: str = "http://apis.data.go.kr/B551011/KorService1"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
