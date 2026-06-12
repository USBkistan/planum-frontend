import {
    taskSchema,
    TasksState,
    TaskData,
    Comment,
    commentSchema,
    CommentCreate,
    CommentNode,
} from "@/app/schemas/tasks";

import { privateApiClient } from "./private";

export async function getTasks(): Promise<TasksState> {
    const { data } = await privateApiClient.get("/tasks");

    const open = data["open"].map((e: any) => taskSchema.decode(e));
    const inProgress = data["in_progress"].map((e: any) => taskSchema.decode(e));
    const closed = data["closed"].map((e: any) => taskSchema.decode(e));

    return {
        open: open,
        inProgress: inProgress,
        closed: closed,
    };
}

export async function createTask(title: string) {
    await privateApiClient.post("/tasks", { title: title });
}

export async function updateTask(task: TaskData) {
    await privateApiClient.put("/tasks", { ...task });
}

export async function deleteTask(task_id: string) {
    await privateApiClient.delete(`/tasks?task_id=${task_id}`);
}

export async function getTaskComments(task_id: string): Promise<Comment[]> {
    const { data } = await privateApiClient.get(`/tasks/comments?task_id=${task_id}`);
    return data.map((e: any) => commentSchema.decode(e));
}

export async function createTaskComments(comment: CommentCreate) {
    try {
        await privateApiClient.post(`/tasks/comments`, { ...comment });
    } catch (error) {
        console.log("Error during comment creation");
    }
}

export function buildCommentTree(comments: Comment[]): CommentNode[] {
    const commentMap = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    comments.forEach((c) => {
        commentMap.set(c.id, { ...c, children: [] });
    });

    comments.forEach((c) => {
        const node = commentMap.get(c.id)!;
        if (c.parent_id === null) {
            roots.push(node);
        } else {
            const parent = commentMap.get(c.parent_id);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    return roots;
}
