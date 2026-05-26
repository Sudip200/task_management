import { Router } from "express";
import { register, login } from "../controllers/auth.controllers";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", login);


export default router;