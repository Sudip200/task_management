import axios from '../axios';

async function registerUser(data: { email: string; password: string }) {
  try {
    const response = await axios.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await axios.post('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

async function getMe() {
  try {
    const response = await axios.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function logoutUser() {
  try {
    const response = await axios.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export interface MeUser {
  id: string;
  email: string;
  createdAt: string;
  taskCount: number;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  todo: number;
  inProgress: number;
  completionRate: number;
  priority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
}

type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
};

type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
};

async function getTasks() {
  const response = await axios.get<Task[]>('/tasks');
  return response.data;
}

async function getTasksStats() {
  const response = await axios.get<TaskStats>('/tasks/stats');
  return response.data;
}

async function createTask(data: CreateTaskPayload) {
  const response = await axios.post<Task>('/tasks', data);
  return response.data;
}

async function updateTask(taskId: string, data: UpdateTaskPayload) {
  const response = await axios.patch<Task>(`/tasks/${taskId}`, data);
  return response.data;
}

async function deleteTask(taskId: string) {
  const response = await axios.delete<{ message: string }>(`/tasks/${taskId}`);
  return response.data;
}


export {
  createTask,
  deleteTask,
  getMe,
  getTasks,
  getTasksStats,
  loginUser,
  logoutUser,
  registerUser,
  updateTask,
};