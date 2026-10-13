"use client";

import { useForm } from "react-hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormValues } from "@/schemas/task.schema";
import { useCreateTask } from "@/hooks/use-tasks";

export function TaskForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", status: "todo" },
  });

  const { mutate: createTask, isPending } = useCreateTask();

  const onSubmit = (values: TaskFormValues) => {
    // Only runs if Zod validation passed
    createTask(values, { onSuccess: () => reset() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          {...register("title")}
          placeholder="Task title"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("description")}
          placeholder="Description (optional)"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <select {...register("status")} className="border rounded px-3 py-2">
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white rounded px-4 py-2"
      >
        {isPending ? "Saving..." : "Add task"}
      </button>
    </form>
  );
}
