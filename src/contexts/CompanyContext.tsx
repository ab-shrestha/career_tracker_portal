import React, { createContext, useContext, useState, useEffect } from "react";
import { Company } from "@/types/Company";

interface CompanyContextType {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  getTargetCompanyByName: (name: string) => Company | undefined;
}

const defaultCompanies: Company[] = [
  {
    id: "1",
    name: "McKinsey",
    affinity: "Y",
    motivation: 4,
    posting: 2,
    strengths: 4,
    values: 4,
    score: 18
  },
  {
    id: "2",
    name: "Bain",
    affinity: "N",
    motivation: 4,
    posting: 2,
    strengths: 3,
    values: 2,
    score: 11
  },
  {
    id: "3",
    name: "BCG",
    affinity: "Y",
    motivation: 2,
    posting: 0,
    strengths: 3,
    values: 2,
    score: 11
  }
];

// Create the context
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Create a provider component
export const CompanyProvider: React.FC<{ 
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children }) => {
  // Initialize state for companies
  const [companies, setCompanies] = useState<Company[]>([]);

  // Get target company by name
  const getTargetCompanyByName = (name: string) => {
    return companies.find(company => company.name.toLowerCase() === name.toLowerCase());
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadCompanies = localStorage.getItem("target-companies");

    // Set companies data
    if (loadCompanies) {
      setCompanies(JSON.parse(loadCompanies));
    } else {
      setCompanies(defaultCompanies);
      localStorage.setItem("target-companies", JSON.stringify(defaultCompanies));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem("target-companies", JSON.stringify(companies));
    }
  }, [companies]);

  // Create the context value object
  const contextValue: CompanyContextType = {
    companies,
    setCompanies,
    getTargetCompanyByName,
  };

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>;
};

// Custom hook to use the company context
export const useCompanies = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanies must be used within a CompanyProvider");
  }
  return context;
};
