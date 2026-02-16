import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};
