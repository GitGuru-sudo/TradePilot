# TradePilot Mock Trading Demo

TradePilot is a polished mock-first trading bot experience built for fast reviewer comprehension. It combines a Python backend, a modern Next.js frontend, Firebase authentication, and Supabase-backed order history to demonstrate the full lifecycle of a Binance Futures workflow without placing real exchange trades.

## Why this project stands out

- Clean Python CLI for MARKET and LIMIT orders
- BUY and SELL coverage with validation and useful error messages
- Structured backend design with separate API, client, service, and repository layers
- Mock-safe trading flow for demos, assignment reviews, and portfolio deployment
- Frontend dashboard with Firebase login, order form, and order history
- Session-aware routing that reopens the dashboard for recent sign-ins
- Render-ready deployment blueprint for backend and frontend services

## Demo behavior

This repository is intentionally configured for mock trading:

- `USE_MOCK_BINANCE=True`
- Binance order responses are simulated in the backend
- the UI clearly labels mock mode
- recent signed-in sessions can reopen the dashboard directly

This approach keeps the project safe to demo publicly while still showcasing product thinking, architecture, and deployment readiness.

## Architecture

```text
backend/
  api/
  clients/
  config/
  db/
  logs/
  services/
  supabase/
  utils/
  cli.py
frontend/
  app/
  components/
  hooks/
  lib/
  public/
render.yaml
```

## Core capabilities

- Mock MARKET and LIMIT order placement
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
