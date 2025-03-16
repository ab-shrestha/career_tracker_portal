import React from "react";
import { ApplicationProvider, useApplications } from "./ApplicationContext";
import { TaskProvider, useTasks } from "./TaskContext";
import { CompanyProvider, useCompanies } from "./CompanyContext";
import { ContactProvider, useContacts } from "./ContactContext";
import { ReflectionProvider, useReflection } from "./ReflectionContext";
import { CategoryProvider, useCategories } from "./CategoryContext";
import { useAuth } from "./AuthContext";

// Create a wrapper provider that combines all the individual context providers
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <ApplicationProvider userId={user?.id}>
      <TaskProvider userId={user?.id}>
        <CompanyProvider userId={user?.id}>
          <ReflectionProvider userId={user?.id}>
            <CategoryProvider userId={user?.id}>
              <ContactProviderWithCompanies>
                {children}
              </ContactProviderWithCompanies>
            </CategoryProvider>
          </ReflectionProvider>
        </CompanyProvider>
      </TaskProvider>
    </ApplicationProvider>
  );
};

// Special wrapper to provide company data to the contacts provider
const ContactProviderWithCompanies: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { companies } = useCompanies();
  const { user } = useAuth();
  
  return (
    <ContactProvider 
      getTargetCompanies={() => companies}
      userId={user?.id}
    >
      {children}
    </ContactProvider>
  );
};

// Create a unified hook to use data from all contexts
export const useData = () => {
  const applicationContext = useApplications();
  const taskContext = useTasks();
  const companyContext = useCompanies();
  const contactContext = useContacts();
  const reflectionContext = useReflection();
  const categoryContext = useCategories();

  return {
    ...applicationContext,
    ...taskContext,
    ...companyContext,
    ...contactContext,
    ...reflectionContext,
    ...categoryContext
  };
};
