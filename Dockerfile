# ===========================================
# HypeSpot Dockerfile (Security Hardened)
# ===========================================

# Python 3.11 기반 이미지 사용
FROM python:3.11-slim AS base

# 보안: 최소 권한 원칙
# PYTHONDONTWRITEBYTECODE: .pyc 파일 생성 방지
# PYTHONUNBUFFERED: stdout/stderr 버퍼링 비활성화
# PIP_NO_CACHE_DIR: pip 캐시 비활성화 (이미지 크기 감소)
# PYTHONHASHSEED: 해시 랜덤화 (보안)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONHASHSEED=random

# ===========================================
# Build Stage
# ===========================================
FROM base AS builder

WORKDIR /app

# 시스템 의존성 설치 (빌드용)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 파일 복사 및 설치
COPY requirements.txt .

# 가상 환경 생성 및 의존성 설치
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ===========================================
# Production Stage
# ===========================================
FROM base AS production

WORKDIR /app

# 런타임 의존성만 설치 (최소화)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean \
    && apt-get autoremove -y

# 빌드 스테이지에서 가상 환경 복사
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 비root 사용자 생성 (보안)
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser

# 애플리케이션 코드 복사
COPY --chown=appuser:appgroup . .

# 불필요한 파일 제거 (보안)
RUN rm -rf \
    .git \
    .gitignore \
    .env* \
    *.md \
    tests/ \
    docs/ \
    .pytest_cache/ \
    __pycache__/ \
    *.pyc \
    .mypy_cache/ \
    .ruff_cache/

# 보안: 파일 권한 설정
RUN chmod -R 550 /app && \
    chmod -R 770 /app/app

# 비root 사용자로 전환
USER appuser

# 포트 노출
EXPOSE 8000

# 헬스체크 (컨테이너 상태 모니터링)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 애플리케이션 실행
# --workers: CPU 코어 수에 맞게 조정
# --limit-concurrency: 동시 연결 제한
# --timeout-keep-alive: Keep-alive 타임아웃
CMD ["python", "-m", "uvicorn", "app.main:app", \
    "--host", "0.0.0.0", \
    "--port", "8000", \
    "--workers", "1", \
    "--limit-concurrency", "100", \
    "--timeout-keep-alive", "30", \
    "--no-access-log"]
