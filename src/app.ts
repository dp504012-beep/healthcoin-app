import express from "express";
import { activityRoutes } from "./modules/activity/activity.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { ledgerRoutes } from "./modules/ledger/ledger.routes";
import { rewardRoutes } from "./modules/reward/reward.routes";
import { walletRoutes } from "./modules/wallet/wallet.routes";
import { corsMiddleware } from "./middleware/cors.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";

export const app = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(loggerMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);
app.use("/reward", rewardRoutes);
app.use("/ledger", ledgerRoutes);
app.use("/wallet", walletRoutes);

app.use(errorMiddleware);
