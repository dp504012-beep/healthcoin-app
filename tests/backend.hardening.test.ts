import fs from "fs";
import os from "os";
import path from "path";
import request from "supertest";

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "healthcoin-test-"));
const testDatabasePath = path.join(testDirectory, "healthcoin.sqlite");

process.env.DATABASE_PATH = testDatabasePath;
process.env.PORT = "0";

const { app } = require("../src/app");
const { initializeDatabase } = require("../src/config/database");
const authRepository = require("../src/modules/auth/auth.repository");

async function registerUser(email = `user-${Date.now()}-${Math.random()}@example.com`) {
  const response = await request(app)
    .post("/auth/register")
    .send({ email, password: "secret123" })
    .expect(201);

  return response.body.user as { id: string; email: string; createdAt: string };
}

describe("backend hardening", () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(() => {
    fs.rmSync(testDirectory, { recursive: true, force: true });
  });

  test("GET /health returns ok", async () => {
    await request(app).get("/health").expect(200, { status: "ok" });
  });

  test("register succeeds and stores a hashed password", async () => {
    const email = "register-success@example.com";
    const user = await registerUser(email);
    const storedUser = await authRepository.findUserByEmail(email);

    expect(user.email).toBe(email);
    expect(storedUser.password).not.toBe("secret123");
    expect(storedUser.password).toMatch(/^\$2[aby]\$/);
  });

  test("duplicate register returns 4xx", async () => {
    const email = "duplicate@example.com";
    await registerUser(email);

    await request(app)
      .post("/auth/register")
      .send({ email, password: "secret123" })
      .expect(409);
  });

  test("wrong password login returns 4xx", async () => {
    const email = "wrong-password@example.com";
    await registerUser(email);

    await request(app)
      .post("/auth/login")
      .send({ email, password: "wrong123" })
      .expect(401);
  });

  test("activity rejects invalid steps", async () => {
    const user = await registerUser("invalid-steps@example.com");

    await request(app)
      .post("/activity")
      .send({ userId: user.id, steps: -1 })
      .expect(400);
  });

  test("activity rejects non-existing userId", async () => {
    await request(app)
      .post("/activity")
      .send({ userId: "missing-user", steps: 2500 })
      .expect(404);
  });

  test("ledger reward recomputes points server-side", async () => {
    const user = await registerUser("ledger-recompute@example.com");
    const activityResponse = await request(app)
      .post("/activity")
      .send({ userId: user.id, steps: 2500 })
      .expect(201);

    const response = await request(app)
      .post("/ledger/reward")
      .send({
        userId: user.id,
        activityId: activityResponse.body.activity.activityId,
        points: 9999,
        type: "EARN"
      })
      .expect(201);

    expect(response.body.ledgerEntry.points).toBe(20);
  });

  test("ledger rejects duplicate activityId", async () => {
    const user = await registerUser("ledger-duplicate@example.com");
    const activityResponse = await request(app)
      .post("/activity")
      .send({ userId: user.id, steps: 3000 })
      .expect(201);

    const payload = {
      userId: user.id,
      activityId: activityResponse.body.activity.activityId,
      points: 9999,
      type: "EARN"
    };

    await request(app).post("/ledger/reward").send(payload).expect(201);
    await request(app).post("/ledger/reward").send(payload).expect(409);
  });

  test("wallet balance derives correctly from ledger", async () => {
    const user = await registerUser("wallet-balance@example.com");
    const firstActivity = await request(app)
      .post("/activity")
      .send({ userId: user.id, steps: 2500 })
      .expect(201);
    const secondActivity = await request(app)
      .post("/activity")
      .send({ userId: user.id, steps: 1500 })
      .expect(201);

    await request(app)
      .post("/ledger/reward")
      .send({
        userId: user.id,
        activityId: firstActivity.body.activity.activityId,
        points: 9999,
        type: "EARN"
      })
      .expect(201);
    await request(app)
      .post("/ledger/reward")
      .send({
        userId: user.id,
        activityId: secondActivity.body.activity.activityId,
        points: 9999,
        type: "EARN"
      })
      .expect(201);

    const balanceResponse = await request(app)
      .get(`/wallet/${user.id}/balance`)
      .expect(200);
    const historyResponse = await request(app)
      .get(`/wallet/${user.id}/history`)
      .expect(200);

    expect(balanceResponse.body.balance).toBe(30);
    expect(historyResponse.body.entries).toHaveLength(2);
  });
});
