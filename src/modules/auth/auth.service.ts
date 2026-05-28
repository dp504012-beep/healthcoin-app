import { randomUUID } from "crypto";
import { memoryStore } from "../../storage/memory.store";
import type { LoginInput, PublicUser, RegisterInput, User } from "./auth.types";

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
}

function validateAuthInput(input: RegisterInput | LoginInput) {
  if (typeof input.email !== "string" || !input.email.includes("@")) {
    throw new Error("Valid email is required");
  }

  if (typeof input.password !== "string" || input.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return {
    email: input.email.trim().toLowerCase(),
    password: input.password
  };
}

export function register(input: RegisterInput): PublicUser {
  const data = validateAuthInput(input);
  const users = memoryStore.users as User[];

  const existingUser = users.find((user) => user.email === data.email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const user: User = {
    id: randomUUID(),
    email: data.email,
    password: data.password,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  return toPublicUser(user);
}

export function login(input: LoginInput): PublicUser {
  const data = validateAuthInput(input);
  const users = memoryStore.users as User[];

  const user = users.find(
    (storedUser) => storedUser.email === data.email && storedUser.password === data.password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return toPublicUser(user);
}
