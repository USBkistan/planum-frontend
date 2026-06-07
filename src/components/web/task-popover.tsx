import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TaskPopoverProps {
  groupKey: string;
  taskTitle: string;
  openPopover: string | null;
  setOpenPopover: (value: string | null) => void;
  handleAddTask: () => void;
  setTaskTitle: (value: string) => void;
}

export default function TaskPopover({
  groupKey,
  taskTitle,
  openPopover,
  setOpenPopover,
  handleAddTask,
  setTaskTitle,
}: TaskPopoverProps) {
  return (
    <Popover
      open={openPopover === groupKey}
      onOpenChange={(open) => setOpenPopover(open ? groupKey : null)}
    >
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Создать новую задачу</h4>
          <Input
            placeholder="Название задачи..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <Button onClick={() => handleAddTask()} className="w-full" size="sm">
            Добавить задачу
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
