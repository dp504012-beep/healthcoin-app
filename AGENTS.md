# HealthCoin Codex Agent Guide

## Mandatory Startup Rule

- Always read `AGENTS.md` before making changes.
- For every task, first identify the smallest relevant file set.
- Do not inspect unrelated areas unless required.

## Project Mission

HealthCoin is an existing MVP for a verifiable health behavior economy ledger system.

The current priority is stable MVP behavior, deployment readiness, and demo reliability. Keep the core flow reliable:

```txt
Register -> Activity -> Reward -> Ledger -> Wallet
```

Web3, token, NFT, smart contract, and blockchain features are not active in the current release.

## Architecture Summary

- Backend path: `src/`
- Frontend path: `frontend/`
- Backend stack: Node.js + TypeScript + Express
- Frontend stack: React + Vite
- Storage: SQLite

Important backend modules:

- `src/modules/auth/`
- `src/modules/activity/`
- `src/modules/reward/`
- `src/modules/ledger/`
- `src/modules/wallet/`

## Codex Efficiency Rules

- Read only the relevant files first.
- Do not scan the whole repo unless the task genuinely requires it.
- Prefer targeted diffs and small patches.
- Do not rewrite files unnecessarily.
- Do not install packages unless the task explicitly requires it.
- Do not run expensive commands repeatedly.
- Reuse existing project patterns.
- Keep responses concise.
- Report changed files only.
- Do not explain obvious code unless it affects a decision or risk.

## Task Execution Protocol

Before changes:

- State the goal.
- List files expected to inspect.
- List files expected to modify.
- State commands expected to run.

During changes:

- Prefer minimal diffs.
- Stop and ask if the task requires architecture changes, package installation, DB migration, force push, or touching excluded files.

After changes:

- Report changed files.
- Report commands run.
- Report verification result.
- Report remaining risks.
- Report the exact next command only if needed.

## Command Efficiency Rules

- Do not repeatedly run build/test commands unless code changed.
- Prefer one verification pass at the end.
- For frontend-only changes, do not run backend tests unless the task affects backend/API contract.
- For docs-only changes, do not run build/test unless requested.
- For Git-only tasks, do not run builds unless requested.

## Safety Rules

- Never use `git add .`.
- Never commit or push unless explicitly instructed.
- Do not run `git pull` unless explicitly instructed.
- Do not run `git merge` unless explicitly instructed.
- Do not run `git reset --hard` unless explicitly instructed.
- Do not run `git push --force` or `git push --force-with-lease` unless explicitly instructed.
- Do not change branch names unless explicitly instructed.
- Before any git push, run `git status --short` and report what will be pushed.
- Never touch `.env`.
- Never commit SQLite database files.
- Never commit `node_modules/`, `dist/`, `frontend/dist/`, logs, or local temp files.
- Never use force push unless explicitly approved.
- Do not change architecture without approval.
- Do not touch untracked whitepaper/community/ecosystem files unless explicitly approved.

Currently excluded unless approved:

- `docs/PROJECT_HANDOFF.md`
- `docs/WHITEPAPER_PLAN.md`
- `frontend/public/healthfi-whitepaper.html`
- `frontend/src/data/`
- `frontend/src/pages/CommunityPage.js`
- `frontend/src/pages/EcosystemPage.js`
- `frontend/src/pages/WhitepaperPage.js`

## Backend Rules

- Preserve existing API paths.
- Preserve SQLite unless explicitly instructed.
- Use the existing `HttpError` and error middleware pattern.
- Do not trust client-submitted reward points.
- Ledger rewards must be recomputed server-side.
- Validate user and activity ownership.
- Keep password hashing behavior.
- Keep tests isolated from the production/local demo database.
- Do not seed demo data during normal startup.

## Frontend Rules

- Preserve the Vite frontend structure.
- Use `VITE_API_BASE_URL` for the backend URL.
- Keep the core MVP pages stable:
  - login/register
  - dashboard
  - activity
  - ledger
  - wallet
- Do not reintroduce whitepaper/community/ecosystem routes unless explicitly approved.

## Deployment Rules

- Production backend start should use compiled JavaScript:

```bash
node dist/index.js
```

- Keep these commands working:
  - `npm run build`
  - `npm test`
  - `npm run db:init`
  - `cd frontend && npm run build`
- CORS must use environment-driven origins.
- SQLite deployment requires a persistent disk or volume.
- Do not deploy unless explicitly instructed.

## Verification Rules

For backend-related changes, run:

```bash
npm run build
npm test
```

For database-related changes, also run:

```bash
npm run db:init
```

For frontend-related changes, run:

```bash
cd frontend
npm run build
```

For deployment-related changes, run:

```bash
npm run build
npm test
npm run db:init
cd frontend
npm run build
```

## Standard Response Format

Use this structure for future implementation tasks:

```txt
Changed files
What changed
Commands run
Verification results
Risks / notes
Next recommended step
```

## Token-Saving Behavior

- Summarize findings instead of dumping large files.
- Show only relevant snippets.
- Avoid repeating previous project context.
- Ask before doing broad investigation.
- Prefer small incremental tasks.

## Output Discipline

- Do not paste full files unless requested.
- Show only summaries and relevant snippets.
- Keep reports concise and actionable.
