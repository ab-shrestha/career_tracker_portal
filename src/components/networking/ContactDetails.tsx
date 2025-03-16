import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExternalLink, AlertCircle } from "lucide-react";

interface ContactDetailsProps {
  contact: {
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
  };
  onEdit: () => void;
  onClose: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  contact,
  onEdit,
  onClose,
}) => {
  // Check if contact was last contacted more than 3 months ago
  const isFollowupNeeded = (lastContactDate: string) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(lastContactDate) < threeMonthsAgo;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{contact.name}</DialogTitle>
        <DialogDescription>
          {contact.position} at {contact.company}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{contact.email || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{contact.phone || "Not provided"}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
            <p>
              {new Date(contact.lastContact + 'T00:00:00').toLocaleDateString()}
              {isFollowupNeeded(contact.lastContact) && (
                <span className="flex items-center text-amber-600 text-sm mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Time to follow up!
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              contact.status === "New" ? "bg-blue-100 text-blue-800" : 
              contact.status === "Active" ? "bg-green-100 text-green-800" : 
              contact.status === "Follow-up" ? "bg-yellow-100 text-yellow-800" : 
              "bg-gray-100 text-gray-800"
            }`}>
              {contact.status}
            </div>
          </div>
        </div>

        {contact.linkedIn && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
            <a 
              href={contact.linkedIn} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              {contact.linkedIn} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-muted-foreground">Notes</p>
          <p className="whitespace-pre-wrap">{contact.notes || "No notes"}</p>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
};

export default ContactDetails;
