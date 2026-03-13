from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.firebase_auth import verify_token, initialize_firebase
import firebase_admin
from utils.logger import logger

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    from config.settings import settings
    
    # Initialize Firebase if not already done
    if not firebase_admin._apps:
        initialize_firebase()
    
    # If using mock mode, allow any token
    if settings.USE_MOCK_FIREBASE:
        token = credentials.credentials
        logger.info(f"Mock mode enabled - accepting token: {token[:10]}...")
        return {
            "user_id": "mock_user",
            "email": "mock@example.com",
            "name": "Mock User"
        }

    token = credentials.credentials
    decoded_token = verify_token(token)
    
    if not decoded_token:
        logger.warning(f"Invalid or expired token presented: {token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Return user information from token
    return {
        "user_id": decoded_token.get("uid"),
        "email": decoded_token.get("email"),
        "name": decoded_token.get("name")
    }
