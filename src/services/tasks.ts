import { taskSchema, TasksState, TaskData } from "@/app/schemas/tasks";

import { privateApiClient } from "./private";

export async function getTasks(): Promise<TasksState> {
    const { data } = await privateApiClient.get("tasks");

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
