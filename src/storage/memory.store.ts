export type MemoryStore = {
  users: unknown[];
  activities: unknown[];
  ledgerEntries: unknown[];
};

export const memoryStore: MemoryStore = {
  users: [],
  activities: [],
  ledgerEntries: []
};
