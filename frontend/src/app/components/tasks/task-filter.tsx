"use client";

import { useTaskFilterStore } from "@/stores/task-filter.store";

export function TaskFilters() {
  const search = useTaskFilterStore((s) => s.search);
  const status = useTaskFilterStore((s) => s.status);
  const setSearch = useTaskFilterStore((s) => s.setSearch);
  const setStatus = useTaskFilterStore((s) => s.setStatus);
  const reset = useTaskFilterStore((s) => s.reset);

  return (
    <div className="flex gap-2">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks....."
        className="border rounded px-3 py-2 flex-1"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="border rounded px-3 py-2"
      >
        <option value="all">All</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>

      <button onClick={reset} className="border rounded px-3 py-2">
        Reset
      </button>
    </div>
  );
}
