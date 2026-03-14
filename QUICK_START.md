# Quick Start Guide - Binance Futures Trading Bot

This is a fast reference for running the trading bot. For detailed information, see [README.md](README.md).

## 1️⃣ One-Time Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 2️⃣ Configure Environment

Create `.env` file in `backend/` folder:

```env
BINANCE_API_KEY=your_testnet_key
BINANCE_API_SECRET=your_testnet_secret
BINANCE_TESTNET=true
USE_MOCK_BINANCE=true  # or false for real testnet trades
FIREBASE_SERVICE_ACCOUNT_JSON={}
USE_MOCK_FIREBASE=true
PROJECT_NAME="Binance Futures Trading Bot"
SECRET_KEY=your-secret-key
```

**Copy from template:** `cp .env.example .env`

## 3️⃣ Run CLI Commands

### Place MARKET Order (BUY)
```bash
python cli.py order \
  --symbol BTCUSDT \
  --side BUY \
  --type MARKET \
  --quantity 0.001
```

### Place LIMIT Order (SELL)
```bash
python cli.py order \
  --symbol ETHUSDT \
  --side SELL \
  --type LIMIT \
  --quantity 0.01 \
  --price 2500
```

### View Help
```bash
python cli.py --help
python cli.py order --help
```

## 4️⃣ Check Logs

```bash
# View logs
tail -f logs/trading.log
# or
Get-Content logs/trading.log -Tail 20 -Wait  # Windows PowerShell
```

## 5️⃣ Run Backend Server (Optional)

```bash
python main.py
# Server at http://localhost:8000
```

## Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'binance'` | Run `pip install -r requirements.txt` |
| `.env` file not loaded | Ensure file is in `backend/` directory with correct name |
| Price required for LIMIT | Use `--price` argument for LIMIT orders |
| Symbol invalid | Use format like `BTCUSDT`, `ETHUSDT`, etc. (min 6 chars) |

## Trading Symbols (Common)

- `BTCUSDT` - Bitcoin
- `ETHUSDT` - Ethereum  
- `ADAUSDT` - Cardano
- `XRPUSDT` - Ripple
- `DOGEUSDT` - Dogecoin

## Order Types

| Type | Usage | Price Required |
|------|-------|------------------|
| `MARKET` | Buy/sell immediately | ❌ No |
| `LIMIT` | Buy/sell at specific price | ✅ Yes |

## Next Steps

- 📖 Read full [README.md](README.md) for detailed documentation
- 🎦 Record your demo video showing CLI order placement
- 🔗 Get Binance Testnet API keys: https://testnet.binancefuture.com
- 📤 Submit repo link, video, and logs to hiring team
