import { taskService, type TaskFilters } from "@/services/task.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Centralized keys so you never mistype them
export const taskKeys = {
  all: ["tasks"] as const,
  list: (filters: TaskFilters) => ["tasks", "list", filters] as const,
};

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskService.getAll(filters),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      // Mark all task lists as stale, so they refetch automatically
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
