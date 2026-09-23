import { api } from "@/lib/api";
import type { TaskFormValues } from "@/schemas/task.schema";
import type { Task } from "@/types/task";

export interface TaskFilters {
  search?: string;
  status?: string;
}

export const taskService = {
  getAll: async (filters: TaskFilters = {}) => {
    const { data } = await api.get<Task[]>("/tasks", { params: filters });
    return data;
  },

  create: async (payload: TaskFormValues) => {
    const { data } = await api.post<Task>("/tasks", payload);
    return data;
  },

  remove: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
