# k-culture-spot

한국 문화 명소 서비스

## 기술 스택

- **Backend**: Python 3.11, FastAPI
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Container**: Docker, Docker Compose

## 시작하기

### 필수 조건

- Docker
- Docker Compose

### 개발 환경 실행

```bash
# 모든 서비스 시작
docker compose up -d

# 로그 확인
docker compose logs -f

# 서비스 중지
docker compose down
```

### 개별 서비스 실행

```bash
# 앱만 빌드
docker compose build app

# 데이터베이스만 시작
docker compose up -d db

# 특정 서비스 로그 확인
docker compose logs -f app
```

### 접속 정보

- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 프로젝트 구조

```
k-culture-spot/
├── app/                    # 애플리케이션 코드
│   ├── main.py            # FastAPI 앱 엔트리포인트
│   ├── api/               # API 라우터
│   ├── models/            # SQLAlchemy 모델
│   ├── schemas/           # Pydantic 스키마
│   └── services/          # 비즈니스 로직
├── tests/                  # 테스트 코드
├── Dockerfile             # Docker 이미지 설정
├── docker-compose.yml     # 서비스 오케스트레이션
└── requirements.txt       # Python 의존성
```