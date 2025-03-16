import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our task data
interface TaskData {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  category: string;
  notes: string;
  completed: boolean;
  status: string;
}

interface TaskContextType {
  tasks: TaskData[];
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
  getTasksDueSoon: () => TaskData[];
}

// Default values for tasks
const defaultTasks: TaskData[] = [
  {
    id: 1,
    title: "Update resume",
    dueDate: "2023-05-20",
    priority: "High",
    category: "Preparation",
    notes: "Focus on recent projects and technical skills",
    completed: false,
    status: "Planning",
  },
  {
    id: 2,
    title: "Research Company X",
    dueDate: "2023-05-22",
    priority: "Medium",
    category: "Research",
    notes: "Look into their recent product launches and tech stack",
    completed: false,
    status: "In Progress",
  },
  {
    id: 3,
    title: "Practice coding interview questions",
    dueDate: "2023-05-25",
    priority: "High",
    category: "Practice",
    notes: "Focus on algorithms and data structures",
    completed: false,
    status: "Planning",
  },
  {
    id: 4,
    title: "Connect with industry contacts",
    dueDate: "2023-05-30",
    priority: "Medium",
    category: "Networking",
    notes: "Reach out to former colleagues and LinkedIn connections",
    completed: true,
    status: "Completed",
  },
  {
    id: 5,
    title: "Set up job search alerts",
    dueDate: "2023-05-15",
    priority: "Low",
    category: "Organization",
    notes: "Set up alerts on LinkedIn, Indeed, and other job sites",
    completed: true,
    status: "Completed",
  },
];

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a provider component
export const TaskProvider: React.FC<{ 
  children: React.ReactNode;
  userId?: string | null; 
}> = ({ children }) => {
  // Initialize state for tasks
  const [tasks, setTasks] = useState<TaskData[]>([]);

  // Get tasks due in the next 2 days
  const getTasksDueSoon = () => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.completed && taskDate >= today && taskDate <= twoDaysLater;
    });
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadTasks = localStorage.getItem("tasks");

    // Set tasks data
    if (loadTasks) {
      setTasks(JSON.parse(loadTasks));
    } else {
      setTasks(defaultTasks);
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Create the context value object
  const contextValue: TaskContextType = {
    tasks,
    setTasks,
    getTasksDueSoon,
  };

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};

// Custom hook to use the task context
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
