import type { NextFunction, Request, Response } from "express";
import * as ledgerService from "./ledger.service";

export async function createRewardLedgerEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const ledgerEntry = await ledgerService.createRewardLedgerEntry(req.body);

    res.status(201).json({
      ledgerEntry
    });
  } catch (error) {
    next(error);
  }
}

export async function getLedgerEntriesByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const ledgerEntries = await ledgerService.getLedgerEntriesByUserId(req.params.userId);

    res.status(200).json({
      ledgerEntries
    });
  } catch (error) {
    next(error);
  }
}
