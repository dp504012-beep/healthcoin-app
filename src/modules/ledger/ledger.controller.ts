import type { Request, Response } from "express";
import * as ledgerService from "./ledger.service";

export function createRewardLedgerEntry(req: Request, res: Response) {
  const ledgerEntry = ledgerService.createRewardLedgerEntry(req.body);

  res.status(201).json({
    ledgerEntry
  });
}

export function getLedgerEntriesByUserId(req: Request, res: Response) {
  const ledgerEntries = ledgerService.getLedgerEntriesByUserId(req.params.userId);

  res.status(200).json({
    ledgerEntries
  });
}
