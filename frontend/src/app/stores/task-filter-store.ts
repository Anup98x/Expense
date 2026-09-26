import type { TaskStatus } from "@/types/task";
import { create } from "zustand";

interface TaskFilterState {
  search: string;
  status: TaskStatus | "all";
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | "all") => void;
  reset: () => void;
}
// using this functions
export const useTaskFilterStore = create<TaskFilterState>((set) => ({
  search: "",
  status: "all",
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  reset: () => set({ search: "", status: "all" }),
}));
