import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiter } from "./middlewares/rateLimiter";

const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter); // Rate limiting

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Error Handling
app.use(errorHandler);

export default app;
