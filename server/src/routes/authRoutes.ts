import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controllers";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);


export default router;