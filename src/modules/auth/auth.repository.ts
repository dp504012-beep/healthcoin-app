import sqlite3 from "sqlite3";
import { openDatabase } from "../../config/database";
import type { User } from "./auth.types";

type UserRow = {
  id: string;
  email: string;
  password: string;
  created_at: string;
};

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    createdAt: row.created_at
  };
}

function closeDatabase(database: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    database.close((error) => (error ? reject(error) : resolve()));
  });
}

function getUser(sql: string, params: unknown[]): Promise<User | null> {
  const database = openDatabase();

  return new Promise((resolve, reject) => {
    database.get(sql, params, async (error, row: UserRow | undefined) => {
      await closeDatabase(database);

      if (error) {
        reject(error);
        return;
      }

      resolve(row ? toUser(row) : null);
    });
  });
}

export async function createUser(user: User): Promise<User> {
  const database = openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      database.run(
        `INSERT INTO users (id, email, password, created_at)
         VALUES (?, ?, ?, ?)`,
        [user.id, user.email, user.password, user.createdAt],
        (error) => (error ? reject(error) : resolve())
      );
    });

    return user;
  } finally {
    await closeDatabase(database);
  }
}

export function findUserByEmail(email: string): Promise<User | null> {
  return getUser("SELECT * FROM users WHERE email = ?", [email]);
}

export function findUserById(id: string): Promise<User | null> {
  return getUser("SELECT * FROM users WHERE id = ?", [id]);
}

export async function updateUserPassword(id: string, password: string): Promise<void> {
  const database = openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      database.run(
        "UPDATE users SET password = ? WHERE id = ?",
        [password, id],
        (error) => (error ? reject(error) : resolve())
      );
    });
  } finally {
    await closeDatabase(database);
  }
}
