# HealthCoin API

Base URL:

```txt
http://localhost:3000
```

## GET /health

Purpose: Check backend liveness.

Example response:

```json
{
  "status": "ok"
}
```

## POST /auth/register

Purpose: Create a user.

Request body:

```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

Example response:

```json
{
  "user": {
    "id": "user-id",
    "email": "demo@example.com",
    "createdAt": "2026-05-29T00:00:00.000Z"
  }
}
```

Notes:

- Passwords are hashed before storage.
- Duplicate email returns a 4xx response.

## POST /auth/login

Purpose: Validate email/password and return the public user object.

Request body:

```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

Example response:

```json
{
  "user": {
    "id": "user-id",
    "email": "demo@example.com",
    "createdAt": "2026-05-29T00:00:00.000Z"
  }
}
```

Notes:

- Invalid credentials return a 4xx response.
- This release candidate does not include JWT/session auth.

## POST /activity

Purpose: Create a step activity for an existing user.

Request body:

```json
{
  "userId": "user-id",
  "steps": 2500
}
```

Example response:

```json
{
  "activity": {
    "activityId": "activity-id",
    "userId": "user-id",
    "steps": 2500,
    "timestamp": "2026-05-29T00:00:00.000Z"
  }
}
```

Validation:

- `userId` must exist.
- `steps` must be an integer greater than `0`.
- `steps` must be `100000` or less.

## GET /reward/:userId

Purpose: Calculate rewards from persisted activities for a user.

Example response:

```json
{
  "userId": "user-id",
  "totalPoints": 20,
  "rewards": [
    {
      "activityId": "activity-id",
      "points": 20
    }
  ]
}
```

Current rule:

```txt
1000 steps = 10 points
```

## POST /ledger/reward

Purpose: Create an append-only reward ledger entry for an activity.

Request body:

```json
{
  "userId": "user-id",
  "activityId": "activity-id",
  "type": "EARN"
}
```

Example response:

```json
{
  "ledgerEntry": {
    "ledgerEntryId": "ledger-entry-id",
    "userId": "user-id",
    "activityId": "activity-id",
    "points": 20,
    "type": "EARN",
    "createdAt": "2026-05-29T00:00:00.000Z"
  }
}
```

Notes:

- Points are recomputed server-side from the persisted activity.
- Duplicate `activityId` returns `409`.
- Activity must belong to `userId`.

## GET /ledger/:userId

Purpose: List ledger entries for a user.

Example response:

```json
{
  "ledgerEntries": [
    {
      "ledgerEntryId": "ledger-entry-id",
      "userId": "user-id",
      "activityId": "activity-id",
      "points": 20,
      "type": "EARN",
      "createdAt": "2026-05-29T00:00:00.000Z"
    }
  ]
}
```

## GET /wallet/:userId/balance

Purpose: Return derived wallet balance for a user.

Example response:

```json
{
  "userId": "user-id",
  "balance": 20
}
```

Notes:

- Balance is derived from ledger entries.
- Balance is not stored directly.

## GET /wallet/:userId/history

Purpose: Return wallet ledger history for a user.

Example response:

```json
{
  "userId": "user-id",
  "entries": [
    {
      "ledgerEntryId": "ledger-entry-id",
      "userId": "user-id",
      "activityId": "activity-id",
      "points": 20,
      "type": "EARN",
      "createdAt": "2026-05-29T00:00:00.000Z"
    }
  ]
}
```
