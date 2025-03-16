import React, { createContext, useContext, useState, useEffect } from "react";
import { TagItem, StorySection } from "@/types/ReflectionTypes";

interface ReflectionData {
  strengths: TagItem[];
  values: TagItem[];
  industries: TagItem[];
  roles: TagItem[];
  intersections: TagItem[];
  storySections: StorySection[];
}

interface ReflectionContextType {
  reflection: ReflectionData;
  setReflection: React.Dispatch<React.SetStateAction<ReflectionData>>;
  updateReflectionStrengths: (strengths: TagItem[]) => void;
  updateReflectionValues: (values: TagItem[]) => void;
  updateReflectionIndustries: (industries: TagItem[]) => void;
  updateReflectionRoles: (roles: TagItem[]) => void;
  updateReflectionIntersections: (intersections: TagItem[]) => void;
  updateReflectionStorySections: (storySections: StorySection[]) => void;
}

const defaultReflection: ReflectionData = {
  strengths: [
    { id: "1", value: "Creativity" },
    { id: "2", value: "Imagination" },
    { id: "3", value: "Communication" },
    { id: "4", value: "Presentations" },
    { id: "5", value: "Analytical Skills" }
  ],
  values: [
    { id: "1", value: "Influence" },
    { id: "2", value: "Decision making" },
    { id: "3", value: "Diversity and Inclusion" },
    { id: "4", value: "Ethics" },
    { id: "5", value: "Social Change" },
    { id: "6", value: "Autonomy" },
    { id: "7", value: "Flexibility" },
    { id: "8", value: "Travel" },
    { id: "9", value: "Compensation" }
  ],
  industries: [
    { id: "1", value: "Tech" },
    { id: "2", value: "Climate" },
    { id: "3", value: "VC" }
  ],
  roles: [
    { id: "1", value: "Product Manager" },
    { id: "2", value: "Strategy" },
    { id: "3", value: "Sr Associate" }
  ],
  intersections: [
    { id: "1", value: "Climate Tech" }
  ],
  storySections: [
    { id: "story", label: "Story", value: "", icon: null, isEditing: false },
    { id: "passion", label: "Passion", value: "", icon: null, isEditing: false },
    { id: "proofOfPassion", label: "Proof of Passion", value: "", icon: null, isEditing: false },
    { id: "skills", label: "Skills", value: "", icon: null, isEditing: false },
    { id: "proofOfSkills", label: "Proof of Skills", value: "", icon: null, isEditing: false },
    { id: "goals", label: "Goals", value: "", icon: null, isEditing: false },
    { id: "potential", label: "Potential", value: "", icon: null, isEditing: false },
    { id: "wantInJob", label: "What you want in a job", value: "", icon: null, isEditing: false },
    { id: "offerToJob", label: "What you can offer to a job", value: "", icon: null, isEditing: false }
  ]
};

// Create the context
const ReflectionContext = createContext<ReflectionContextType | undefined>(undefined);

// Create a provider component
export const ReflectionProvider: React.FC<{ 
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children }) => {
  // Initialize state for reflection data with a loading flag
  const [isInitialized, setIsInitialized] = useState(false);
  const [reflection, setReflection] = useState<ReflectionData>(defaultReflection);

  // Reflection data update helpers
  const updateReflectionStrengths = (strengths: TagItem[]) => {
    setReflection(prev => ({ ...prev, strengths }));
  };

  const updateReflectionValues = (values: TagItem[]) => {
    setReflection(prev => ({ ...prev, values }));
  };

  const updateReflectionIndustries = (industries: TagItem[]) => {
    setReflection(prev => ({ ...prev, industries }));
  };

  const updateReflectionRoles = (roles: TagItem[]) => {
    setReflection(prev => ({ ...prev, roles }));
  };

  const updateReflectionIntersections = (intersections: TagItem[]) => {
    setReflection(prev => ({ ...prev, intersections }));
  };

  const updateReflectionStorySections = (storySections: StorySection[]) => {
    setReflection(prev => ({ ...prev, storySections }));
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      // Try to load the entire reflection object first
      const savedReflection = localStorage.getItem("reflection");
      if (savedReflection) {
        const parsedReflection = JSON.parse(savedReflection);
        // Validate the structure of the saved data
        if (parsedReflection && 
            Array.isArray(parsedReflection.strengths) &&
            Array.isArray(parsedReflection.values) &&
            Array.isArray(parsedReflection.industries) &&
            Array.isArray(parsedReflection.roles) &&
            Array.isArray(parsedReflection.intersections) &&
            Array.isArray(parsedReflection.storySections)) {
          setReflection(parsedReflection);
          setIsInitialized(true);
          return;
        }
      }

      // If no valid saved data exists, try loading individual sections
      const loadReflectionStrengths = localStorage.getItem("strengths");
      const loadReflectionValues = localStorage.getItem("values");
      const loadReflectionIndustries = localStorage.getItem("industries");
      const loadReflectionRoles = localStorage.getItem("roles");
      const loadReflectionIntersections = localStorage.getItem("intersections");
      const loadReflectionStorySections = localStorage.getItem("storySections");

      // Create a new reflection object with saved data or defaults
      const newReflection = {
        strengths: loadReflectionStrengths ? JSON.parse(loadReflectionStrengths) : defaultReflection.strengths,
        values: loadReflectionValues ? JSON.parse(loadReflectionValues) : defaultReflection.values,
        industries: loadReflectionIndustries ? JSON.parse(loadReflectionIndustries) : defaultReflection.industries,
        roles: loadReflectionRoles ? JSON.parse(loadReflectionRoles) : defaultReflection.roles,
        intersections: loadReflectionIntersections ? JSON.parse(loadReflectionIntersections) : defaultReflection.intersections,
        storySections: loadReflectionStorySections ? JSON.parse(loadReflectionStorySections) : defaultReflection.storySections,
      };
      
      setReflection(newReflection);
    } catch (error) {
      console.error('Error loading reflection data:', error);
      setReflection(defaultReflection);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (!isInitialized) return;

    try {
      // Save the entire reflection object
      localStorage.setItem("reflection", JSON.stringify(reflection));
      
      // Also save individual sections for backward compatibility
      localStorage.setItem("strengths", JSON.stringify(reflection.strengths));
      localStorage.setItem("values", JSON.stringify(reflection.values));
      localStorage.setItem("industries", JSON.stringify(reflection.industries));
      localStorage.setItem("roles", JSON.stringify(reflection.roles));
      localStorage.setItem("intersections", JSON.stringify(reflection.intersections));
      localStorage.setItem("storySections", JSON.stringify(reflection.storySections));
    } catch (error) {
      console.error('Error saving reflection data:', error);
    }
  }, [reflection, isInitialized]);

  // Create the context value object
  const contextValue: ReflectionContextType = {
    reflection,
    setReflection,
    updateReflectionStrengths,
    updateReflectionValues,
    updateReflectionIndustries,
    updateReflectionRoles,
    updateReflectionIntersections,
    updateReflectionStorySections,
  };

  return <ReflectionContext.Provider value={contextValue}>{children}</ReflectionContext.Provider>;
};

// Custom hook to use the reflection context
export const useReflection = (): ReflectionContextType => {
  const context = useContext(ReflectionContext);
  if (context === undefined) {
    throw new Error("useReflection must be used within a ReflectionProvider");
  }
  return context;
};
