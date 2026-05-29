import type { NextFunction, Request, Response } from "express";
import { getEnv } from "../config/env";

const localOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

function getAllowedOrigins(): Set<string> {
  const configuredOrigins = getEnv("CORS_ORIGIN", "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([...localOrigins, ...configuredOrigins]);
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
}
