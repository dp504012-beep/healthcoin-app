import sqlite3 from "sqlite3";
import { openDatabase } from "../../config/database";
import type { LedgerEntry } from "./ledger.types";

type LedgerEntryRow = {
  ledger_entry_id: string;
  user_id: string;
  activity_id: string;
  points: number;
  type: "EARN";
  created_at: string;
};

function toLedgerEntry(row: LedgerEntryRow): LedgerEntry {
  return {
    ledgerEntryId: row.ledger_entry_id,
    userId: row.user_id,
    activityId: row.activity_id,
    points: row.points,
    type: row.type,
    createdAt: row.created_at
  };
}

function closeDatabase(database: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    database.close((error) => (error ? reject(error) : resolve()));
  });
}

function getLedgerEntry(sql: string, params: unknown[]): Promise<LedgerEntry | null> {
  const database = openDatabase();

  return new Promise((resolve, reject) => {
    database.get(sql, params, async (error, row: LedgerEntryRow | undefined) => {
      await closeDatabase(database);

      if (error) {
        reject(error);
        return;
      }

      resolve(row ? toLedgerEntry(row) : null);
    });
  });
}

export async function createLedgerEntry(ledgerEntry: LedgerEntry): Promise<LedgerEntry> {
  const database = openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      database.run(
        `INSERT INTO ledger_entries (
          ledger_entry_id,
          user_id,
          activity_id,
          points,
          type,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          ledgerEntry.ledgerEntryId,
          ledgerEntry.userId,
          ledgerEntry.activityId,
          ledgerEntry.points,
          ledgerEntry.type,
          ledgerEntry.createdAt
        ],
        (error) => (error ? reject(error) : resolve())
      );
    });

    return ledgerEntry;
  } finally {
    await closeDatabase(database);
  }
}

export function findLedgerEntryByActivityId(activityId: string): Promise<LedgerEntry | null> {
  return getLedgerEntry("SELECT * FROM ledger_entries WHERE activity_id = ?", [activityId]);
}

export function getLedgerEntriesByUserId(userId: string): Promise<LedgerEntry[]> {
  const database = openDatabase();

  return new Promise((resolve, reject) => {
    database.all(
      "SELECT * FROM ledger_entries WHERE user_id = ? ORDER BY created_at ASC",
      [userId],
      async (error, rows: LedgerEntryRow[]) => {
        await closeDatabase(database);

        if (error) {
          reject(error);
          return;
        }

        resolve(rows.map(toLedgerEntry));
      }
    );
  });
}
