import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Target } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import StrengthsValuesTab from "@/components/reflection/StrengthsValuesTab";
import StoryTab from "@/components/reflection/StoryTab";
import { TagItem, StorySection } from "@/types/ReflectionTypes";
import { useToast } from "@/hooks/use-toast";

const quotes = [
  {
    text: "Find out what you like doing best, and get someone to pay you for doing it.",
    author: "Katharine Whitehorn"
  },
  {
    text: "Whatever you decide to do, make sure it makes you happy.",
    author: "Paulo Coelho"
  },
  {
    text: "Luck is what happens when preparation meets opportunity.",
    author: "Seneca"
  }
];

const ReflectionJournal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("strengths-values");
  
  const { 
    reflection, 
    updateReflectionStrengths,
    updateReflectionValues,
    updateReflectionIndustries,
    updateReflectionRoles,
    updateReflectionIntersections,
    updateReflectionStorySections,
    isLoading
  } = useData();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleTagsChange = (type: string, items: TagItem[]) => {
    switch (type) {
      case "strength":
        updateReflectionStrengths(items);
        break;
      case "value":
        updateReflectionValues(items);
        break;
      case "industry":
        updateReflectionIndustries(items);
        break;
      case "role":
        updateReflectionRoles(items);
        break;
      case "intersection":
        updateReflectionIntersections(items);
        break;
      default:
        break;
    }
    
    toast({
      title: `${type} updated`,
      description: `Your ${type} list has been updated.`,
    });
  };

  const toggleStoryEditMode = (id: string) => {
    const updatedSections = reflection.storySections.map(section => 
      section.id === id ? { ...section, isEditing: !section.isEditing } : section
    );
    updateReflectionStorySections(updatedSections);
  };

  const updateStorySection = (id: string, value: string) => {
    const updatedSections = reflection.storySections.map(section => 
      section.id === id ? { ...section, value, isEditing: false } : section
    );
    updateReflectionStorySections(updatedSections);
    
    toast({
      title: "Story updated",
      description: "Your story element has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reflection Journal</h1>
        <p className="text-muted-foreground">
          Document your career journey, identify your strengths, and align your values with potential opportunities.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="strengths-values" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Strengths & Values</span>
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>My Story</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="strengths-values">
          <StrengthsValuesTab
            strengths={reflection.strengths}
            values={reflection.values}
            industries={reflection.industries}
            roles={reflection.roles}
            intersections={reflection.intersections}
            handleTagsChange={handleTagsChange}
            quotes={quotes}
          />
        </TabsContent>
        
        <TabsContent value="story">
          <StoryTab
            storySections={reflection.storySections}
            toggleStoryEditMode={toggleStoryEditMode}
            updateStorySection={updateStorySection}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReflectionJournal;
