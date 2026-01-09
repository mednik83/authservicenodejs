import dotenv from "dotenv";
dotenv.config({ path: ".env.test", override: true }); // обязательно override

import { initDB, pool } from "./src/config/db";

// Создаём таблицы перед всеми тестами
beforeAll(async () => {
  await pool.query("DROP TABLE IF EXISTS refresh_tokens CASCADE");
  await pool.query("DROP TABLE IF EXISTS users CASCADE");
  await initDB();
});

// Чистим данные перед каждым тестом
beforeEach(async () => {
  await pool.query(
    "TRUNCATE TABLE refresh_tokens, users RESTART IDENTITY CASCADE"
  );
});

// Закрываем соединение после всех тестов
afterAll(async () => {
  await pool.end();
});
