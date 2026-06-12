"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import { SocketMessage } from "@/app/schemas/socket";
import { TaskData, TasksState } from "@/app/schemas/tasks";
import { UserData } from "@/app/schemas/user";
import { Item, ItemTitle } from "@/components/ui/item";
import Task from "@/components/web/task";
import TaskPopover from "@/components/web/task-popover";
import TaskSidebar from "@/components/web/task-sidebar";
import { wsServerUrl } from "@/services/globals";
import { createTask, deleteTask, getTasks, updateTask } from "@/services/tasks";
import { getMeRequest } from "@/services/user";

export default function BoardPage() {
  const [tasks, setTasks] = useState<TasksState>({
    open: [],
    inProgress: [],
    closed: [],
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const access_token = Cookies.get("access_token")!;
    const ws = new WebSocket(`${wsServerUrl}/tasks?token=${access_token}`);

    ws.onopen = () => console.log("Connected to server");

    ws.onmessage = async (event) => {
      try {
        const socketMessage: SocketMessage = JSON.parse(event.data);
        if (socketMessage.type === "tasks_updated") {
          const tasksState = await getTasks();
          setTasks(tasksState);
        } else {
          console.log("Received unknown message type:", socketMessage.type);
        }
      } catch (error) {
        console.log(event.data);
      }
    };

    ws.onclose = () => console.log("Disconnected from server");

    setSocket(ws);

    const fetchData = async () => {
      const tasksState = await getTasks();
      const user = await getMeRequest();
      setTasks(tasksState);
      setUser(user);
    };

    fetchData();

    return () => {
      ws.close();
      controller.abort();
    };
  }, []);

  const [draggedTask, setDraggedTask] = useState<TaskData | null>(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDragStart = (task: TaskData) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetGroup: "open" | "progress" | "closed") => {
    if (!draggedTask) return;

    if (draggedTask.status === targetGroup) {
      setDraggedTask(null);
      return;
    }

    draggedTask.status = targetGroup;
    await updateTask(draggedTask);

    const socketMessage = {
      type: "tasks_updated",
      payload: {},
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(socketMessage));
    }

    setDraggedTask(null);
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    await createTask(taskTitle);

    const socketMessage = {
      type: "tasks_updated",
      payload: {},
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(socketMessage));
    }

    setTaskTitle("");
    setOpenPopover(null);
  };

  const handleTaskClick = (task: TaskData) => {
    setSelectedTask(task);
    setSidebarOpen(true);
  };

  const handleTaskUpdate = async (updatedTask: TaskData) => {
    await updateTask(updatedTask);

    const socketMessage = {
      type: "tasks_updated",
      payload: {},
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(socketMessage));
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId);

    const socketMessage = {
      type: "tasks_updated",
      payload: {},
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(socketMessage));
    }
  };

  const renderTasksColumn = (
    groupKey: "open" | "progress" | "closed",
    groupLabel: string,
    taskList: TaskData[],
  ) => {
    return (
      <Item
        variant={"outline"}
        className="flex max-h-full min-h-0 flex-1 flex-col items-start gap-2.5 p-3"
      >
        <div className="flex w-full items-center gap-2">
          <ItemTitle>{groupLabel}</ItemTitle>
          {groupKey === "open" && (
            <TaskPopover
              groupKey={groupKey}
              taskTitle={taskTitle}
              openPopover={openPopover}
              setOpenPopover={setOpenPopover}
              handleAddTask={handleAddTask}
              setTaskTitle={setTaskTitle}
            />
          )}
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
              onDragStart={() => handleDragStart(task)}
              onClick={() => handleTaskClick(task)}
              className="w-full shrink-0 cursor-move"
            >
              <Task
                id={task.id}
                title={task.title}
                description={task.description}
                assignee={task.assignee}
                assignee_id={task.assignee_id}
                priority={task.priority}
                status={task.status}
                created_by={task.created_by}
                group_id={task.group_id}
                created_at={task.created_at}
                updated_at={task.updated_at}
              />
            </div>
          ))}
        </div>
      </Item>
    );
  };

  return (
    <>
      <div className="flex h-full w-full flex-row justify-between gap-5 p-5">
        {renderTasksColumn("open", "Открыто", tasks.open)}
        {renderTasksColumn("progress", "В работе", tasks.inProgress)}
        {renderTasksColumn("closed", "Закрыто", tasks.closed)}
      </div>
      {user && socket && (
        <TaskSidebar
          user={user}
          task={selectedTask}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </>
  );
}
