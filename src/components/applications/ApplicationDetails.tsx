import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface ApplicationDetailsProps {
  application: {
    id: number;
    company: string;
    position: string;
    date: string;
    status: string;
    link: string;
    notes?: string;
  };
  onEdit: () => void;
  onClose: () => void;
  targetCompany?: {
    score: number;
  } | undefined;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  onEdit,
  onClose,
  targetCompany,
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{application.position}</DialogTitle>
        <DialogDescription>
          {application.company}
          {targetCompany && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Target {targetCompany.score}
            </span>
          )}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date Applied</p>
            <p>{new Date(application.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              application.status === "Applied" ? "bg-blue-100 text-blue-800" : 
              application.status === "Screening" ? "bg-purple-100 text-purple-800" : 
              application.status === "Interview" ? "bg-yellow-100 text-yellow-800" : 
              application.status === "Offer" ? "bg-green-100 text-green-800" : 
              application.status === "Rejected" ? "bg-red-100 text-red-800" :
              application.status === "Learning" ? "bg-teal-100 text-teal-800" :
              application.status === "Declined" ? "bg-orange-100 text-orange-800" :
              application.status === "Accepted" ? "bg-emerald-100 text-emerald-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {application.status}
            </div>
          </div>
        </div>

        {application.link && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Job Posting</p>
            <a 
              href={application.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              View posting <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-muted-foreground">Notes</p>
          <p className="whitespace-pre-wrap">{application.notes || "No notes"}</p>
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

export default ApplicationDetails;
