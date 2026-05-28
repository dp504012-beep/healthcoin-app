import type { Request, Response } from "express";
import * as authService from "./auth.service";

export function register(req: Request, res: Response) {
  const user = authService.register(req.body);

  res.status(201).json({
    user
  });
}

export function login(req: Request, res: Response) {
  const user = authService.login(req.body);

  res.status(200).json({
    user
  });
}
