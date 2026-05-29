import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { HttpError } from "../../utils/http-error";
import * as authRepository from "./auth.repository";
import type { LoginInput, PublicUser, RegisterInput, User } from "./auth.types";

const passwordHashRounds = 10;

function isBcryptHash(password: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(password);
}

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
}

function validateAuthInput(input: RegisterInput | LoginInput) {
  if (typeof input.email !== "string" || !input.email.includes("@")) {
    throw new HttpError(400, "Valid email is required");
  }

  if (typeof input.password !== "string" || input.password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
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
    throw new HttpError(409, "Email already registered");
  }

  const user: User = {
    id: randomUUID(),
    email: data.email,
    password: await bcrypt.hash(data.password, passwordHashRounds),
    createdAt: new Date().toISOString()
  };

  await authRepository.createUser(user);

  return toPublicUser(user);
}

export async function login(input: LoginInput): Promise<PublicUser> {
  const data = validateAuthInput(input);

  const user = await authRepository.findUserByEmail(data.email);
  let isPasswordValid = false;

  if (user && isBcryptHash(user.password)) {
    isPasswordValid = await bcrypt.compare(data.password, user.password);
  } else if (user && user.password === data.password) {
    isPasswordValid = true;
    await authRepository.updateUserPassword(
      user.id,
      await bcrypt.hash(data.password, passwordHashRounds)
    );
  }

  if (!user || !isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  return toPublicUser(user);
}
