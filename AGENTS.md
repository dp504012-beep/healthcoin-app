# HealthCoin Backend Agent Rules

This repository is a minimal backend MVP for health behavior tracking.

## Locked Flow

Auth -> Activity -> Reward -> Ledger -> Wallet

## Current Phase

Phase 1 only includes:

- Express server setup
- `/health` route
- in-memory storage module
- basic logger middleware
- basic error handling middleware

## Rules

- Keep implementation minimal.
- Do not add blockchain integration yet.
- Do not add a database yet.
- Use in-memory storage only.
- Do not store wallet balances directly.
- Ledger must remain append-only when implemented.
