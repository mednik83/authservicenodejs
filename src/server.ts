import app from "./app";
import { connectDB, initDB } from "./config/db";
import { config } from "./config/env";

const PORT = config.port;

(async () => {
  try {
    await connectDB();
    await initDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://127.0.0.1:${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`Swagger docs at http://127.0.0.1:${PORT}/api-docs`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
})();
