"use client";

import { useState } from "react";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import Task from "@/components/web/task";

interface TaskData {
  id: string;
  title: string;
  assignee: string;
  priority: "low" | "medium" | "high";
}

interface TasksState {
  open: TaskData[];
  inProgress: TaskData[];
  closed: TaskData[];
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<TasksState>({
    open: [
      { id: "1", title: "Task 1", assignee: "Alice", priority: "high" },
      { id: "2", title: "Task 2", assignee: "Bob", priority: "medium" },
      { id: "3", title: "Task 3", assignee: "Charlie", priority: "low" },
    ],
    inProgress: [
      { id: "4", title: "Task 4", assignee: "David", priority: "high" },
      { id: "5", title: "Task 5", assignee: "Eve", priority: "medium" },
      { id: "6", title: "Task 6", assignee: "Frank", priority: "low" },
    ],
    closed: [
      { id: "7", title: "Task 7", assignee: "Grace", priority: "high" },
      { id: "8", title: "Task 8", assignee: "Henry", priority: "medium" },
      { id: "9", title: "Task 9", assignee: "Ivy", priority: "low" },
    ],
  });

  const [draggedTask, setDraggedTask] = useState<{ taskId: string; sourceGroup: string } | null>(
    null,
  );

  const handleDragStart = (taskId: string, sourceGroup: string) => {
    setDraggedTask({ taskId, sourceGroup });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetGroup: string) => {
    if (!draggedTask) return;

    const { taskId, sourceGroup } = draggedTask;

    if (sourceGroup === targetGroup) {
      setDraggedTask(null);
      return;
    }

    setTasks((prev) => {
      const sourceList = prev[sourceGroup as keyof typeof prev] || [];
      const targetList = prev[targetGroup as keyof typeof prev] || [];

      const taskToMove = sourceList.find((t) => t.id === taskId);

      if (!taskToMove) return prev;

      return {
        ...prev,
        [sourceGroup]: sourceList.filter((t) => t.id !== taskId),
        [targetGroup]: [...targetList, taskToMove],
      };
    });

    setDraggedTask(null);
  };

  const renderTasksColumn = (groupKey: string, groupLabel: string, taskList: TaskData[]) => (
    <Item variant={"outline"} className="flex flex-1 flex-col items-start gap-2.5 p-3">
      <ItemTitle>{groupLabel}</ItemTitle>
      <ItemContent
        className="w-full gap-2.5"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(groupKey)}
      >
        {taskList.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(task.id, groupKey)}
            className="cursor-move"
          >
            <Task title={task.title} assignee={task.assignee} priority={task.priority} />
          </div>
        ))}
      </ItemContent>
    </Item>
  );

  return (
    <div className="flex h-full w-full flex-row justify-between gap-5 p-5">
      {renderTasksColumn("open", "Открыто", tasks.open)}
      {renderTasksColumn("inProgress", "В работе", tasks.inProgress)}
      {renderTasksColumn("closed", "Закрыто", tasks.closed)}
    </div>
  );
}
