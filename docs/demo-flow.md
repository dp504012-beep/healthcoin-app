# HealthCoin Demo Flow

This guide runs the current local MVP demo.

## Prerequisites

Install backend and frontend dependencies:

```bash
npm install
cd frontend
npm install
cd ..
```

## 1. Start Backend

From the repository root:

```bash
npm run db:init
npm run dev
```

Expected backend URL:

```txt
http://localhost:3000
```

Optional health check:

```txt
GET http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

## 2. Start Frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL, usually:

```txt
http://127.0.0.1:5173
```

## 3. Register User

Use the sign-in form and click `Register`.

Example credentials:

```txt
Email: demo@example.com
Password: demo123
```

Expected result:

- App opens the dashboard.
- Active user ID is shown.
- Reward points start at `0`.
- Wallet balance starts at `0`.

## 4. Submit Activity

Open `Activity`.

Submit:

```txt
Steps: 2500
```

Expected result:

- Activity is created.
- App moves to `Ledger`.
- Latest activity ID is shown.

## 5. Create Ledger Entry

On `Ledger`, click:

```txt
Create Ledger Entry
```

Expected result:

- Backend recomputes reward points from the persisted activity.
- The app moves to `Wallet`.

## 6. Verify Wallet

On `Wallet`, verify:

```txt
Balance: 20
```

Expected result:

```txt
2500 steps -> 20 points -> wallet balance 20
```

Wallet balance is derived from ledger entries. It is not stored directly.

## Optional Seed

You can create a repeatable demo baseline:

```bash
npm run db:init
npm run demo:seed
```

The seed command does not reset or overwrite existing data. If the demo user already has ledger entries, it reports the existing state and exits.
