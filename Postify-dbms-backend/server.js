import dotenv from "dotenv";
import { db } from "./config/Database.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;

async function startServer() {
  try {
    await db.connect(); // Wait for DB to be ready
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB error", error);
    process.exit(1);
  }
}

startServer();
