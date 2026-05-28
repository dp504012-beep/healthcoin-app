import { memoryStore } from "../../storage/memory.store";
import type { WalletBalance, WalletHistory, WalletLedgerEntry } from "./wallet.types";

function getEntriesByUserId(userId: string): WalletLedgerEntry[] {
  const ledgerEntries = memoryStore.ledgerEntries as WalletLedgerEntry[];

  return ledgerEntries.filter((entry) => entry.userId === userId);
}

export function getBalance(userId: string): WalletBalance {
  const entries = getEntriesByUserId(userId);
  const balance = entries.reduce((sum, entry) => sum + entry.points, 0);

  return {
    userId,
    balance
  };
}

export function getHistory(userId: string): WalletHistory {
  return {
    userId,
    entries: getEntriesByUserId(userId)
  };
}
