import { NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { AuthRequest, UserPublicData } from "../models/User";
import { config } from "../config/env";
import { ApiError } from "../errors/apiError";

export const authMiddleware = (
  req: AuthRequest,
  _res: unknown,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw ApiError.unauthorized();
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
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw ApiError.forbidden("Invalid or expired token");
    }

    throw error;
  }
};
