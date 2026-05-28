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

Install dependencies and initialize SQLite from the project root:

```bash
npm install
npm run db:init
```

Start the backend:

```bash
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
3. View reward points calculated from persisted activity.
4. Create a ledger reward entry manually.
5. Open wallet to view balance and ledger history.

Full flow:

```txt
Register/Login -> Activity -> Reward -> Ledger -> Wallet
```

Duplicate ledger entries for the same `activityId` are rejected with:

```txt
HTTP 409 Conflict
```

## Activity Validation

Activity input is validated before persistence.

Rules:

- `userId` must be a non-empty string.
- `steps` must be a number.
- `steps` must be an integer.
- `steps` must be greater than `0`.
- `steps` must be less than or equal to `100000`.

The current maximum is:

```txt
maxStepsPerActivity = 100000
```

Invalid activity input returns:

```txt
HTTP 400 Bad Request
```

## Storage

This MVP now uses SQLite storage.

SQLite setup:

```bash
npm run db:init
```

The database file is created at:

```txt
data/healthcoin.sqlite
```

Wallet balance is not stored directly. Wallet balance and history are derived from ledger entries.

No blockchain integration is included in this MVP.

## Latest Verification

Validation-hardening full flow test passed:

```txt
Register/Login -> Activity -> Reward -> Ledger -> Wallet
```

Verified:

- Invalid activity inputs return `HTTP 400`.
- Reward reads persisted activities.
- Ledger duplicate `activityId` returns `HTTP 409`.
- Wallet balance equals the sum of ledger history entries.
