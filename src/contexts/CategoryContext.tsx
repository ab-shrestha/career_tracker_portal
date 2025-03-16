import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our category data
interface CategoryData {
  name: string;
  color: string;
}

interface CategoryContextType {
  categories: CategoryData[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[]>>;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (name: string) => void;
}

// Default categories with their colors
const defaultCategories: CategoryData[] = [
  { name: "Preparation", color: "bg-purple-100 text-purple-800" },
  { name: "Research", color: "bg-blue-100 text-blue-800" },
  { name: "Practice", color: "bg-green-100 text-green-800" },
  { name: "Networking", color: "bg-orange-100 text-orange-800" },
  { name: "Organization", color: "bg-pink-100 text-pink-800" },
  { name: "Other", color: "bg-gray-100 text-gray-800" },
];

// Create the context
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Create a provider component
export const CategoryProvider: React.FC<{ 
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children }) => {
  // Initialize state for categories
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // Add a new category
  const addCategory = (name: string, color: string) => {
    setCategories(prev => {
      // Check if category already exists
      if (prev.some(cat => cat.name === name)) {
        return prev;
      }
      return [...prev, { name, color }];
    });
  };

  // Delete a category
  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(cat => cat.name !== name));
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadCategories = localStorage.getItem("categories");

    // Set categories data
    if (loadCategories) {
      setCategories(JSON.parse(loadCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories]);

  // Create the context value object
  const contextValue: CategoryContextType = {
    categories,
    setCategories,
    addCategory,
    deleteCategory,
  };

  return <CategoryContext.Provider value={contextValue}>{children}</CategoryContext.Provider>;
};

// Custom hook to use the category context
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}; 