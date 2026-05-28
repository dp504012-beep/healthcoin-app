import { randomUUID } from "crypto";
import * as authRepository from "./auth.repository";
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

export async function register(input: RegisterInput): Promise<PublicUser> {
  const data = validateAuthInput(input);

  const existingUser = await authRepository.findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const user: User = {
    id: randomUUID(),
    email: data.email,
    password: data.password,
    createdAt: new Date().toISOString()
  };

  await authRepository.createUser(user);

  return toPublicUser(user);
}

export async function login(input: LoginInput): Promise<PublicUser> {
  const data = validateAuthInput(input);

  const user = await authRepository.findUserByEmail(data.email);

  if (!user || user.password !== data.password) {
    throw new Error("Invalid email or password");
  }

  return toPublicUser(user);
}
