import { app } from "./app";
import { getPort } from "./config/env";
import { verifyDatabaseInitialized } from "./config/database";

async function main() {
  const port = getPort();

  await verifyDatabaseInitialized();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
