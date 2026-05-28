import { randomUUID } from "crypto";
import { memoryStore } from "../../storage/memory.store";
import type { Activity, CreateActivityInput } from "./activity.types";

function validateCreateActivityInput(input: CreateActivityInput) {
  if (typeof input.userId !== "string" || input.userId.trim() === "") {
    throw new Error("userId is required");
  }

  if (typeof input.steps !== "number" || !Number.isInteger(input.steps) || input.steps < 0) {
    throw new Error("steps must be a non-negative integer");
  }

  return {
    userId: input.userId.trim(),
    steps: input.steps
  };
}

export function createActivity(input: CreateActivityInput): Activity {
  const data = validateCreateActivityInput(input);
  const activities = memoryStore.activities as Activity[];

  const activity: Activity = {
    activityId: randomUUID(),
    userId: data.userId,
    steps: data.steps,
    timestamp: new Date().toISOString()
  };

  activities.push(activity);

  return activity;
}
