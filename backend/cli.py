import asyncio
import argparse
import sys
from clients.binance_client import binance_client
from utils.logger import logger
from utils.validators import positive_float, trading_symbol

async def place_order_cli(symbol, side, order_type, quantity, price):
    try:
        order_summary = {
            "symbol": symbol,
            "side": side,
            "type": order_type,
            "quantity": quantity,
            "price": price if order_type == "LIMIT" else None,
        }
        logger.info(f"CLI order request: {order_summary}")

        print("\n--- Order Request ---")
        print(f"Symbol: {symbol}")
        print(f"Side: {side}")
        print(f"Type: {order_type}")
        print(f"Quantity: {quantity}")
        if order_type == "LIMIT":
            print(f"Price: {price}")
        print("---------------------")

        order = await binance_client.place_futures_order(
            symbol=symbol,
            side=side,
            order_type=order_type,
            quantity=float(quantity),
            price=float(price) if price else None
        )
        
        print("\n--- Order Result ---")
        print(f"Order ID: {order.get('orderId')}")
        print(f"Symbol: {order.get('symbol')}")
        print(f"Status: {order.get('status')}")
        print(f"Type: {order.get('type')}")
        print(f"Side: {order.get('side')}")
        print(f"Avg Price: {order.get('avgPrice')}")
        print(f"Executed Qty: {order.get('executedQty')}")
        print("Status Message: Order processed successfully in mock mode.")
        print("--------------------\n")

    except Exception as e:
        print(f"Order failed: {e}")
        logger.error(f"CLI Error: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Binance Futures CLI Trading Tool")
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    order_parser = subparsers.add_parser("order", help="Place a futures order")
    order_parser.add_argument("--symbol", required=True, type=trading_symbol, help="Trading symbol (e.g., BTCUSDT)")
    order_parser.add_argument("--side", required=True, choices=["BUY", "SELL"], help="Order side")
    order_parser.add_argument("--type", required=True, choices=["MARKET", "LIMIT"], help="Order type")
    order_parser.add_argument("--quantity", required=True, type=positive_float, help="Order quantity")
    order_parser.add_argument("--price", type=positive_float, help="Limit price (required for LIMIT orders)")

    args = parser.parse_args()

    if args.command == "order":
        if args.type == "LIMIT" and not args.price:
            print("Error: --price is required for LIMIT orders")
            sys.exit(1)
            
        asyncio.run(place_order_cli(
            args.symbol, 
            args.side, 
            args.type, 
            args.quantity, 
            args.price
        ))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
