import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Check, FilterX, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";
import ReactConfetti from "react-confetti";
import TaskDetails from "@/components/tasks/TaskDetails";

const priorityOptions = ["High", "Medium", "Low"];
const statusOptions = ["Planning", "In Progress", "Completed"];

type SortField = "dueDate" | "priority" | "category" | "status";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface CategoryData {
  name: string;
  color: string;
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

const Tasks = () => {
  const { tasks, setTasks, categories, addCategory, deleteCategory } = useData();
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: new Date().toISOString().split('T')[0],
    priority: "Medium",
    category: "Other",
    notes: "",
    completed: false,
    status: "Planning",
  });

  // Category management state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("bg-gray-100 text-gray-800");
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ name: string; color: string } | null>(null);

  // Filtering state
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCompleted, setFilterCompleted] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sorting state
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      const updatedTasks = tasks.map((task) => 
        task.id === editingTask.id 
          ? { ...task, ...newTask }
          : task
      );
      
      setTasks(updatedTasks);
      toast(`Task "${newTask.title}" updated successfully`);
      setEditingTask(null);
    } else {
      const task = {
        id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        ...newTask,
      };
      
      setTasks((prev) => [...prev, task]);
      toast(`Task "${task.title}" added successfully`);
    }
    
    setNewTask({
      title: "",
      dueDate: new Date().toISOString().split('T')[0],
      priority: "Medium",
      category: "Other",
      notes: "",
      completed: false,
      status: "Planning",
    });
    
    setOpen(false);
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      notes: task.notes,
      completed: task.completed,
      status: task.status || "Planning",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setTaskToDelete(null);
    toast("Task deleted successfully");
  };

  const toggleTaskComplete = (id: number) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            status: !task.completed ? "Completed" : "In Progress"
          }
        : task
    );
    
    setTasks(updatedTasks);
    const task = tasks.find((task) => task.id === id);
    if (task) {
      toast(`Task "${task.title}" marked as ${task.completed ? "incomplete" : "complete"}`);
      
      // Check if all tasks are completed
      const allCompleted = updatedTasks.every(t => t.completed);
      if (allCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const handleStatusChange = (status: string) => {
    setNewTask(prev => ({
      ...prev,
      status,
      completed: status === "Completed"
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterCategory("all");
    setFilterPriority("all");
    setFilterCompleted("all");
    setSearchQuery("");
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfigs(prev => {
      const existingConfig = prev.find(config => config.field === field);
      if (existingConfig) {
        // Toggle direction if field exists
        return prev.map(config => 
          config.field === field 
            ? { ...config, direction: config.direction === "asc" ? "desc" : "asc" }
            : config
        );
      } else {
        // Add new field with ascending direction
        return [...prev, { field, direction: "asc" }];
      }
    });
  };

  const getSortIcon = (field: SortField) => {
    const config = sortConfigs.find(c => c.field === field);
    if (!config) return <ArrowUpDown className="h-4 w-4" />;
    return config.direction === "asc" ? <ArrowUpDown className="h-4 w-4 rotate-180" /> : <ArrowUpDown className="h-4 w-4" />;
  };

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    // First filter the tasks
    let filtered = tasks;
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(task => task.category === filterCategory);
    }
    
    if (filterPriority !== "all") {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
    
    if (filterCompleted !== "all") {
      const completedValue = filterCompleted === "completed";
      filtered = filtered.filter(task => task.completed === completedValue);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.notes.toLowerCase().includes(query)
      );
    }
    
    // Then sort the filtered tasks
    return [...filtered].sort((a, b) => {
      // First sort by completion status (completed tasks go to bottom)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Apply custom sorting based on sortConfigs
      for (const config of sortConfigs) {
        let comparison = 0;
        switch (config.field) {
          case "dueDate":
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
          case "priority":
            const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
            comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
        }
        if (comparison !== 0) {
          return config.direction === "asc" ? comparison : -comparison;
        }
      }
      
      // Default sorting by due date and priority if no sort configs
      const dateComparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      
      const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  }, [tasks, filterCategory, filterPriority, filterCompleted, searchQuery, sortConfigs]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName("");
      setNewCategoryColor("bg-gray-100 text-gray-800");
      toast(`Category "${newCategoryName.trim()}" added successfully`);
    }
  };

  const handleEditCategory = (category: { name: string; color: string }) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && newCategoryName.trim()) {
      // Update tasks that use this category
      const updatedTasks = tasks.map(task => 
        task.category === editingCategory.name ? { ...task, category: newCategoryName.trim() } : task
      );
      setTasks(updatedTasks);
      
      // Update the category
      deleteCategory(editingCategory.name);
      addCategory(newCategoryName.trim(), newCategoryColor);
      
      setEditingCategory(null);
      setNewCategoryName("");
      setNewCategoryColor("bg-gray-100 text-gray-800");
      toast(`Category updated successfully`);
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    // Update tasks that use this category to use "Other" as fallback
    const updatedTasks = tasks.map(task => 
      task.category === categoryName ? { ...task, category: "Other" } : task
    );
    setTasks(updatedTasks);
    
    // Delete the category
    deleteCategory(categoryName);
    
    // Reset category filter if it was set to the deleted category
    if (filterCategory === categoryName) {
      setFilterCategory("all");
    }
    
    toast(`Category "${categoryName}" deleted successfully`);
  };

  return (
    <div className="space-y-6">
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                <DialogDescription>
                  {editingTask ? "Update task details" : "Track a new task"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => handleSelectChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newTask.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes about this task..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newTask.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="completed">Completion</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="completed" 
                        checked={newTask.completed}
                        onCheckedChange={(checked) => {
                          const isCompleted = checked === true;
                          setNewTask(prev => ({
                            ...prev,
                            completed: isCompleted,
                            status: isCompleted ? "Completed" : "In Progress"
                          }));
                        }}
                      />
                      <label
                        htmlFor="completed"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Mark as completed
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpen(false);
                  setEditingTask(null);
                  setNewTask({
                    title: "",
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: "Medium",
                    category: "Other",
                    notes: "",
                    completed: false,
                    status: "Planning",
                  });
                }}>
                  Cancel
                </Button>
                <Button type="submit">{editingTask ? "Update" : "Save"} Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Task Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              onEdit={() => {
                setDetailsOpen(false);
                handleEdit(selectedTask);
              }}
              onDelete={() => {
                setDetailsOpen(false);
                setTaskToDelete(selectedTask.id);
              }}
            />
          )}
        </Dialog>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-[180px] font-normal">
                <Edit className="h-4 w-4 mr-2" />
                Edit Categories
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Categories</DialogTitle>
                <DialogDescription>
                  Add, edit, or delete categories for your tasks
                </DialogDescription>
              </DialogHeader>
              
              {/* Category List */}
              <div className="space-y-4">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((categoryItem) => (
                        <TableRow key={categoryItem.name}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${categoryItem.color}`} />
                              {categoryItem.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {categoryItem.name !== "Other" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCategory(categoryItem)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete the category "{categoryItem.name}"? 
                                          Tasks in this category will be moved to "Other".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteCategory(categoryItem.name)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Add/Edit Category Form */}
                <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="categoryName">
                        {editingCategory ? "Edit Category" : "New Category"}
                      </Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="categoryColor">Color</Label>
                      <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bg-purple-100 text-purple-800">Purple</SelectItem>
                          <SelectItem value="bg-blue-100 text-blue-800">Blue</SelectItem>
                          <SelectItem value="bg-green-100 text-green-800">Green</SelectItem>
                          <SelectItem value="bg-orange-100 text-orange-800">Orange</SelectItem>
                          <SelectItem value="bg-pink-100 text-pink-800">Pink</SelectItem>
                          <SelectItem value="bg-gray-100 text-gray-800">Gray</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    {editingCategory && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(null);
                          setNewCategoryName("");
                          setNewCategoryColor("bg-gray-100 text-gray-800");
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                    <Button type="submit">
                      {editingCategory ? "Update" : "Add"} Category
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterCompleted} onValueChange={setFilterCompleted}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="active">Active Tasks</SelectItem>
              <SelectItem value="completed">Completed Tasks</SelectItem>
            </SelectContent>
          </Select>
          
          {(filterCategory !== "all" || filterPriority !== "all" || filterCompleted !== "all" || searchQuery) && (
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Task</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("dueDate")}>
                  Due Date {getSortIcon("dueDate")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("priority")}>
                  Priority {getSortIcon("priority")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("category")}>
                  Category {getSortIcon("category")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("status")}>
                  Status {getSortIcon("status")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.map((task) => (
              <TableRow 
                key={task.id} 
                className={`${task.completed ? "bg-muted/20" : ""} cursor-pointer hover:bg-muted/50`}
                onClick={() => {
                  setSelectedTask(task);
                  setDetailsOpen(true);
                }}
              >
                <TableCell>
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={(checked) => {
                      toggleTaskComplete(task.id);
                    }}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex-1">{task.title}</span>
                    <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task);
                        }}
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        title="Edit task"
                      >
                        <Edit className="h-3 w-3 text-muted-foreground" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog open={taskToDelete === task.id} onOpenChange={(open) => 
                        !open && setTaskToDelete(null)
                      }>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTaskToDelete(task.id);
                            }}
                            className="h-6 w-6 p-0 hover:bg-transparent"
                            title="Delete task"
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{task.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(task.id);
                                setDetailsOpen(false);
                                setTaskToDelete(null);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(task.dueDate + 'T00:00:00'), 'MMM d, yyyy')}
                  {
                    !task.completed && 
                    new Date(task.dueDate + 'T00:00:00') < new Date() &&
                    <div className="text-xs text-destructive mt-1">Overdue</div>
                  }
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    categories.find(cat => cat.name === task.category)?.color || "bg-gray-100 text-gray-800"
                  }`}>
                    {task.category}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === "Completed" 
                      ? "bg-green-100 text-green-800"
                      : task.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {task.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;
