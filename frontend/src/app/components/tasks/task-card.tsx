"use client";

import { useDeleteTask } from "@/app/hooks/use-tasks";
import type { Task } from "@/app/types/task";

export function TaskCard({ task }: { task: Task }) {
  const { mutate: deleteTask, isPending } = useDeleteTask();

  return (
    <li className="border rounded p-3 flex justify-between items-center">
      <div>
        <h3 className="font-medium">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.status}</p>
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        disabled={isPending}
        className="text-red-500"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}
