
import React from "react";
import { TableItem, StorySection } from "@/types/ReflectionTypes";
import { ToastAction } from "@/components/ui/toast";

export const saveToLocalStorage = (
  strengths: TableItem[],
  values: TableItem[],
  industries: TableItem[],
  roles: TableItem[],
  intersections: TableItem[],
  storySections: StorySection[]
) => {
  localStorage.setItem("strengths", JSON.stringify(strengths));
  localStorage.setItem("values", JSON.stringify(values));
  localStorage.setItem("industries", JSON.stringify(industries));
  localStorage.setItem("roles", JSON.stringify(roles));
  localStorage.setItem("intersections", JSON.stringify(intersections));
  localStorage.setItem("storySections", JSON.stringify(storySections));
};

export const handleAddItem = (
  items: TableItem[],
  setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
  newValue: string,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  type: string,
  toast: any
) => {
  if (newValue.trim() === "") {
    toast({
      title: "Cannot add empty item",
      description: `Please enter a ${type} first.`,
      variant: "destructive",
    });
    return;
  }
  
  const newId = Date.now().toString();
  const updatedItems = [...items, { id: newId, value: newValue }];
  setItems(updatedItems);
  setNewValue("");
  
  toast({
    title: `${type} added`,
    description: `${newValue} has been added to your ${type.toLowerCase()} list.`,
  });
  
  // Save to localStorage
  localStorage.setItem(type.toLowerCase() + "s", JSON.stringify(updatedItems));
};

export const handleEditItem = (
  items: TableItem[],
  setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
  id: string
) => {
  const updatedItems = items.map(item => 
    item.id === id ? { ...item, isEditing: !item.isEditing } : item
  );
  setItems(updatedItems);
};

export const handleUpdateItem = (
  items: TableItem[],
  setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
  id: string,
  newValue: string,
  type: string,
  toast: any
) => {
  if (newValue.trim() === "") {
    toast({
      title: "Cannot save empty item",
      description: `Please enter a value or delete the ${type}.`,
      variant: "destructive",
    });
    return;
  }
  
  const updatedItems = items.map(item => 
    item.id === id ? { ...item, value: newValue, isEditing: false } : item
  );
  setItems(updatedItems);
  
  toast({
    title: `${type} updated`,
    description: `Your ${type.toLowerCase()} has been updated.`,
  });
  
  // Save to localStorage
  localStorage.setItem(type.toLowerCase() + "s", JSON.stringify(updatedItems));
};

export const handleDeleteItem = (
  items: TableItem[],
  setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
  id: string,
  type: string,
  toast: any
) => {
  const updatedItems = items.filter(item => item.id !== id);
  setItems(updatedItems);
  
  toast({
    title: `${type} deleted`,
    description: `Your ${type.toLowerCase()} has been removed.`,
  });
  
  // Save to localStorage
  localStorage.setItem(type.toLowerCase() + "s", JSON.stringify(updatedItems));
};
