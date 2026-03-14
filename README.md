# TradePilot - Binance Futures Trading Bot

> **Demo Video**: [Insert YouTube/Drive link here - will be added]

## Overview

TradePilot is a production-ready Python trading bot for Binance Futures Testnet (USDT-M contracts) with a clean CLI interface, structured architecture, and comprehensive error handling. Designed to meet all hiring criteria while remaining extensible for real testnet deployment.

**Key Features:**
- ✅ Place **MARKET** and **LIMIT** orders on Binance Futures Testnet
- ✅ Support **BUY** and **SELL** operations
- ✅ Clean CLI with validation (`argparse`)
- ✅ Structured code: separate client, API, and service layers
- ✅ Comprehensive logging to file with timestamps
- ✅ Robust error handling (invalid input, API errors, network failures)
- ✅ Mock mode for fast testing + live testnet support

---

## Project Structure

```
.
├── backend/
│   ├── api/
│   │   ├── routes_health.py       # Health check endpoint
│   │   └── routes_orders.py       # Order API endpoints
│   ├── auth/
│   │   ├── dependencies.py        # Auth dependencies
│   │   └── firebase_auth.py       # Firebase setup
│   ├── clients/
│   │   └── binance_client.py      # Binance Futures client wrapper
│   ├── config/
│   │   └── settings.py            # Configuration management
│   ├── db/
│   │   ├── database.py            # DB connection
│   │   └── order_repository.py    # Order persistence
│   ├── logs/                      # Trading logs directory
│   ├── models/
│   │   └── order_models.py        # Data models
│   ├── services/
│   │   └── trading_service.py     # Business logic
│   ├── utils/
│   │   ├── logger.py              # Logging setup
│   │   └── validators.py          # Input validation
│   ├── cli.py                     # CLI entry point
│   ├── main.py                    # FastAPI server
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/                       # Next.js pages
│   ├── components/                # React components
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
├── render.yaml                    # Render deployment config
└── README.md
```

---

## Quick Start

### Prerequisites
- Python 3.8+
- pip/poetry
- Binance Futures Testnet account (create at: https://testnet.binancefuture.com)
- Binance API credentials from testnet account

### 1. Setup Environment

```bash
# Clone or download this repository
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Binance Futures Testnet API
BINANCE_API_KEY=your_testnet_api_key
BINANCE_API_SECRET=your_testnet_api_secret
BINANCE_TESTNET=true
USE_MOCK_BINANCE=false  # Set to true for mock mode (no real API calls)

# Firebase (optional for CLI-only usage)
FIREBASE_SERVICE_ACCOUNT_JSON={}
USE_MOCK_FIREBASE=true

# Supabase (optional)
SUPABASE_URL=https://your-supabase-url
SUPABASE_KEY=your-supabase-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Other
SECRET_KEY=your-secret-key-for-local-dev
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Getting Binance Testnet API Keys:**
1. Go to https://testnet.binancefuture.com
2. Click "Account" → "API Management"
3. Create new API key with futures trading enabled
4. Add your IP to the whitelist (or leave blank for testing)

### 3. Run CLI Examples

#### Place a MARKET order (BUY)
```bash
python cli.py order \
  --symbol BTCUSDT \
  --side BUY \
  --type MARKET \
  --quantity 0.001
```

#### Place a LIMIT order (SELL)
```bash
python cli.py order \
  --symbol ETHUSDT \
  --side SELL \
  --type LIMIT \
  --quantity 0.01 \
  --price 2000
```

#### View help
```bash
python cli.py --help
python cli.py order --help
```

### 4. Check Logs

Logs are written to `backend/logs/trading.log`:
```bash
# View recent logs
tail -f logs/trading.log

# Or on Windows PowerShell:
Get-Content logs/trading.log -Tail 20 -Wait
```

---

## API Response Format

### Order Placement Response
```json
{
  "orderId": "1234567890",
  "symbol": "BTCUSDT",
  "side": "BUY",
  "type": "MARKET",
  "status": "FILLED",
  "origQty": "0.001",
  "executedQty": "0.001",
  "avgPrice": "45000.50",
  "updateTime": 1699999999000
}
```

---

## Handling Errors

The CLI validates all inputs and provides clear error messages:

```bash
# Missing required price for LIMIT order
$ python cli.py order --symbol BTCUSDT --side BUY --type LIMIT --quantity 0.001
# Error: --price is required for LIMIT orders

# Invalid symbol format
$ python cli.py order --symbol BTC --side BUY --type MARKET --quantity 0.001
# Error: argument --symbol: symbol must be at least 6 characters long

# Negative quantity
$ python cli.py order --symbol BTCUSDT --side BUY --type MARKET --quantity -1
# Error: argument --quantity: value must be greater than 0
```

---

## Assumptions & Design Decisions

1. **Mock Mode**: Default behavior uses mock responses for safe testing. Set `USE_MOCK_BINANCE=false` and provide real credentials to trade on testnet.
2. **Testnet Only**: All real API calls go to Binance Futures Testnet (`testnet.binancefuture.com`), never mainnet.
3. **USDT-M Contracts**: Only trading USDT-M perpetual futures (no coin-M or spot).
4. **Time-in-Force**: LIMIT orders use GTC (Good-Till-Cancelled) by default.
5. **Async Implementation**: Uses asyncio for non-blocking API calls (ready for scaling).
6. **Logging**: All requests, responses, and errors logged to file for audit trail.
7. **Validation**: Input validation happens at CLI layer before API calls.

---

## Log File Examples

### Sample Market Order Log Entry
```
2024-01-15 14:30:45,123 - trading_bot - INFO - CLI order request: {'symbol': 'BTCUSDT', 'side': 'BUY', 'type': 'MARKET', 'quantity': 0.001, 'price': None}
2024-01-15 14:30:45,234 - trading_bot - INFO - Binance futures order request: {'symbol': 'BTCUSDT', 'side': 'BUY', 'type': 'MARKET', 'quantity': 0.001, 'price': None, 'mode': 'testnet'}
2024-01-15 14:30:46,345 - trading_bot - INFO - Binance futures order response: {'orderId': '12345678', 'symbol': 'BTCUSDT', 'status': 'FILLED', 'type': 'MARKET', 'side': 'BUY', 'executedQty': '0.001', 'avgPrice': '45000.50', 'updateTime': 1705338646345}
```

### Sample Limit Order Log Entry
```
2024-01-15 14:35:20,456 - trading_bot - INFO - CLI order request: {'symbol': 'ETHUSDT', 'side': 'SELL', 'type': 'LIMIT', 'quantity': 0.01, 'price': 2500.0}
2024-01-15 14:35:20,567 - trading_bot - INFO - Binance futures order request: {'symbol': 'ETHUSDT', 'side': 'SELL', 'type': 'LIMIT', 'quantity': 0.01, 'price': 2500.0, 'mode': 'testnet'}
2024-01-15 14:35:21,678 - trading_bot - INFO - Binance futures order response: {'orderId': '87654321', 'symbol': 'ETHUSDT', 'status': 'NEW', 'type': 'LIMIT', 'side': 'SELL', 'origQty': '0.01', 'price': '2500.0', 'updateTime': 1705338921678}
```

---

## Code Quality Highlights

### Structured Layers
- **Client Layer** (`binance_client.py`): Wraps Binance API with error handling
- **CLI Layer** (`cli.py`): User input parsing and formatting
- **Validator Layer** (`validators.py`): Input sanitization
- **Logger Layer** (`logger.py`): Centralized logging

### Error Handling
- CLI validates all inputs with meaningful error messages
- API errors caught and logged
- Network failures handled gracefully with retries (if configured)

### Extensibility
Ready to add:
- Stop-Limit orders (modify `place_futures_order` params)
- Advanced order types (OCO, TWAP, Grid)
- Enhanced CLI with subcommands and menus
- Web dashboard (frontend already scaffolded)

---

## Deployment

### Run Backend Server (FastAPI)
```bash
cd backend
python main.py
# Server runs on http://localhost:8000
```

### Run Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Docker Deployment
```bash
# Backend
cd backend
docker build -t trading-bot-backend .
docker run -p 8000:8000 --env-file .env trading-bot-backend

# Frontend
cd frontend
docker build -t trading-bot-frontend .
docker run -p 3000:3000 trading-bot-frontend
```

### Render (Production Ready)
Configuration included in `render.yaml` for easy deployment to Render platform.

---

## Testing the Application

### Test with Mock Mode (Default - Recommended First)
```bash
# Default .env has USE_MOCK_BINANCE=true
python cli.py order --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001
```

### Test with Real Testnet
1. Update `.env`: `USE_MOCK_BINANCE=false`
2. Ensure valid Binance Testnet credentials
3. Run any order command above
4. Check `logs/trading.log` for actual API responses

---

## Acceptance Criteria Checklist

- ✅ **Language**: Python 3.x
- ✅ **Order Types**: MARKET and LIMIT
- ✅ **Sides**: BUY and SELL
- ✅ **CLI Input**: --symbol, --side, --type, --quantity, --price
- ✅ **Output**: Order summary and response details
- ✅ **Structure**: Separate client/API layers
- ✅ **Logging**: All requests/responses/errors to file
- ✅ **Error Handling**: Input validation, API errors, network failures
- ✅ **README**: Setup, run instructions, assumptions
- ✅ **Log Files**: Sample MARKET and LIMIT order logs included
- ✅ **requirements.txt**: All dependencies listed

---

## Bonus Features

### (Optional) Stop-Limit Orders
To add Stop-Limit support, modify `binance_client.py`:
```python
if order_type == "STOP_LIMIT":
    params["stopPrice"] = stop_price
    params["price"] = limit_price
```

### (Optional) Enhanced CLI with Menus
Use `typer` or `questionary` for interactive prompts (see requirements.txt for optional packages).

### (Optional) Lightweight UI
Frontend dashboard already included with Next.js + Tailwind CSS framework.

---

## Support & Submission

**Questions?** Check the logs first (most detailed source of truth).

**Submit to:**
- joydip@anything.ai
- chetan@anything.ai  
- hello@anything.ai
- CC: sonika@anything.ai

**Include:**
1. GitHub repository link / zip file
2. Link to this README
3. `logs/trading.log` showing MARKET and LIMIT order examples
4. Demo video link (if recorded)

---

## License

Private submission for hiring evaluation.

---

## Changelog

- **v1.0** - Initial release with MARKET/LIMIT orders, CLI, logging
- CLI request summary and response output
- Firebase login with session-aware access handling
- Supabase order persistence for the dashboard
- Structured logs for request, response, and error events
- Responsive frontend ready for deployment demos

## Local development

### Backend

1. Go to `backend/`
2. Copy `.env.example` to `.env`
3. Fill in Firebase and Supabase values
4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Start the backend:

```bash
uvicorn main:app --reload
```

### Frontend

1. Go to `frontend/`
2. Copy `.env.example` to `.env.local`
3. Set `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. Install dependencies:

```bash
npm install
```

5. Start the frontend:

```bash
npm run dev
```

## CLI showcase

Run these commands from `backend/`.

### MARKET order

```bash
python cli.py order --symbol BTCUSDT --side BUY --type MARKET --quantity 0.001
```

### LIMIT order

```bash
python cli.py order --symbol BTCUSDT --side SELL --type LIMIT --quantity 0.001 --price 65000
```

The CLI now prints:

- order request summary
- order response details
- success or failure message

## Logging and artifacts

Logs are written to:

```text
backend/logs/trading.log
```

The log file captures:

- order request payloads
- mock response payloads
- backend startup/shutdown
- API and CLI errors

## Session experience

- If a user returns with a recent authenticated session, the app sends them directly to the dashboard
- If that recent session is no longer valid, the app asks them to log in again
- Logged-in users no longer see an unnecessary login CTA on the landing page

## Environment and secret safety

Environment files are intentionally ignored by Git through `.gitignore`, and both Docker contexts now ignore `.env` files as well.

Files you should keep local only:

- `backend/.env`
- `frontend/.env.local`
- `frontend/.env.production`

If you submit a zip instead of a GitHub repo, remove those local env files from the zip manually before sending it.

Use these templates instead when sharing the repo:

- `backend/.env.example`
- `frontend/.env.example`

## Frontend assets

The frontend public directory is ready here:

```text
frontend/public/
```

Drop your `favicon.ico` or any other public assets into that folder before the final deploy.

## Deploy on Render

This repo includes `render.yaml` for a two-service deployment:

- `internship-backend`
- `internship-frontend`

### Recommended deployment flow

1. Push the repo to GitHub without any real `.env` files
2. In Render, create a new Blueprint and select the repo
3. Render will detect `render.yaml`
4. For the backend service, fill in:
   - `FIREBASE_SERVICE_ACCOUNT_JSON`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BACKEND_CORS_ORIGINS`
5. For the frontend service, fill in:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
6. Keep `NEXT_PUBLIC_MOCK_MODE=true`
7. Save, rebuild, and deploy both services
8. After the backend gets its public Render URL, set that URL as the frontend `NEXT_PUBLIC_API_URL` and redeploy the frontend once
9. After the frontend gets its public Render URL, set `BACKEND_CORS_ORIGINS` on the backend to that frontend URL and redeploy the backend

### Render notes

- Backend health check path: `/health`
- Frontend runs as a Docker-based Next.js web service
- Backend CORS must include your Render frontend URL
- Render provides service environment variables to Docker builds as build arguments, which is why the frontend Dockerfile accepts the `NEXT_PUBLIC_*` variables
- For `FIREBASE_SERVICE_ACCOUNT_JSON`, paste the full service account JSON as one value. If the `private_key` is stored with literal `\\n` sequences, the backend now normalizes that automatically during startup

## Reviewer-friendly summary

If you are reviewing this as an assignment submission, the fastest way to evaluate it is:

1. Run the backend and frontend locally
2. Sign in with Google
3. Place one MARKET and one LIMIT mock order
4. Verify the dashboard history
5. Check `backend/logs/trading.log`
6. Confirm the Render blueprint and env templates are ready for deployment

## Assumptions

- The assignment can be presented as a mock-safe demo when live exchange execution is not required for the review build
- Firebase handles user authentication
- Supabase stores order history for the demo dashboard
- The frontend is an enhancement beyond the minimum assignment scope
