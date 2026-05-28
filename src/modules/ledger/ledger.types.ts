export type LedgerEntryType = "EARN";

export type LedgerEntry = {
  ledgerEntryId: string;
  userId: string;
  activityId: string;
  points: number;
  type: LedgerEntryType;
  createdAt: string;
};

export type CreateRewardLedgerEntryInput = {
  userId?: unknown;
  activityId?: unknown;
  points?: unknown;
  type?: unknown;
};
