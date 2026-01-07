import exress from "express";
import router from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";
import cors from "cors";

const app = exress();

app.use(exress.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Разрешаем только наш фронтенд
    credentials: true, // Нужно для передачи Cookies или заголовков авторизации
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
