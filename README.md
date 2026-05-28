# HealthCoin MVP

HealthCoin is a minimal MVP for tracking health activity and rewards.

Current flow:

```txt
Register/Login -> Activity -> Reward -> Ledger -> Wallet
```

## Backend

The backend is an Express API running on:

```txt
http://localhost:3000
```

Start the backend from the project root:

```bash
npm install
npm run dev
```

Health check:

```txt
GET http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

## Frontend

The frontend is a React Vite app in the `frontend/` folder.

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite preview URL shown in the terminal, usually:

```txt
http://127.0.0.1:5173
```

## Manual Test Flow

1. Register or login with email and password.
2. Submit an activity with step count.
3. View reward points from the dashboard.
4. Create a ledger reward entry manually.
5. Open wallet to view balance and history.

## Storage

This MVP uses in-memory storage only.

Data resets whenever the backend server restarts.

No database, blockchain integration, or persistent wallet storage is included in this MVP.
