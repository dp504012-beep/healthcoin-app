import type { Request, Response } from "express";
import * as rewardService from "./reward.service";

export function getRewardsByUserId(req: Request, res: Response) {
  const summary = rewardService.getRewardsByUserId(req.params.userId);

  res.status(200).json(summary);
}
