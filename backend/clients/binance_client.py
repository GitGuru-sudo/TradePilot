from binance.client import Client
from binance.enums import *
from config.settings import settings
from utils.logger import logger
import asyncio

import uuid
import time

class BinanceFuturesClient:
    def __init__(self):
        self.is_mock = settings.USE_MOCK_BINANCE or settings.BINANCE_API_KEY == "mock"
        if not self.is_mock:
            self.client = Client(
                settings.BINANCE_API_KEY, 
                settings.BINANCE_API_SECRET,
                testnet=settings.BINANCE_TESTNET
            )
            logger.info(f"Binance Client initialized (Testnet: {settings.BINANCE_TESTNET})")
        else:
            logger.info("Binance Client initialized in MOCK mode.")

    async def place_futures_order(self, symbol: str, side: str, order_type: str, quantity: float, price: float = None):
        request_payload = {
            "symbol": symbol,
            "side": side,
            "type": order_type,
            "quantity": quantity,
            "price": price,
            "mode": "mock" if self.is_mock else "testnet",
        }
        logger.info(f"Binance futures order request: {request_payload}")

        if self.is_mock:
            mock_order = {
                "orderId": str(uuid.uuid4()),
                "symbol": symbol,
                "status": "FILLED",
                "type": order_type,
                "side": side,
                "origQty": quantity,
                "price": price or 65000.0,
                "avgPrice": price or 65000.0,
                "executedQty": quantity,
                "updateTime": int(time.time() * 1000)
            }
            logger.info(f"Binance futures order response: {mock_order}")
            return mock_order

        try:
            params = {
                "symbol": symbol,
                "side": side,
                "type": order_type,
                "quantity": quantity,
            }
            
            if order_type == "LIMIT":
                params["price"] = price
                params["timeInForce"] = TIME_IN_FORCE_GTC

            # Using loop.run_in_executor for the synchronous binance client calls
            loop = asyncio.get_event_loop()
            order = await loop.run_in_executor(
                None, 
                lambda: self.client.futures_create_order(**params)
            )
            
            logger.info(f"Binance futures order response: {order}")
            return order
        except Exception as e:
            logger.error(f"Error placing Binance Futures order: {e}")
            raise e

    async def get_futures_order_status(self, symbol: str, order_id: str):
        if self.is_mock:
            return {"status": "FILLED"}

        try:
            loop = asyncio.get_event_loop()
            status = await loop.run_in_executor(
                None,
                lambda: self.client.futures_get_order(symbol=symbol, orderId=order_id)
            )
            return status
        except Exception as e:
            logger.error(f"Error getting Binance Futures order status: {e}")
            raise e

binance_client = BinanceFuturesClient()
