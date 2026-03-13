from fastapi import APIRouter, Depends, HTTPException
from models.order_models import OrderCreate, OrderResponse
from services.trading_service import trading_service
from auth.dependencies import get_current_user
from typing import List
from utils.logger import logger

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=dict)
async def create_order(
    order_req: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["user_id"]
        result = await trading_service.place_order(user_id, order_req)
        return result
    except RuntimeError as e:
        logger.error(f"Infrastructure error in create_order: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"API Error in create_order: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[dict])
async def get_orders(
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["user_id"]
        orders = await trading_service.get_order_history(user_id)
        return orders
    except RuntimeError as e:
        logger.error(f"Infrastructure error in get_orders: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"API Error in get_orders: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")
