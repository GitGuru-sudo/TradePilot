from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class OrderBase(BaseModel):
    symbol: str
    side: Literal["BUY", "SELL"]
    order_type: Literal["MARKET", "LIMIT"]
    quantity: float
    price: Optional[float] = None

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: str
    user_id: str
    order_id: str
    status: str
    executed_qty: float
    avg_price: float
    created_at: datetime

    class Config:
        from_attributes = True
