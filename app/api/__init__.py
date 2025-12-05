from fastapi import APIRouter
from app.api.spots import router as spots_router
from app.api.crawler import router as crawler_router
from app.api.contents import router as contents_router
from app.api.tours import router as tours_router

api_router = APIRouter(prefix="/api")
api_router.include_router(spots_router)
api_router.include_router(crawler_router)
api_router.include_router(contents_router)
api_router.include_router(tours_router)

__all__ = ["api_router"]
