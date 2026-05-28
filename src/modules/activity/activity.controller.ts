import type { NextFunction, Request, Response } from "express";
import * as activityService from "./activity.service";

export async function createActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await activityService.createActivity(req.body);

    res.status(201).json({
      activity
    });
  } catch (error) {
    next(error);
  }
}
