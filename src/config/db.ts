import { Pool } from "pg";
import { config } from "./env";

export const pool = new Pool(config.db);

export const initDB = async () => {
  // Таблица пользователей
  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
    `
  );
  // Таблица для refresh токенов
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

// Проверка подключения
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
  } catch {
    process.exit(1);
  }
};
