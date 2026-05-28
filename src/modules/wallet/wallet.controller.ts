import type { Request, Response } from "express";
import * as walletService from "./wallet.service";

export function getBalance(req: Request, res: Response) {
  const balance = walletService.getBalance(req.params.userId);

  res.status(200).json(balance);
}

export function getHistory(req: Request, res: Response) {
  const history = walletService.getHistory(req.params.userId);

  res.status(200).json(history);
}
