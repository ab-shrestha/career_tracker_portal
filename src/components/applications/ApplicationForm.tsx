import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Status options for applications
export const statusOptions = ["Learning", "Draft", "Applied", "Screening", "Interview", "Rejected", "Offer", "Declined", "Accepted"];

interface ApplicationFormProps {
  initialData?: {
    company: string;
    position: string;
    date: string;
    status: string;
    link: string;
    notes?: string;
  };
  onSubmit: (applicationData: {
    company: string;
    position: string;
    date: string;
    status: string;
    link: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  const [formData, setFormData] = useState({
    company: initialData?.company || "",
    position: initialData?.position || "",
    date: initialData?.date || new Date().toISOString().split('T')[0],
    status: initialData?.status || "Applied",
    link: initialData?.link || "",
    notes: initialData?.notes || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Application" : "Add New Application"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update application details" : "Track a new job application you've submitted"}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Application Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="link">Job Posting URL</Label>
          <Input
            id="link"
            name="link"
            type="url"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="https://example.com/job"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any notes about this application..."
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update" : "Save"} Application</Button>
      </DialogFooter>
    </form>
  );
};

export default ApplicationForm;
