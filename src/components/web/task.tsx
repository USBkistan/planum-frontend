import { Badge } from "../ui/badge";
import { Card, CardHeader, CardContent } from "../ui/card";

interface TaskProps {
  title?: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
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
}: TaskProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Assignee:</span>
          <span className="text-xs font-medium">{assignee}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Priority:</span>
          <Badge className={`text-xs ${priorityColors[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
