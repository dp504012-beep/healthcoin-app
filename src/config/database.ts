import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { getEnv } from "./env";

export const databasePath = path.resolve(
  process.cwd(),
  getEnv("DATABASE_PATH", "data/healthcoin.sqlite")
);
export const databaseDirectory = path.dirname(databasePath);

export function openDatabase(): sqlite3.Database {
  fs.mkdirSync(databaseDirectory, { recursive: true });

  return new sqlite3.Database(databasePath);
}

function runStatement(database: sqlite3.Database, sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(sql, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function closeDatabase(database: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    database.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

export async function initializeDatabase(): Promise<void> {
  const database = openDatabase();

  try {
    await runStatement(
      database,
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`
    );

    await runStatement(
      database,
      `CREATE TABLE IF NOT EXISTS activities (
        activity_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        steps INTEGER NOT NULL,
        timestamp TEXT NOT NULL
      )`
    );

    await runStatement(
      database,
      `CREATE TABLE IF NOT EXISTS ledger_entries (
        ledger_entry_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        activity_id TEXT UNIQUE NOT NULL,
        points INTEGER NOT NULL CHECK(points > 0),
        type TEXT NOT NULL CHECK(type = 'EARN'),
        created_at TEXT NOT NULL
      )`
    );
  } finally {
    await closeDatabase(database);
  }
}

function getRequiredTableCount(database: sqlite3.Database): Promise<number> {
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT COUNT(*) AS count
       FROM sqlite_master
       WHERE type = 'table'
         AND name IN ('users', 'activities', 'ledger_entries')`,
      (error, row: { count: number } | undefined) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row?.count ?? 0);
      }
    );
  });
}

export async function verifyDatabaseInitialized(): Promise<void> {
  const database = openDatabase();

  try {
    const tableCount = await getRequiredTableCount(database);

    if (tableCount !== 3) {
      throw new Error(
        `Database is not initialized at ${databasePath}. Run npm run db:init before starting the server.`
      );
    }
  } finally {
    await closeDatabase(database);
  }
}
