import type { Request, Response } from "express";
import * as activityService from "./activity.service";

export function createActivity(req: Request, res: Response) {
  const activity = activityService.createActivity(req.body);

  res.status(201).json({
    activity
  });
}
