import { randomUUID } from "crypto";
import { activityConfig } from "../../config/activity.config";
import { HttpError } from "../../utils/http-error";
import * as activityRepository from "./activity.repository";
import type { Activity, CreateActivityInput } from "./activity.types";

function validateCreateActivityInput(input: CreateActivityInput) {
  if (typeof input.userId !== "string" || input.userId.trim() === "") {
    throw new HttpError(400, "userId is required");
  }

  if (typeof input.steps !== "number") {
    throw new HttpError(400, "steps must be a number");
  }

  if (!Number.isInteger(input.steps)) {
    throw new HttpError(400, "steps must be an integer");
  }

  if (input.steps <= 0) {
    throw new HttpError(400, "steps must be greater than 0");
  }

  if (input.steps > activityConfig.maxStepsPerActivity) {
    throw new HttpError(400, `steps must be <= ${activityConfig.maxStepsPerActivity}`);
  }

  return {
    userId: input.userId.trim(),
    steps: input.steps
  };
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  const data = validateCreateActivityInput(input);

  const activity: Activity = {
    activityId: randomUUID(),
    userId: data.userId,
    steps: data.steps,
    timestamp: new Date().toISOString()
  };

  await activityRepository.createActivity(activity);

  return activity;
}
