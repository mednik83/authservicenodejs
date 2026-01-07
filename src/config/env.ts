import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwt: {
    accessSecret: String(process.env.JWT_ACCESS_SECRET),
    refreshSecret: String(process.env.JWT_REFRESH_SECRET),
  },
  db: {
    user: String(process.env.DB_USER),
    host: String(process.env.DB_HOST),
    database: String(process.env.DB_NAME),
    password: String(process.env.DB_PASSWORD),
    port: Number(process.env.DB_PORT) || 5432,
  },
};

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("Missing JWT secrets in .env file");
}
