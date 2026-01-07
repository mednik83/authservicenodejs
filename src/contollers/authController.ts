import { Request, Response } from "express";
import * as authService from "../services/authService";
import { registerSchema } from "../utils/validation";
import { AuthRequest, UserPublicData } from "../models/User";
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const existingUsers = await authService.getRowsByEmail(email);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await authService.registerUser(email, password);
    const { accessToken, refreshToken } = authService.tokenGeneration(user);
    await authService.saveRefreshToken(user.id, refreshToken);

    res.status(201).json({ accessToken, refreshToken, user });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const rows = await authService.getRowsByEmail(email);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = authService.tokenGeneration({
      id: user.id,
      email: user.email,
    });

    await authService.saveRefreshToken(user.id, refreshToken);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret
    ) as UserPublicData;

    const tokenInDb = await authService.findRefreshToken(refreshToken);
    if (!tokenInDb) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    await authService.deleteRefreshToken(refreshToken);

    const tokens = authService.tokenGeneration({
      id: decoded.id,
      email: decoded.email,
    });
    await authService.saveRefreshToken(decoded.id, tokens.refreshToken);

    res.json(tokens);
  } catch (error) {
    res.status(403).json({ message: "Refresh token expired", debug: error });
  }
};

export const verify = async (req: AuthRequest, res: Response) => {
  res.json({
    valid: true,
    user: req.user,
  });
};
