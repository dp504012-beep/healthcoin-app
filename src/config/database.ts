import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

export const databaseDirectory = path.resolve(process.cwd(), "data");
export const databasePath = path.join(databaseDirectory, "healthcoin.sqlite");

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
