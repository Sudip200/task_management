import { Router } from "express";
import * as taskController from "../controllers/tasks.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateTaskSchema = createTaskSchema.partial();

const router = Router();

router.use(authMiddleware);

// GET /tasks
router.get("/", taskController.getAll);

// POST /tasks
router.post("/", validate(createTaskSchema), taskController.create);

// PATCH /tasks/:id
router.patch(
  "/:id",
  validate(updateTaskSchema),
  taskController.update
);

// DELETE /tasks/:id
router.delete("/:id", taskController.remove);

export default router;