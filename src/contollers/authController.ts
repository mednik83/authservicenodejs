import { Request, Response } from "express";
import * as authService from "../services/authService";
import { registerSchema } from "../utils/validation";
import { AuthRequest, UserPublicData } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../errors/apiError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = registerSchema.parse(req.body);
  const existingUsers = await authService.getRowsByEmail(email);

  if (existingUsers.length > 0) {
    throw ApiError.badRequest("User already exists");
  }

  const user = await authService.registerUser(email, password);
  const { accessToken, refreshToken } = authService.tokenGeneration(user);
  await authService.saveRefreshToken(user.id, refreshToken);

  const publicUser = {
    id: user.id,
    email: user.email,
  };

  res.status(201).json({ accessToken, refreshToken, user: publicUser });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = registerSchema.parse(req.body);

  const rows = await authService.getRowsByEmail(email);
  const user = rows[0];

  if (!user) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const { accessToken, refreshToken } = authService.tokenGeneration({
    id: user.id,
    email: user.email,
  });

  await authService.saveRefreshToken(user.id, refreshToken);

  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json({ user: req.user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  const decoded = jwt.verify(
    refreshToken,
    config.jwt.refreshSecret
  ) as UserPublicData;

  const tokenInDb = await authService.findRefreshToken(refreshToken);
  if (!tokenInDb) {
    throw ApiError.forbidden("Invalid or expired refresh token");
  }

  await authService.deleteRefreshToken(refreshToken);

  const tokens = authService.tokenGeneration({
    id: decoded.id,
    email: decoded.email,
  });
  await authService.saveRefreshToken(decoded.id, tokens.refreshToken);

  res.status(200).json(tokens);
});

export const verify = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    valid: true,
    user: req.user,
  });
});
