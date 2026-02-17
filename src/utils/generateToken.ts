import jwt, { SignOptions } from "jsonwebtoken";

export function generateToken(userId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  const options: SignOptions = {
    expiresIn: "1d", // or "7d" / "2h"
  };

  return jwt.sign({ userId }, secret, options);
}