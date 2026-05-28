import { randomUUID } from "crypto";
import { HttpError } from "../../utils/http-error";
import * as ledgerRepository from "./ledger.repository";
import type { CreateRewardLedgerEntryInput, LedgerEntry } from "./ledger.types";

function validateRewardLedgerEntryInput(input: CreateRewardLedgerEntryInput) {
  if (typeof input.userId !== "string" || input.userId.trim() === "") {
    throw new HttpError(400, "userId is required");
  }

  if (typeof input.activityId !== "string" || input.activityId.trim() === "") {
    throw new HttpError(400, "activityId is required");
  }

  if (typeof input.points !== "number" || !Number.isFinite(input.points)) {
    throw new HttpError(400, "points must be a valid number");
  }

  if (input.points <= 0) {
    throw new HttpError(400, "points must be greater than 0");
  }

  if (input.type !== "EARN") {
    throw new HttpError(400, 'type must be "EARN"');
  }

  return {
    userId: input.userId.trim(),
    activityId: input.activityId.trim(),
    points: input.points,
    type: input.type as "EARN"
  };
}

export async function createRewardLedgerEntry(
  input: CreateRewardLedgerEntryInput
): Promise<LedgerEntry> {
  const data = validateRewardLedgerEntryInput(input);

  const existingEntry = await ledgerRepository.findLedgerEntryByActivityId(data.activityId);
  if (existingEntry) {
    throw new HttpError(409, "Ledger entry already exists for activityId");
  }

  const ledgerEntry: LedgerEntry = {
    ledgerEntryId: randomUUID(),
    userId: data.userId,
    activityId: data.activityId,
    points: data.points,
    type: data.type,
    createdAt: new Date().toISOString()
  };

  await ledgerRepository.createLedgerEntry(ledgerEntry);

  return ledgerEntry;
}

export function getLedgerEntriesByUserId(userId: string): Promise<LedgerEntry[]> {
  return ledgerRepository.getLedgerEntriesByUserId(userId);
}
