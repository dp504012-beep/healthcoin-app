export type WalletLedgerEntry = {
  ledgerEntryId: string;
  userId: string;
  activityId: string;
  points: number;
  type: "EARN";
  createdAt: string;
};

export type WalletBalance = {
  userId: string;
  balance: number;
};

export type WalletHistory = {
  userId: string;
  entries: WalletLedgerEntry[];
};
