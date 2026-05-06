"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface TaskData {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
}

interface TaskSidebarProps {
  task: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: TaskData) => void;
}

export default function TaskSidebar({ task, isOpen, onClose, onTaskUpdate }: TaskSidebarProps) {
  const [editedTask, setEditedTask] = useState<TaskData | null>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    if (editedTask) {
      onTaskUpdate(editedTask);
      onClose();
    }
  };

  if (!editedTask) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update task details and save your changes.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={editedTask.assignee}
              onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
              placeholder="Enter assignee name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={editedTask.priority}
              onValueChange={(value) =>
                setEditedTask({
                  ...editedTask,
                  priority: value as "low" | "medium" | "high",
                })
              }
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 px-4 py-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
