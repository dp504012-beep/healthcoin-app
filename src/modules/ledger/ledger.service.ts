import { randomUUID } from "crypto";
import { memoryStore } from "../../storage/memory.store";
import type { CreateRewardLedgerEntryInput, LedgerEntry } from "./ledger.types";

function validateRewardLedgerEntryInput(input: CreateRewardLedgerEntryInput) {
  if (typeof input.userId !== "string" || input.userId.trim() === "") {
    throw new Error("userId is required");
  }

  if (typeof input.activityId !== "string" || input.activityId.trim() === "") {
    throw new Error("activityId is required");
  }

  if (typeof input.points !== "number" || !Number.isFinite(input.points)) {
    throw new Error("points must be a valid number");
  }

  if (input.points <= 0) {
    throw new Error("points must be greater than 0");
  }

  if (input.type !== "EARN") {
    throw new Error('type must be "EARN"');
  }

  return {
    userId: input.userId.trim(),
    activityId: input.activityId.trim(),
    points: input.points,
    type: input.type as "EARN"
  };
}

export function createRewardLedgerEntry(input: CreateRewardLedgerEntryInput): LedgerEntry {
  const data = validateRewardLedgerEntryInput(input);
  const ledgerEntries = memoryStore.ledgerEntries as LedgerEntry[];

  const existingEntry = ledgerEntries.find((entry) => entry.activityId === data.activityId);
  if (existingEntry) {
    throw new Error("Ledger entry already exists for activityId");
  }

  const ledgerEntry: LedgerEntry = {
    ledgerEntryId: randomUUID(),
    userId: data.userId,
    activityId: data.activityId,
    points: data.points,
    type: data.type,
    createdAt: new Date().toISOString()
  };

  ledgerEntries.push(ledgerEntry);

  return ledgerEntry;
}

export function getLedgerEntriesByUserId(userId: string): LedgerEntry[] {
  const ledgerEntries = memoryStore.ledgerEntries as LedgerEntry[];

  return ledgerEntries.filter((entry) => entry.userId === userId);
}
