import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.config import settings
from app.database import async_session_maker
from app.routers.v1 import places, categories
from app.routers.v1.admin import places as admin_places

# Configure structured logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Saarthi API",
    version=settings.APP_VERSION,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.cors_methods_list,
    allow_headers=settings.cors_headers_list,
)

import uuid

# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    response.headers["X-Request-ID"] = request_id
    logger.info(
        f"[{request_id}] {request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Latency: {process_time:.4f}s"
    )
    return response

# Include Routers
app.include_router(places.router, prefix=f"/api/{settings.APP_VERSION}")
app.include_router(categories.router, prefix=f"/api/{settings.APP_VERSION}")
app.include_router(admin_places.router, prefix=f"/api/{settings.APP_VERSION}/admin")

@app.on_event("startup")
async def startup_event():
    logger.info("Saarthi API started")

@app.get("/health", tags=["health"])
async def health_check():
    db_status = "disconnected"
    try:
        async with async_session_maker() as session:
            await session.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        
    return {
        "status": "healthy",
        "database": db_status,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }
