import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: "Too many requests from this IP, try later"
});
