from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes_orders import router as order_router
from api.routes_health import router as health_router
from auth.firebase_auth import initialize_firebase
from config.settings import settings
from utils.logger import logger

app = FastAPI(title=settings.PROJECT_NAME)

cors_origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(order_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the Binance Trading Bot API...")
    initialize_firebase()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the Binance Trading Bot API...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
