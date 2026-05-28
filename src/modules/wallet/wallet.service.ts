import * as ledgerRepository from "../ledger/ledger.repository";
import type { WalletBalance, WalletHistory } from "./wallet.types";

export async function getBalance(userId: string): Promise<WalletBalance> {
  const entries = await ledgerRepository.getLedgerEntriesByUserId(userId);
  const balance = entries.reduce((sum, entry) => sum + entry.points, 0);

  return {
    userId,
    balance
  };
}

export async function getHistory(userId: string): Promise<WalletHistory> {
  return {
    userId,
    entries: await ledgerRepository.getLedgerEntriesByUserId(userId)
  };
}
