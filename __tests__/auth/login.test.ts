import request from "supertest";
import app from "../../src/app";

describe("POST /auth/login", () => {
  it("should login existing user", async () => {
    await request(app).post("/auth/register").send({
      email: "login@test.com",
      password: "12345678",
    });

    const res = await request(app).post("/auth/login").send({
      email: "login@test.com",
      password: "12345678",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should reject wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "login@test.com",
      password: "wrong",
    });

    expect(res.status).toBe(400);
  });
});
