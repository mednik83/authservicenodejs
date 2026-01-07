import { Request } from "express";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type UserPublicData = Pick<User, "id" | "email">;

export interface AuthRequest extends Request {
  user?: UserPublicData;
}
