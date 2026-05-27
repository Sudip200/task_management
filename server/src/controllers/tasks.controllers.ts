import { Response } from "express";
import * as taskService from "../services/task.service";

export const create = async (req: any, res: Response) => {
  const task = await taskService.createTask(req.user.id, req.body);
  res.status(201).json(task);
};

export const getAll = async (req: any, res: Response) => {
  const tasks = await taskService.getTasks(req.user.id);
  res.json(tasks);
};

export const stats = async (req: any, res: Response) => {
  const data = await taskService.getTaskStats(req.user.id);
  res.json(data);
};

export const update = async (req: any, res: Response) => {
  const task = await taskService.updateTask(
    req.user.id,
    req.params.id,
    req.body
  );
  res.json(task);
};

export const remove = async (req: any, res: Response) => {
  await taskService.deleteTask(req.user.id, req.params.id);
  res.json({ message: "Task deleted" });
};