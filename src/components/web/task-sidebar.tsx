"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { TaskData } from "@/app/schemas/tasks";
import { UserData } from "@/app/schemas/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { getGroupMembersRequest } from "@/services/groups";

import TaskComments from "./comments";

interface TaskSidebarProps {
  user: UserData;
  task: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: TaskData) => void;
  onTaskDelete: (taskId: string) => void;
}

export default function TaskSidebar({
  user,
  task,
  isOpen,
  onClose,
  onTaskUpdate,
  onTaskDelete,
}: TaskSidebarProps) {
  const [editedTask, setEditedTask] = useState<TaskData | null>(task);
  const [groupMembers, setGroupMembers] = useState<UserData[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      handleClose();
    }
  };

  const handleDeleteTask = async () => {
    if (!editedTask) return;

    onTaskDelete(editedTask.id);
    setShowDeleteDialog(false);
    handleClose();
  };

  const handleClose = () => {
    // Сбросить несохранённые изменения
    setEditedTask(task);
    setSelectedName(task?.assignee!);
    setShowDeleteDialog(false);
    onClose();
  };

  if (!editedTask) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-3xl!"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
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
                value={editedTask.assignee ? editedTask.assignee : "Выберите пользователя"}
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

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={editedTask.description || ""}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                placeholder="Введите описание задачи"
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-3 px-4 py-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Отменить
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Сохранить изменения
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить задачу
              </Button>
            </div>
          </div>

          <div className="space-y-6 px-4 py-4">
            {editedTask && <TaskComments taskId={editedTask.id} user={user} />}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить задачу "{editedTask.title}"? Это действие невозможно
            отменить.
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Отменить</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
