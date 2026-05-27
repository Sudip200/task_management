import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie ?? "";
  const tokenFromCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.slice("token=".length);

  const tokenFromBearer = req.headers.authorization?.split(" ")[1];
  const token = tokenFromCookie ?? tokenFromBearer;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  req.user = verifyToken(token);
  next();
};