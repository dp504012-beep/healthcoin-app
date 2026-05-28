import { Router } from "express";
import * as rewardController from "./reward.controller";

export const rewardRoutes = Router();

rewardRoutes.get("/:userId", rewardController.getRewardsByUserId);
