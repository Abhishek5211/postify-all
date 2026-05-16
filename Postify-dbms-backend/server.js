import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./config/Database.js";
import User from "./models/User.model.js";
import Post from "./models/Post.model.js";
import Category from "./models/Category.model.js";
import Comment from "./models/Comment.model.js";
import PostCategory from "./models/PostCategory.model.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import commentRoutes from "./routes/comment.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const allowedOrigins = ["https://localhost:3000", "http://localhost:80"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send("API Root");
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/comment", commentRoutes);

async function startServer() {
  try {
    await db.connect(); // Wait for DB to be ready
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server due to DB error", error);
    process.exit(1);
  }
}

startServer();