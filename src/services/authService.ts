import { pool } from "../config/db";
import jwt from "jsonwebtoken";
import { User, UserPublicData } from "../models/User";
import bcrypt from "bcrypt";
import { config } from "../config/env";

export const getRowsByEmail = async (email: string): Promise<User[]> => {
  const { rows } = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return rows;
};

export const registerUser = async (
  email: string,
  password: string
): Promise<UserPublicData> => {
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query<UserPublicData>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    [email, passwordHash]
  );
  return result.rows[0];
};

export const tokenGeneration = (user: UserPublicData) => {
  const accessToken = jwt.sign(user, config.jwt.accessSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(user, config.jwt.refreshSecret, {
    expiresIn: "30d",
  });
  return { accessToken, refreshToken };
};

export const saveRefreshToken = async (userId: number, token: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [userId, token, expiresAt]
  );
};

export const findRefreshToken = async (token: string) => {
  const { rows } = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
    [token]
  );
  return rows[0];
};

export const deleteRefreshToken = async (token: string) => {
  await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
};
