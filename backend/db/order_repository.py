from db.database import supabase
from models.order_models import OrderCreate, OrderResponse
from utils.logger import logger
from datetime import datetime
from postgrest.exceptions import APIError


def _translate_supabase_error(action: str, error: APIError) -> RuntimeError:
    if getattr(error, "code", None) == "PGRST205":
        return RuntimeError(
            "Supabase orders table is missing. Run backend/supabase/orders_schema.sql in the Supabase SQL editor."
        )

    if getattr(error, "code", None) == "42501":
        return RuntimeError(
            "Supabase blocked the write with Row Level Security. "
            "This backend uses Firebase auth, not Supabase auth, so server-side writes should use "
            "SUPABASE_SERVICE_ROLE_KEY instead of the public anon key. "
            "If you intentionally want client-scoped RLS, add an INSERT policy for orders."
        )

    return RuntimeError(f"Supabase failed to {action}: {error.message}")

class OrderRepository:
    def __init__(self):
        self.table = "orders"

    async def save_order(self, user_id: str, order_data: dict):
        try:
            data = {
                "user_id": user_id,
                "symbol": order_data.get("symbol"),
                "side": order_data.get("side"),
                "type": order_data.get("type"),
                "quantity": float(order_data.get("origQty", 0)),
                "price": float(order_data.get("price", 0)),
                "order_id": str(order_data.get("orderId")),
                "status": order_data.get("status"),
                "executed_qty": float(order_data.get("executedQty", 0)),
                "avg_price": float(order_data.get("avgPrice", 0)),
                "created_at": datetime.now().isoformat()
            }
            
            response = supabase.table(self.table).insert(data).execute()
            logger.info(f"Order saved to Supabase: {order_data.get('orderId')}")
            return response.data[0] if response.data else None
        except APIError as e:
            logger.error(f"Supabase API error while saving order: {e}")
            raise _translate_supabase_error("save the order", e)
        except Exception as e:
            logger.error(f"Error saving order to Supabase: {e}")
            raise e

    async def get_user_orders(self, user_id: str):
        try:
            response = supabase.table(self.table).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data
        except APIError as e:
            logger.error(f"Supabase API error while fetching orders for user {user_id}: {e}")
            raise _translate_supabase_error("fetch orders", e)
        except Exception as e:
            logger.error(f"Error fetching orders for user {user_id}: {e}")
            raise e

order_repository = OrderRepository()
