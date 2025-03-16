import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, Pen, X } from "lucide-react";
import { StorySection } from "@/types/ReflectionTypes";
import { Book as BookIcon, Target as TargetIcon, Sparkles, Lightbulb, Heart, MessageSquare as MessageSquareIcon, CheckSquare } from "lucide-react";

type StoryTabProps = {
  storySections: StorySection[];
  toggleStoryEditMode: (id: string) => void;
  updateStorySection: (id: string, value: string) => void;
};

const StoryTab: React.FC<StoryTabProps> = ({
  storySections,
  toggleStoryEditMode,
  updateStorySection,
}) => {
  // Add default icons to story sections if they don't have them
  const sectionsWithIcons = storySections.map(section => {
    if (section.icon) return section;
    
    let icon;
    switch(section.id) {
      case 'story':
        icon = <BookIcon className="h-4 w-4 text-purple-500" />;
        break;
      case 'passion':
        icon = <Heart className="h-4 w-4 text-purple-500" />;
        break;
      case 'proofOfPassion':
      case 'proofOfSkills':
        icon = <CheckSquare className="h-4 w-4 text-purple-500" />;
        break;
      case 'skills':
        icon = <Sparkles className="h-4 w-4 text-purple-500" />;
        break;
      case 'goals':
      case 'wantInJob':
        icon = <TargetIcon className="h-4 w-4 text-purple-500" />;
        break;
      case 'potential':
        icon = <Lightbulb className="h-4 w-4 text-purple-500" />;
        break;
      case 'offerToJob':
        icon = <Sparkles className="h-4 w-4 text-purple-500" />;
        break;
      default:
        icon = <MessageSquareIcon className="h-4 w-4 text-purple-500" />;
    }
    
    return { ...section, icon };
  });
  
  // Find the main story section
  const mainStorySection = sectionsWithIcons.find(section => section.id === "story");
  // Get all other sections
  const otherSections = sectionsWithIcons.filter(section => section.id !== "story");

  const renderStorySection = (section: StorySection & { icon?: React.ReactNode }, isMainStory: boolean = false) => (
    <div key={section.id} className={`bg-white rounded-md border p-2 shadow-sm ${isMainStory ? 'col-span-full' : ''}`}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium flex items-center gap-1">
          {section.icon}
          {section.label}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => toggleStoryEditMode(section.id)}
          className="h-7 w-7 p-0 hover:bg-purple-50"
          title={section.isEditing ? "Cancel editing" : "Edit section"}
        >
          {section.isEditing ? <X className="h-3.5 w-3.5" /> : <Pen className="h-3.5 w-3.5" />}
        </Button>
      </div>
      
      {section.isEditing ? (
        <div className="space-y-1">
          <Textarea 
            defaultValue={section.value}
            className={`min-h-[60px] text-sm ${isMainStory ? 'min-h-[100px]' : ''}`}
            placeholder={`Write about your ${section.label.toLowerCase()}...`}
            id={`edit-story-${section.id}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                const textarea = document.getElementById(`edit-story-${section.id}`) as HTMLTextAreaElement;
                updateStorySection(section.id, textarea.value);
              }
            }}
          />
          <Button 
            size="sm" 
            className="w-full text-xs py-1 h-7"
            onClick={() => {
              const textarea = document.getElementById(`edit-story-${section.id}`) as HTMLTextAreaElement;
              updateStorySection(section.id, textarea.value);
            }}
          >
            Save (⌘/Ctrl + Enter)
          </Button>
        </div>
      ) : (
        <div className={`min-h-[40px] text-sm prose prose-sm max-w-none ${isMainStory ? 'min-h-[80px]' : ''}`}>
          {section.value ? (
            <pre className="whitespace-pre-wrap font-sans">{section.value}</pre>
          ) : (
            <div className="flex items-center justify-center h-full py-4">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Pen className="h-4 w-4" />
                Click to add your {section.label.toLowerCase()}...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-500" />
          My Story
        </CardTitle>
        <CardDescription>
          Craft your personal career narrative
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {/* Main story section (full width) */}
          {mainStorySection && renderStorySection(mainStorySection, true)}
          
          {/* Other sections in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {otherSections.map(section => renderStorySection(section))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryTab;
