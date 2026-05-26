import { prisma } from "../prisma/client";
import { Task } from "../types";

export const createTask = async (userId: string, data: Task) => {
  return prisma.task.create({
    data: {
      ...data,
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
};

export const getTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateTask = async (userId: string, taskId: string, data: Partial<Task>) => {
  return prisma.task.update({
    where: {
      id: taskId,
      userId, // ensures user owns task
    },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
      userId,
    },
  });
};