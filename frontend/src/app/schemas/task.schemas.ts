import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(200, "Max 200 characters").optional(),
  status: z.enum(["todo", "in-progress", "done"]),
});

// #Type is generated FROM the schemas, so they can never drift apart
export type TaskFormValues = z.infer<typeof taskSchema>;
