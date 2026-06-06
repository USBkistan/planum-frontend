import z from "zod";

export type TaskData = z.infer<typeof taskSchema>;

export const taskSchema = z.object({
    id: z.uuidv4(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.enum(["open", "progress", "closed"]),
    priority: z.enum(["low", "medium", "high"]),
    assignee: z.string().nullable(),
    assignee_id: z.uuidv4().nullable(),
    created_by: z.uuidv4(),
    group_id: z.uuidv4(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export interface TasksState {
    open: TaskData[];
    inProgress: TaskData[];
    closed: TaskData[];
}
