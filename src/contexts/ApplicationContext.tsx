import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Types for our application data
interface ApplicationData {
  id: number;
  company: string;
  position: string;
  date: string;
  status: string;
  link: string;
  notes?: string;
  user_id: string;
}

interface ApplicationContextType {
  applications: ApplicationData[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationData[]>>;
  isLoading: boolean;
}

// Default values for applications
const defaultApplications: ApplicationData[] = [
  {
    id: 1,
    company: "Google",
    position: "Frontend Developer",
    date: "2023-05-15",
    status: "Interview",
    link: "https://careers.google.com",
    notes: "Applied for the Mountain View office. Interviewing with the Chrome team.",
    user_id: "",
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Software Engineer",
    date: "2023-05-10",
    status: "Applied",
    link: "https://careers.microsoft.com",
    notes: "Remote position. Need to follow up next week.",
    user_id: "",
  },
  {
    id: 3,
    company: "Amazon",
    position: "Full Stack Developer",
    date: "2023-05-08",
    status: "Phone Screen",
    link: "https://amazon.jobs",
    notes: "Will have a 30-minute call with HR on Friday.",
    user_id: "",
  },
  {
    id: 4,
    company: "Meta",
    position: "React Developer",
    date: "2023-05-05",
    status: "Rejected",
    link: "https://metacareers.com",
    notes: "Got feedback that they wanted someone with more backend experience.",
    user_id: "",
  },
  {
    id: 5,
    company: "Apple",
    position: "UI Engineer",
    date: "2023-05-01",
    status: "Offer",
    link: "https://apple.com/careers",
    notes: "Need to respond by May 15th. Salary negotiation in progress.",
    user_id: "",
  },
];

// Create the context
const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Create a provider component
export const ApplicationProvider: React.FC<{ 
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children, userId }) => {
  // Initialize state for applications
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadApplications = () => {
      try {
        const savedApplications = localStorage.getItem("applications");
        if (savedApplications) {
          setApplications(JSON.parse(savedApplications));
        } else {
          // If no saved applications, use default ones
          setApplications(defaultApplications);
        }
      } catch (error) {
        console.error('Error loading applications from localStorage:', error);
        setApplications(defaultApplications);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (applications.length > 0) {
      try {
        localStorage.setItem("applications", JSON.stringify(applications));
      } catch (error) {
        console.error('Error saving applications to localStorage:', error);
      }
    }
  }, [applications]);

  // Create the context value object
  const contextValue: ApplicationContextType = {
    applications,
    setApplications,
    isLoading
  };

  return <ApplicationContext.Provider value={contextValue}>{children}</ApplicationContext.Provider>;
};

// Custom hook to use the application context
export const useApplications = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};
