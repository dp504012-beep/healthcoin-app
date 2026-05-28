import type { NextFunction, Request, Response } from "express";
import * as rewardService from "./reward.service";

export async function getRewardsByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await rewardService.getRewardsByUserId(req.params.userId);

    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
}
