import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/apiError";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};
