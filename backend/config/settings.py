from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Binance API
    BINANCE_API_KEY: str
    BINANCE_API_SECRET: str
    BINANCE_TESTNET: bool = True
    USE_MOCK_BINANCE: bool = False

    # Firebase
    FIREBASE_SERVICE_ACCOUNT_JSON: str = "{}"
    USE_MOCK_FIREBASE: bool = False
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    # JWT 
    # (Optional if we only use Firebase Admin SDK for verification, 
    # but good to have if we issue our own tokens later)
    SECRET_KEY: str = "your-secret-key-for-local-dev"
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,https://internship-frontend-1.onrender.com"
    
    PROJECT_NAME: str = "Binance Futures Trading Bot"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
