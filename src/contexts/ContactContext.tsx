import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our network contact data
interface NetworkContactData {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  linkedIn: string;
  status: string;
  notes: string;
  lastContact: string;
}

interface ContactContextType {
  contacts: NetworkContactData[];
  setContacts: React.Dispatch<React.SetStateAction<NetworkContactData[]>>;
  getContactsNeedingFollowup: () => NetworkContactData[];
}

const defaultContacts: NetworkContactData[] = [
  {
    id: 1,
    name: "John Smith",
    company: "Google",
    position: "Engineering Manager",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    linkedIn: "https://linkedin.com/in/johnsmith",
    status: "Active",
    notes: "Met at the tech conference. Interested in discussing frontend opportunities.",
    lastContact: "2023-04-15",
  },
  {
    id: 2, 
    name: "Jane Doe",
    company: "Microsoft",
    position: "Product Manager",
    email: "jane.doe@example.com",
    phone: "555-987-6543",
    linkedIn: "https://linkedin.com/in/janedoe",
    status: "Follow-up",
    notes: "Referred by a mutual connection. Sent resume, awaiting feedback.",
    lastContact: "2023-04-20",
  }
];

// Create the context
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Create a provider component
export const ContactProvider: React.FC<{ 
  children: React.ReactNode;
  getTargetCompanies?: () => { name: string }[];
  userId?: string | null;
}> = ({ children, getTargetCompanies = () => [] }) => {
  // Initialize state for contacts
  const [contacts, setContacts] = useState<NetworkContactData[]>([]);

  // Get contacts needing follow-up
  const getContactsNeedingFollowup = () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const targetCompanies = getTargetCompanies();
    
    return contacts.filter(contact => {
      const lastContactDate = new Date(contact.lastContact);
      const isOverdue = lastContactDate < threeMonthsAgo;
      const isAtTargetCompany = targetCompanies.some(company => 
        company.name.toLowerCase() === contact.company.toLowerCase()
      );
      
      return isOverdue || isAtTargetCompany;
    });
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadContacts = localStorage.getItem("contacts");

    // Set contacts data
    if (loadContacts) {
      setContacts(JSON.parse(loadContacts));
    } else {
      setContacts(defaultContacts);
      localStorage.setItem("contacts", JSON.stringify(defaultContacts));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  // Create the context value object
  const contextValue: ContactContextType = {
    contacts,
    setContacts,
    getContactsNeedingFollowup,
  };

  return <ContactContext.Provider value={contextValue}>{children}</ContactContext.Provider>;
};

// Custom hook to use the contact context
export const useContacts = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactProvider");
  }
  return context;
};
