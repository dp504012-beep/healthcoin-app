import type { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.login(req.body);

    res.status(200).json({
      user
    });
  } catch (error) {
    next(error);
  }
}
