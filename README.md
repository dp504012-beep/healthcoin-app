# HealthCoin MVP

HealthCoin is a local demo MVP for tracking health activity, calculating reward points, writing append-only ledger entries, and deriving a wallet balance from the ledger.

This repository is a demo release candidate foundation. It does not include blockchain integration, token contracts, NFTs, smart contracts, or on-chain settlement.

## Current MVP Scope

The current demo flow is:

```txt
Register -> Submit Activity -> Create Ledger Entry -> Wallet Balance Updates
```

Implemented scope:

- User registration and login
- Activity submission with step validation
- Reward calculation from persisted activity
- Ledger reward entry creation
- Wallet balance and history derived from ledger entries
- React frontend for the demo workflow
- SQLite persistence for local development/demo use
- Backend tests for the core flow

Not included in this release candidate:

- JWT/session authentication
- Blockchain or smart contract integration
- Token issuance
- NFT logic
- Production deployment configuration

## Tech Stack

Backend:

- Node.js
- TypeScript
- Express
- SQLite
- Jest
- Supertest
- bcryptjs

Frontend:

- React
- Vite
- JavaScript
- Plain CSS

## Backend Setup

Install dependencies from the repository root:

```bash
npm install
```

Create a backend `.env` file if you need custom local values:

```bash
cp .env.example .env
```

Initialize the SQLite database:

```bash
npm run db:init
```

Start the backend:

```bash
npm run dev
```

Default backend URL:

```txt
http://localhost:3000
```

Health check:

```txt
GET http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Create a frontend `.env` file if the backend URL differs from the default:

```bash
cp .env.example .env
```

Start the frontend:

```bash
npm run dev
```

Default frontend URL:

```txt
http://127.0.0.1:5173
```

## Environment Variables

Backend `.env.example`:

```txt
PORT=3000
DATABASE_PATH=data/healthcoin.sqlite
```

Frontend `frontend/.env.example`:

```txt
VITE_API_BASE_URL=http://localhost:3000
```

## Database

The backend uses SQLite. By default, the database file is:

```txt
data/healthcoin.sqlite
```

Initialize tables safely with:

```bash
npm run db:init
```

The init command uses `CREATE TABLE IF NOT EXISTS`; it does not reset or overwrite existing data.

## Commands

Backend commands from the repository root:

```bash
npm run db:init
npm run dev
npm run build
npm test
npm run demo:seed
```

Frontend commands from `frontend/`:

```bash
npm run dev
npm run build
npm run preview
```

## Local Demo Flow

1. Start the backend:

```bash
npm run db:init
npm run dev
```

2. Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

3. Open the frontend URL.
4. Register a user.
5. Submit an activity with `2500` steps.
6. Create a ledger entry.
7. Open the wallet view.
8. Confirm wallet balance is `20`.

The expected result is `2500` steps -> `20` reward points -> wallet balance `20`.

More details:

- Demo guide: `docs/demo-flow.md`
- API reference: `docs/api.md`
