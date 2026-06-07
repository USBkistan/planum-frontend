"use client";

import { useEffect, useState } from "react";

import { TaskData } from "@/app/schemas/tasks";
import { UserData } from "@/app/schemas/user";
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
import { getGroupMembersRequest } from "@/services/groups";

interface TaskSidebarProps {
  task: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: TaskData) => void;
}

export default function TaskSidebar({ task, isOpen, onClose, onTaskUpdate }: TaskSidebarProps) {
  const [editedTask, setEditedTask] = useState<TaskData | null>(task);
  const [groupMembers, setGroupMembers] = useState<UserData[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const members = await getGroupMembersRequest();
      setGroupMembers(members);
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setEditedTask(task);
    setSelectedName(task?.assignee!);
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
          <SheetTitle>Изменить задачу</SheetTitle>
          <SheetDescription>Измените детали задачи и сохраните изменения.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Введите название задачи"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Исполнитель</Label>
            <Select
              value={editedTask.assignee ? editedTask.assignee : ""}
              onValueChange={(value) => {
                const member = groupMembers.find((e) => e.id == value);
                setSelectedName(member?.display_name!);
                setEditedTask({ ...editedTask, assignee_id: value });
              }}
            >
              <SelectTrigger id="assignee">
                {selectedName ? (
                  <SelectValue>{selectedName}</SelectValue>
                ) : (
                  <SelectValue>Выберите пользователя</SelectValue>
                )}
              </SelectTrigger>
              <SelectContent>
                {groupMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Приоритет</Label>
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
                <SelectItem value="low">Низкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 px-4 py-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отменить
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Сохранить изменения
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
