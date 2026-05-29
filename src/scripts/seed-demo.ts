import { randomUUID } from "crypto";
import { initializeDatabase } from "../config/database";
import * as activityRepository from "../modules/activity/activity.repository";
import * as authRepository from "../modules/auth/auth.repository";
import * as authService from "../modules/auth/auth.service";
import * as ledgerRepository from "../modules/ledger/ledger.repository";
import * as ledgerService from "../modules/ledger/ledger.service";
import type { PublicUser } from "../modules/auth/auth.types";

const demoEmail = "demo@healthcoin.local";
const demoPassword = "demo123";
const demoSteps = 2500;

async function ensureDemoUser(): Promise<PublicUser> {
  const existingUser = await authRepository.findUserByEmail(demoEmail);

  if (existingUser) {
    return {
      id: existingUser.id,
      email: existingUser.email,
      createdAt: existingUser.createdAt
    };
  }

  return authService.register({
    email: demoEmail,
    password: demoPassword
  });
}

async function main() {
  await initializeDatabase();

  const user = await ensureDemoUser();
  const existingLedgerEntries = await ledgerRepository.getLedgerEntriesByUserId(user.id);

  if (existingLedgerEntries.length > 0) {
    const balance = existingLedgerEntries.reduce((sum, entry) => sum + entry.points, 0);

    console.log("Demo seed already exists.");
    console.log(`User: ${user.email}`);
    console.log(`User ID: ${user.id}`);
    console.log(`Ledger entries: ${existingLedgerEntries.length}`);
    console.log(`Wallet balance: ${balance}`);
    return;
  }

  const activity = await activityRepository.createActivity({
    activityId: randomUUID(),
    userId: user.id,
    steps: demoSteps,
    timestamp: new Date().toISOString()
  });

  const ledgerEntry = await ledgerService.createRewardLedgerEntry({
    userId: user.id,
    activityId: activity.activityId,
    type: "EARN"
  });

  console.log("Demo seed created.");
  console.log(`Email: ${demoEmail}`);
  console.log(`Password: ${demoPassword}`);
  console.log(`User ID: ${user.id}`);
  console.log(`Activity ID: ${activity.activityId}`);
  console.log(`Ledger Entry ID: ${ledgerEntry.ledgerEntryId}`);
  console.log(`Wallet balance: ${ledgerEntry.points}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
