
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Status options for contacts
export const statusOptions = ["New", "Active", "Follow-up", "Inactive"];

interface ContactFormProps {
  initialData?: {
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
  onSubmit: (contactData: {
    name: string;
    company: string;
    position: string;
    email: string;
    phone: string;
    linkedIn: string;
    status: string;
    notes: string;
    lastContact: string;
  }) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    company: initialData?.company || "",
    position: initialData?.position || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    linkedIn: initialData?.linkedIn || "",
    status: initialData?.status || "New",
    notes: initialData?.notes || "",
    lastContact: initialData?.lastContact || new Date().toISOString().split('T')[0],
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
        <DialogTitle>{isEditing ? "Edit Contact" : "Add New Contact"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update contact details" : "Track a new professional contact"}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastContact">Last Contact</Label>
            <Input
              id="lastContact"
              name="lastContact"
              type="date"
              value={formData.lastContact}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linkedIn">LinkedIn URL</Label>
          <Input
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
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
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any notes about this contact..."
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update" : "Save"} Contact</Button>
      </DialogFooter>
    </form>
  );
};

export default ContactForm;
