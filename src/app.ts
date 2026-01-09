import exress from "express";
import router from "./routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = exress();

app.use(exress.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware);

export default app;
