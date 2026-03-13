from clients.binance_client import binance_client
from db.order_repository import order_repository
from models.order_models import OrderCreate
from utils.logger import logger

class TradingService:
    async def place_order(self, user_id: str, order_request: OrderCreate):
        try:
            logger.info(f"User {user_id} placing {order_request.order_type} {order_request.side} order for {order_request.symbol}")
            
            # 1. Place order on Binance
            binance_order = await binance_client.place_futures_order(
                symbol=order_request.symbol,
                side=order_request.side,
                order_type=order_request.order_type,
                quantity=order_request.quantity,
                price=order_request.price
            )
            
            # 2. Save order result to Supabase
            saved_order = await order_repository.save_order(user_id, binance_order)
            
            return saved_order
        except Exception as e:
            logger.error(f"TradingService Error: {e}")
            raise e

    async def get_order_history(self, user_id: str):
        return await order_repository.get_user_orders(user_id)

trading_service = TradingService()
