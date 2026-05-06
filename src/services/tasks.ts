import { TasksState } from "@/app/schemas/tasks";

export async function getTasks(): Promise<TasksState> {
    return {
        open: [
            {
                id: "1",
                title: "Task 1",
                assignee: "Alice",
                priority: "high",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
            {
                id: "2",
                title: "Task 2",
                assignee: "Bob",
                priority: "medium",
                description: "Task description for Task 2.",
            },
            {
                id: "3",
                title: "Task 3",
                assignee: "Charlie",
                priority: "low",
                description: "Task description for Task 3.",
            },
        ],
        inProgress: [
            {
                id: "4",
                title: "Task 4",
                assignee: "David",
                priority: "high",
                description: "Task description for Task 4.",
            },
            {
                id: "5",
                title: "Task 5",
                assignee: "Eve",
                priority: "medium",
                description: "Task description for Task 5.",
            },
            {
                id: "6",
                title: "Task 6",
                assignee: "Frank",
                priority: "low",
                description: "Task description for Task 6.",
            },
        ],
        closed: [
            {
                id: "7",
                title: "Task 7",
                assignee: "Grace",
                priority: "high",
                description: "Task description for Task 7.",
            },
            {
                id: "8",
                title: "Task 8",
                assignee: "Henry",
                priority: "medium",
                description: "Task description for Task 8.",
            },
            {
                id: "9",
                title: "Task 9",
                assignee: "Ivy",
                priority: "low",
                description: "Task description for Task 9.",
            },
        ],
    };
}
