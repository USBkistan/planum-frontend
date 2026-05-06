import { Badge } from "../ui/badge";
import { Item, ItemContent, ItemTitle } from "../ui/item";

interface TaskProps {
  title?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  description?: string;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function Task({
  title = "Task Title",
  assignee = "Unassigned",
  priority = "medium",
  description,
}: TaskProps) {
  return (
    <Item variant={"outline"} className="p-3">
      <ItemContent className="gap-2">
        {title && <ItemTitle className="line-clamp-2 text-sm">{title}</ItemTitle>}
        {description && <p className="line-clamp-2 text-xs text-gray-500">{description}</p>}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gray-600">{assignee}</span>
          <Badge className={`shrink-0 text-xs ${priorityColors[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
      </ItemContent>
    </Item>
  );
}
