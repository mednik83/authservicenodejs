import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  it("should register new user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@test.com",
      password: "12345678",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user.email).toBe("test@test.com");
  });

  it("should not allow duplicate user", async () => {
    await request(app).post("/auth/register").send({
      email: "dup@test.com",
      password: "12345678",
    });

    const res = await request(app).post("/auth/register").send({
      email: "dup@test.com",
      password: "12345678",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});
