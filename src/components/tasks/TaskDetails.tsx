import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskDetailsProps {
  task: {
    id: number;
    title: string;
    dueDate: string;
    priority: string;
    category: string;
    notes: string;
    completed: boolean;
    status: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Preparation":
      return "bg-purple-100 text-purple-800";
    case "Research":
      return "bg-blue-100 text-blue-800";
    case "Practice":
      return "bg-green-100 text-green-800";
    case "Networking":
      return "bg-orange-100 text-orange-800";
    case "Organization":
      return "bg-pink-100 text-pink-800";
    case "Other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onEdit, onDelete }) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>{task.title}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
            <p className="mt-1">
              {format(new Date(task.dueDate + 'T00:00:00'), 'MMM d, yyyy')}
              {!task.completed && new Date(task.dueDate + 'T00:00:00') < new Date() && (
                <span className="ml-2 text-xs text-destructive">Overdue</span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
            <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
          <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
            {task.category}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            task.status === "Completed" 
              ? "bg-green-100 text-green-800"
              : task.status === "In Progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}>
            {task.status}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
          <p className="mt-1 text-sm whitespace-pre-wrap">{task.notes || "No notes"}</p>
        </div>
      </div>
    </DialogContent>
  );
};

export default TaskDetails; 