import { randomUUID } from "crypto";
import { HttpError } from "../../utils/http-error";
import * as activityRepository from "../activity/activity.repository";
import * as authRepository from "../auth/auth.repository";
import { stepToPointsRatio } from "../reward/rules";
import * as ledgerRepository from "./ledger.repository";
import type { CreateRewardLedgerEntryInput, LedgerEntry } from "./ledger.types";

function validateRewardLedgerEntryInput(input: CreateRewardLedgerEntryInput) {
  if (typeof input.userId !== "string" || input.userId.trim() === "") {
    throw new HttpError(400, "userId is required");
  }

  if (typeof input.activityId !== "string" || input.activityId.trim() === "") {
    throw new HttpError(400, "activityId is required");
  }

  if (input.type !== "EARN") {
    throw new HttpError(400, 'type must be "EARN"');
  }

  return {
    userId: input.userId.trim(),
    activityId: input.activityId.trim(),
    type: input.type as "EARN"
  };
}

function calculatePoints(steps: number): number {
  return Math.floor(steps / stepToPointsRatio.steps) * stepToPointsRatio.points;
}

export async function createRewardLedgerEntry(
  input: CreateRewardLedgerEntryInput
): Promise<LedgerEntry> {
  const data = validateRewardLedgerEntryInput(input);

  const existingEntry = await ledgerRepository.findLedgerEntryByActivityId(data.activityId);
  if (existingEntry) {
    throw new HttpError(409, "Ledger entry already exists for activityId");
  }

  const user = await authRepository.findUserById(data.userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const activity = await activityRepository.getActivityById(data.activityId);
  if (!activity) {
    throw new HttpError(404, "Activity not found");
  }

  if (activity.userId !== data.userId) {
    throw new HttpError(403, "Activity does not belong to userId");
  }

  const points = calculatePoints(activity.steps);
  if (points <= 0) {
    throw new HttpError(400, "Computed reward points must be greater than 0");
  }

  const ledgerEntry: LedgerEntry = {
    ledgerEntryId: randomUUID(),
    userId: data.userId,
    activityId: data.activityId,
    points,
    type: data.type,
    createdAt: new Date().toISOString()
  };

  await ledgerRepository.createLedgerEntry(ledgerEntry);

  return ledgerEntry;
}

export function getLedgerEntriesByUserId(userId: string): Promise<LedgerEntry[]> {
  return ledgerRepository.getLedgerEntriesByUserId(userId);
}
