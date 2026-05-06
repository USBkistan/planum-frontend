export interface TaskData {
    id: string;
    title: string;
    description: string;
    assignee: string;
    priority: "low" | "medium" | "high";
}

export interface TasksState {
    open: TaskData[];
    inProgress: TaskData[];
    closed: TaskData[];
}
