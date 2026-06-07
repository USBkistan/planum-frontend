import { TaskData } from "@/app/schemas/tasks";

import { Badge } from "../ui/badge";
import { Item, ItemContent, ItemTitle } from "../ui/item";

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const priorityTranslations = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export default function Task({ title, assignee, priority, description }: TaskData) {
  return (
    <Item variant={"outline"} className="p-3">
      <ItemContent className="gap-2">
        {title && <ItemTitle className="line-clamp-2 text-sm">{title}</ItemTitle>}
        {description && <p className="line-clamp-2 text-xs text-gray-500">{description}</p>}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gray-600">{assignee}</span>
          <Badge className={`shrink-0 text-xs ${priorityColors[priority]}`}>
            {priorityTranslations[priority]}
          </Badge>
        </div>
      </ItemContent>
    </Item>
  );
}
