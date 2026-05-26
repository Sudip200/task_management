
interface User {
    id: string;
    email: string;
    password: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: Date | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "TODO" | "IN_PROGRESS" | "DONE";
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}