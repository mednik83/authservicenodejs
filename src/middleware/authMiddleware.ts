import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserPublicData } from "../models/User";
import { config } from "../config/env";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret
    ) as UserPublicData;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};
