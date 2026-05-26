
import { generateToken } from "../utils/jwt";
import * as authService from "../services/auth.service";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);
  const token = generateToken({ id: user.id });

  res.json({ token });
};