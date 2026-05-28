import { Router } from "express";
import * as ledgerController from "./ledger.controller";

export const ledgerRoutes = Router();

ledgerRoutes.post("/reward", ledgerController.createRewardLedgerEntry);
ledgerRoutes.get("/:userId", ledgerController.getLedgerEntriesByUserId);
