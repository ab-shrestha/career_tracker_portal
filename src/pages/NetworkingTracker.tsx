import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import ContactForm from "@/components/networking/ContactForm";
import ContactDetails from "@/components/networking/ContactDetails";
import ContactTable from "@/components/networking/ContactTable";

const NetworkingTracker = () => {
  const { contacts, setContacts } = useData();
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);

  const handleSubmit = (contactData: any) => {
    if (editingContact) {
      const updatedContacts = contacts.map((contact) => 
        contact.id === editingContact.id 
          ? { ...contact, ...contactData }
          : contact
      );
      
      setContacts(updatedContacts);
      toast(`Contact ${contactData.name} updated successfully`);
      setEditingContact(null);
    } else {
      const contact = {
        id: contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
        ...contactData,
      };
      
      setContacts((prev) => [...prev, contact]);
      toast(`Contact ${contact.name} added successfully`);
    }
    
    setOpen(false);
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setOpen(true);
  };

  const handleViewDetails = (contact: any) => {
    setSelectedContact(contact);
    setDetailsOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    setContactToDelete(null);
    toast("Contact deleted successfully");
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setOpen(false);
  };

  const handleStatusChange = (contact: any, newStatus: string) => {
    const updatedContacts = contacts.map((c) => 
      c.id === contact.id 
        ? { ...c, status: newStatus }
        : c
    );
    
    setContacts(updatedContacts);
    toast(`Status updated to ${newStatus}`);
  };

  const handleLastContactChange = (contact: any, newDate: string) => {
    const updatedContacts = contacts.map((c) =>
      c.id === contact.id ? { ...c, lastContact: newDate } : c
    );
    setContacts(updatedContacts);
    toast("Last contact date updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Networking Tracker</h1>
        <p className="text-muted-foreground">
          Build and maintain your professional network by tracking contacts, follow-ups, and networking opportunities.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <ContactForm
              initialData={editingContact}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              isEditing={!!editingContact}
            />
          </DialogContent>
        </Dialog>

        {/* Contact Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-md">
            {selectedContact && (
              <ContactDetails
                contact={selectedContact}
                onEdit={() => {
                  setDetailsOpen(false);
                  handleEdit(selectedContact);
                }}
                onClose={() => setDetailsOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <ContactTable
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={setContactToDelete}
        onView={handleViewDetails}
        onStatusChange={handleStatusChange}
        onLastContactChange={handleLastContactChange}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={contactToDelete !== null} onOpenChange={(open) => 
        !open && setContactToDelete(null)
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              {contactToDelete !== null && contacts.find(c => c.id === contactToDelete) && (
                <>
                  Are you sure you want to delete {contacts.find(c => c.id === contactToDelete)?.name} from your contacts? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => contactToDelete !== null && handleDelete(contactToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NetworkingTracker;
