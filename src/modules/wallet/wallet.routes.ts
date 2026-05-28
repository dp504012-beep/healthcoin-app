import { Router } from "express";
import * as walletController from "./wallet.controller";

export const walletRoutes = Router();

walletRoutes.get("/:userId/balance", walletController.getBalance);
walletRoutes.get("/:userId/history", walletController.getHistory);
