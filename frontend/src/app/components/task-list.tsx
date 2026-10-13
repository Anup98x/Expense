"use client";

import { useTasks } from "@/app/hooks/use-tasks";
import { useTaskFilterStore } from "@/app/stores/task-filter-store";
import { TaskCard } from "./tasks/task-card";
//used to handle task list
export function TaskList() {
  const search = useTaskFilterStore((s) => s.search);
  const status = useTaskFilterStore((s) => s.status);

  const {
    data: tasks,
    isPending,
    isError,
  } = useTasks({
    search,
    status: status === "all" ? undefined : status,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Failed to load tasks.</p>;
  if (!tasks.length) return <p>No tasks found.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </ul>
  );
}
