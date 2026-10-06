import { taskService, type TaskFilters } from "@/app/services/task.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; //these are all the core tools imported from tanstack query=which acts as the smart notebook once data is fetched from backend it saves of copy as cache for any other uses so it will be easy to re use components

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
