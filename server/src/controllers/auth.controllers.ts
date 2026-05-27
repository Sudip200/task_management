
import { generateToken } from "../utils/jwt";
import * as authService from "../services/auth.service";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.loginUser(req.body);
  const token = generateToken({ id: user.id });
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    })
    .status(200)
    .json({
      message: "Login successful",
      id: user.id,
      email: user.email,
    });

};

export const me = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const profile = await authService.getUserProfileById(userId);
  if (!profile) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user: {
      id: profile.id,
      email: profile.email,
      createdAt: profile.createdAt,
      taskCount: profile._count.tasks,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    })
    .status(200)
    .json({ message: "Logout successful" });
};