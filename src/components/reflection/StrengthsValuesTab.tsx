import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Target, MessageSquare } from "lucide-react";
import { TagItem } from "@/types/ReflectionTypes";
import TagInput from "./TagInput";

type StrengthsValuesTabProps = {
  strengths: TagItem[];
  values: TagItem[];
  industries: TagItem[];
  roles: TagItem[];
  intersections: TagItem[];
  handleTagsChange: (type: string, items: TagItem[]) => void;
  quotes: { text: string; author: string }[];
};

const StrengthsValuesTab: React.FC<StrengthsValuesTabProps> = ({
  strengths,
  values,
  industries,
  roles,
  intersections,
  handleTagsChange,
  quotes,
}) => {
  // Create handler functions that directly pass items to handleTagsChange
  const handleIndustriesChange = (items: TagItem[]) => handleTagsChange("industry", items);
  const handleRolesChange = (items: TagItem[]) => handleTagsChange("role", items);
  const handleIntersectionsChange = (items: TagItem[]) => handleTagsChange("intersection", items);
  const handleStrengthsChange = (items: TagItem[]) => handleTagsChange("strength", items);
  const handleValuesChange = (items: TagItem[]) => handleTagsChange("value", items);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Career Targets
          </CardTitle>
          <CardDescription>
            Define target industries, roles and their intersections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TagInput
              items={industries}
              setItems={handleIndustriesChange}
              placeholder="Add industry (press Enter)"
              label="Target Industries"
              onItemsChange={handleIndustriesChange}
              promptText="Enter industries you're interested in (e.g., Tech, Healthcare, Finance)"
            />
            
            <TagInput
              items={roles}
              setItems={handleRolesChange}
              placeholder="Add role (press Enter)"
              label="Target Roles/Functions"
              onItemsChange={handleRolesChange}
              promptText="Enter roles you're targeting (e.g., Product Manager, Data Analyst)"
            />
            
            <TagInput
              items={intersections}
              setItems={handleIntersectionsChange}
              placeholder="Add intersection (press Enter)"
              label="Intersections/Alternatives"
              onItemsChange={handleIntersectionsChange}
              promptText="Enter combined industry/role targets (e.g., FinTech PM, Healthcare Data)"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Personal Attributes
          </CardTitle>
          <CardDescription>
            Define your core strengths and values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TagInput
              items={strengths}
              setItems={handleStrengthsChange}
              placeholder="Add strength (press Enter)"
              label="Strengths"
              onItemsChange={handleStrengthsChange}
              promptText="Enter your professional strengths (e.g., Communication, Problem-solving, Leadership)"
            />
            
            <TagInput
              items={values}
              setItems={handleValuesChange}
              placeholder="Add value (press Enter)"
              label="Values"
              onItemsChange={handleValuesChange}
              promptText="Enter your core values (e.g., Growth, Work-life balance, Impact)"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <div 
                key={index} 
                className="relative group transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="absolute -left-2 top-0 text-4xl text-purple-200 group-hover:text-purple-300 transition-colors">"</div>
                <blockquote className="pl-4 py-2 text-purple-800">
                  <p className="text-sm leading-relaxed">{quote.text}</p>
                  <footer className="mt-2 text-xs text-purple-600 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    — {quote.author}
                  </footer>
                </blockquote>
                <div className="absolute -right-2 bottom-0 text-4xl text-purple-200 group-hover:text-purple-300 transition-colors rotate-180">"</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrengthsValuesTab;
