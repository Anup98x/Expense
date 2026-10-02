import type { TaskStatus } from "@/app/types/task";
import { create } from "zustand";

interface TaskFilterState {
  search: string;
  status: TaskStatus | "all";
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | "all") => void;
  reset: () => void;
}
// zustand helps like a shared looker room to directly share things to zustand without prop drilling
// the create function used in here build the shared state
export const useTaskFilterStore = create<TaskFilterState>((set) => ({
  search: "",
  status: "all",
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  reset: () => set({ search: "", status: "all" }),
}));
// since we have exported the usetaskfilterstore so we can use it anywhere when we need it like search input component or on expense list i.e const search =useTaskFilterStore((state))=> state.search
