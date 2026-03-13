export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED' | 'EXPIRED';

export interface Order {
    id: string;
    user_id: string;
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price?: number;
    order_id: string;
    status: OrderStatus;
    executed_qty: number;
    avg_price: number;
    created_at: string;
}

export interface CreateOrderRequest {
    symbol: string;
    side: OrderSide;
    order_type: OrderType;
    quantity: number;
    price?: number;
}
