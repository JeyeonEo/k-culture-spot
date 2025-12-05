# HypeSpot 🇰🇷

K-Culture 관련 한국 관광 명소 안내 서비스 - 외국인 관광객을 위한 드라마, K-POP, 영화 촬영지 정보 제공

## 주요 기능

- **다국어 지원**: 한국어, 영어, 일본어, 중국어
- **카테고리별 명소**: 드라마 촬영지, K-POP 명소, 영화 촬영지, 예능 촬영지
- **검색 기능**: 드라마명, 아이돌 이름, 장소명으로 검색
- **한국관광공사 API 연동**: 공식 관광 정보 자동 수집

## 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **i18n**: react-i18next
- **State**: React Query

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: SQLAlchemy 2.0

### Infrastructure
- **Container**: Docker, Docker Compose
- **Server**: Nginx (frontend)

## 시작하기

### 필수 조건

- Docker & Docker Compose
- Node.js 20+ (로컬 개발 시)
- Python 3.11+ (로컬 개발 시)

### 환경 변수 설정

```bash
cp .env.example .env
# .env 파일에서 TOUR_API_KEY 설정 (한국관광공사 API 키)
```

### Docker로 실행

```bash
# 모든 서비스 시작
docker compose up -d

# 로그 확인
docker compose logs -f

# 서비스 중지
docker compose down
```

### 로컬 개발 환경

```bash
# Backend
cd /home/user/hypespot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 접속 정보

| 서비스 | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## 프로젝트 구조

```
hypespot/
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── i18n/          # 다국어 설정
│   │   ├── api/           # API 클라이언트
│   │   └── types/         # TypeScript 타입
│   └── Dockerfile
├── app/                    # FastAPI 백엔드
│   ├── api/               # API 라우터
│   ├── models/            # SQLAlchemy 모델
│   ├── schemas/           # Pydantic 스키마
│   ├── services/          # 비즈니스 로직 + 크롤러
│   ├── core/              # 설정, DB 연결
│   └── main.py            # 앱 엔트리포인트
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

## API 엔드포인트

### Spots
- `GET /api/spots` - 명소 목록 (페이지네이션, 필터링)
- `GET /api/spots/{id}` - 명소 상세
- `GET /api/spots/featured` - 추천 명소
- `GET /api/spots/popular` - 인기 명소
- `GET /api/spots/search?q=` - 명소 검색
- `GET /api/spots/category/{category}` - 카테고리별 명소

### Crawler (관리용)
- `POST /api/crawler/drama` - 드라마 촬영지 크롤링
- `POST /api/crawler/kpop` - K-POP 명소 크롤링
- `GET /api/crawler/status` - 크롤러 상태

## 한국관광공사 API 설정

1. [공공데이터포털](https://www.data.go.kr/data/15101578/openapi.do) 에서 API 키 발급
2. `.env` 파일에 `TOUR_API_KEY` 설정
3. `/api/crawler/drama` 또는 `/api/crawler/kpop` 엔드포인트로 데이터 수집

## 라이선스

MIT License
