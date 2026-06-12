import z from "zod";

export type TaskData = z.infer<typeof taskSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentCreate = z.infer<typeof commentCreateSchema>;
export type CommentNode = Comment & { children: CommentNode[] };

export interface TasksState {
    open: TaskData[];
    inProgress: TaskData[];
    closed: TaskData[];
}

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

export const commentSchema = z.object({
    id: z.uuidv4(),
    task_id: z.uuidv4(),
    user_id: z.uuidv4(),
    parent_id: z.uuidv4().nullable(),
    name: z.string(),
    text: z.string(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export const commentCreateSchema = z.object({
    task_id: z.uuidv4(),
    parent_id: z.uuidv4().nullable(),
    text: z.string(),
});
