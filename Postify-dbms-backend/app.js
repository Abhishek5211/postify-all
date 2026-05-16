import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import {
  metricsMiddleware,
  renderMetrics,
} from "./middlewares/metrics.middleware.js";

const app = express();
const allowedOrigins = ["https://localhost:3000", "http://localhost:80"];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(metricsMiddleware);

app.get("/", async (req, res) => {
  res.send("API Root");
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "postify-backend",
  });
});

app.get("/metrics", (req, res) => {
  res.set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
  res.send(renderMetrics());
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/comment", commentRoutes);

export default app;
