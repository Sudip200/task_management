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

export const getTaskStats = async (userId: string) => {
  const [total, completed, inProgress, todo, priorityCounts] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "DONE" } }),
    prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { userId, status: "TODO" } }),
    prisma.task.groupBy({
      by: ["priority"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  const priority = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };

  for (const row of priorityCounts) {
    priority[row.priority] = row._count._all;
  }

  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Number(((completed / total) * 100).toFixed(1));

  return {
    total,
    completed,
    pending,
    todo,
    inProgress,
    priority,
    completionRate,
  };
};