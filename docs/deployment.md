# HealthCoin Deployment Notes

HealthCoin Demo RC v1 is a local-first MVP. Do not deploy blockchain, token, NFT, or smart contract features for this release.

## Common Backend Commands

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Initialize SQLite tables:

```bash
npm run db:init
```

Start production server:

```bash
npm run start
```

The production start command runs compiled JavaScript:

```bash
node dist/index.js
```

## Backend Environment Variables

```txt
PORT=3000
DATABASE_PATH=data/healthcoin.sqlite
CORS_ORIGIN=http://localhost:5173
```

`CORS_ORIGIN` may contain one or more comma-separated frontend origins:

```txt
CORS_ORIGIN=http://localhost:5173,https://your-frontend.example.com
```

Local frontend origins are always allowed:

```txt
http://localhost:5173
http://127.0.0.1:5173
```

Do not use wildcard CORS for this demo unless the risk is explicitly accepted.

## Frontend Environment Variables

Set this before building the frontend:

```txt
VITE_API_BASE_URL=http://localhost:3000
```

For deployment, replace it with the deployed backend URL.

## SQLite Persistence Warning

SQLite writes to a local file. On cloud platforms, the database can be lost if the filesystem is ephemeral.

For any hosted demo:

- Use a single backend instance.
- Configure a persistent disk or volume.
- Set `DATABASE_PATH` to a path on that persistent disk.
- Run `npm run db:init` before starting or during release setup.
- Do not run `npm run demo:seed` automatically during normal startup.

## Option A: Render Backend + Vercel Frontend

Backend on Render:

- Root directory: repository root
- Install command: `npm install`
- Build command: `npm run build && npm run db:init`
- Start command: `npm run start`
- Environment variables:
  - `PORT`
  - `DATABASE_PATH`
  - `CORS_ORIGIN`
- Add a Render persistent disk and point `DATABASE_PATH` to that disk.

Frontend on Vercel:

- Root directory: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL`

Pros:

- Vercel is strong for static Vite frontend hosting.
- Render can run a long-lived Express backend.
- Render persistent disks can support a demo SQLite database.

Cons:

- Requires two services.
- Requires CORS configuration.
- SQLite must be placed on a persistent disk.

Complexity: medium.

## Option B: Railway Full-Stack

Backend service:

- Root directory: repository root
- Install command: `npm install`
- Build command: `npm run build && npm run db:init`
- Start command: `npm run start`
- Environment variables:
  - `PORT`
  - `DATABASE_PATH`
  - `CORS_ORIGIN`
- Configure a persistent volume and point `DATABASE_PATH` to that volume.

Frontend service:

- Root directory: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Start or static output depends on Railway project setup.
- Environment variables:
  - `VITE_API_BASE_URL`

Pros:

- One platform for backend and frontend.
- Railway volumes can support a demo SQLite file.
- Lower coordination overhead than split hosting.

Cons:

- Static frontend hosting is less specialized than Vercel.
- SQLite still requires persistent volume setup.
- Multi-instance scaling is not appropriate with this SQLite setup.

Complexity: medium-low.

## Option C: Local Demo

Backend:

```bash
npm install
npm run db:init
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Optional seed:

```bash
npm run demo:seed
```

Pros:

- Already verified for Demo RC v1.
- Lowest risk.
- Avoids cloud SQLite persistence issues.

Cons:

- Not publicly accessible.
- Requires a local machine or screen share.

Complexity: low.

## Recommended Demo RC v1 Option

Use Option C for immediate demos.

If a public URL is required, use Option A with a Render persistent disk for SQLite and Vercel for the frontend.
