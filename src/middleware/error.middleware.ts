import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError ? error.message : "Internal server error";

  if (!(error instanceof HttpError)) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message
    }
  });
}
