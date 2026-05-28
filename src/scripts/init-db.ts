import { databasePath, initializeDatabase } from "../config/database";

async function main() {
  await initializeDatabase();
  console.log(`SQLite database initialized at ${databasePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
