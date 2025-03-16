
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TagItem } from "@/types/ReflectionTypes";

type TagInputProps = {
  items: TagItem[];
  setItems: (items: TagItem[]) => void; // Changed from React.Dispatch<React.SetStateAction<TagItem[]>> to a simpler function type
  placeholder: string;
  label: string;
  onItemsChange: (items: TagItem[]) => void;
  promptText?: string;
};

const TagInput: React.FC<TagInputProps> = ({
  items,
  setItems,
  placeholder,
  label,
  onItemsChange,
  promptText,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addItem = (value: string) => {
    if (value.trim() === "") return;
    
    // Check if multiple values were entered (comma-separated)
    const values = value.split(",").map(v => v.trim()).filter(v => v !== "");
    
    if (values.length > 0) {
      const newItems = [
        ...items,
        ...values.map(v => ({ id: Date.now().toString() + Math.random().toString(36).substr(2, 9), value: v }))
      ];
      
      setItems(newItems);
      onItemsChange(newItems);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addItem(inputValue);
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      </div>
      
      {promptText && (
        <p className="text-xs text-muted-foreground mb-2">{promptText}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item) => (
          <Badge 
            key={item.id} 
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            {item.value}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 rounded-full"
              onClick={() => handleRemoveItem(item.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={() => addItem(inputValue)} size="sm">
          Add
        </Button>
      </div>
    </div>
  );
};

export default TagInput;
