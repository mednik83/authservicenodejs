import request from "supertest";
import app from "../../src/app";

describe("GET /auth/me", () => {
  it("should return current user", async () => {
    const register = await request(app).post("/auth/register").send({
      email: "me@test.com",
      password: "12345678",
    });

    const token = register.body.accessToken;

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("me@test.com");
  });

  it("should reject without token", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});
