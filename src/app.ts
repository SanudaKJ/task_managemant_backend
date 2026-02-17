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
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow Postman / server-to-server calls (no Origin header)
      if (!origin) return cb(null, true);

      // Allow your frontend
      if (origin === process.env.FRONTEND_URL) return cb(null, true);

      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter); // Rate limiting

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Error Handling
app.use(errorHandler);

export default app;
