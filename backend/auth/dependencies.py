from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.firebase_auth import verify_token, initialize_firebase
import firebase_admin
from utils.logger import logger

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not firebase_admin._apps and not initialize_firebase():
        logger.error("Firebase is not initialized. Backend configuration is invalid.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service is unavailable due to server misconfiguration.",
        )

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
