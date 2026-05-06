"use client";

import { useState } from "react";

import { Item, ItemTitle } from "@/components/ui/item";
import Task from "@/components/web/task";
import TaskPopover from "@/components/web/task-popover";

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

  const [taskTitle, setTaskTitle] = useState("");
  const [openPopover, setOpenPopover] = useState<string | null>(null);

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

  const handleAddTask = (groupKey: string) => {
    if (!taskTitle.trim()) return;

    const newTask: TaskData = {
      id: Date.now().toString(),
      title: taskTitle,
      assignee: "Unassigned",
      priority: "medium",
    };

    setTasks((prev) => ({
      ...prev,
      [groupKey]: [...prev[groupKey as keyof typeof prev], newTask],
    }));

    setTaskTitle("");
    setOpenPopover(null);
  };

  const renderTasksColumn = (groupKey: string, groupLabel: string, taskList: TaskData[]) => (
    <Item
      variant={"outline"}
      className="flex max-h-full min-h-0 flex-1 flex-col items-start gap-2.5 p-3"
    >
      <div className="flex w-full items-center gap-2">
        <ItemTitle>{groupLabel}</ItemTitle>
        <TaskPopover
          groupKey={groupKey}
          taskTitle={taskTitle}
          openPopover={openPopover}
          setOpenPopover={setOpenPopover}
          handleAddTask={handleAddTask}
          setTaskTitle={setTaskTitle}
        />
      </div>
      <div
        className="flex w-full flex-1 flex-col gap-2.5 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(groupKey)}
      >
        {taskList.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(task.id, groupKey)}
            className="w-full shrink-0 cursor-move"
          >
            <Task title={task.title} assignee={task.assignee} priority={task.priority} />
          </div>
        ))}
      </div>
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
