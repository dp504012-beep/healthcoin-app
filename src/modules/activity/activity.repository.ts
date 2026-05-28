import sqlite3 from "sqlite3";
import { openDatabase } from "../../config/database";
import type { Activity } from "./activity.types";

type ActivityRow = {
  activity_id: string;
  user_id: string;
  steps: number;
  timestamp: string;
};

function toActivity(row: ActivityRow): Activity {
  return {
    activityId: row.activity_id,
    userId: row.user_id,
    steps: row.steps,
    timestamp: row.timestamp
  };
}

function closeDatabase(database: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    database.close((error) => (error ? reject(error) : resolve()));
  });
}

function getActivity(sql: string, params: unknown[]): Promise<Activity | null> {
  const database = openDatabase();

  return new Promise((resolve, reject) => {
    database.get(sql, params, async (error, row: ActivityRow | undefined) => {
      await closeDatabase(database);

      if (error) {
        reject(error);
        return;
      }

      resolve(row ? toActivity(row) : null);
    });
  });
}

export async function createActivity(activity: Activity): Promise<Activity> {
  const database = openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      database.run(
        `INSERT INTO activities (activity_id, user_id, steps, timestamp)
         VALUES (?, ?, ?, ?)`,
        [activity.activityId, activity.userId, activity.steps, activity.timestamp],
        (error) => (error ? reject(error) : resolve())
      );
    });

    return activity;
  } finally {
    await closeDatabase(database);
  }
}

export function getActivityById(activityId: string): Promise<Activity | null> {
  return getActivity("SELECT * FROM activities WHERE activity_id = ?", [activityId]);
}

export function getActivitiesByUserId(userId: string): Promise<Activity[]> {
  const database = openDatabase();

  return new Promise((resolve, reject) => {
    database.all(
      "SELECT * FROM activities WHERE user_id = ? ORDER BY timestamp ASC",
      [userId],
      async (error, rows: ActivityRow[]) => {
        await closeDatabase(database);

        if (error) {
          reject(error);
          return;
        }

        resolve(rows.map(toActivity));
      }
    );
  });
}
