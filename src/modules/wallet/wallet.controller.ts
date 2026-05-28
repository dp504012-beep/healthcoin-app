import type { NextFunction, Request, Response } from "express";
import * as walletService from "./wallet.service";

export async function getBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const balance = await walletService.getBalance(req.params.userId);

    res.status(200).json(balance);
  } catch (error) {
    next(error);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const history = await walletService.getHistory(req.params.userId);

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
}
