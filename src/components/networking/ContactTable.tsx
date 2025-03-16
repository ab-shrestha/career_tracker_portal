import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, AlertCircle, ArrowUpDown, Search, FilterX } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogTrigger, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { getTablePreferences, saveTablePreferences } from "@/utils/tablePreferences";
import { statusOptions } from "./ContactForm";

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

interface ContactTableProps {
  contacts: NetworkContactData[];
  onEdit?: (contact: NetworkContactData) => void;
  onDelete?: (id: number) => void;
  onView?: (contact: NetworkContactData) => void;
  onStatusChange?: (contact: NetworkContactData, newStatus: string) => void;
  onLastContactChange?: (contact: NetworkContactData, newDate: string) => void;
}

type SortField = "name" | "company" | "position" | "lastContact" | "status";
type SortDirection = "asc" | "desc";

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  onLastContactChange,
}) => {
  const [search, setSearch] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("lastContact");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [contactToDelete, setContactToDelete] = React.useState<number | null>(null);
  const [editingDate, setEditingDate] = useState<{ id: number; date: string } | null>(null);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = getTablePreferences("contacts");
    if (savedPreferences) {
      setSortField(savedPreferences.sortField as SortField);
      setSortDirection(savedPreferences.sortDirection);
    }
  }, []);

  // Check if contact was last contacted more than 3 months ago
  const isFollowupNeeded = (lastContactDate: string) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(lastContactDate) < threeMonthsAgo;
  };

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "desc";
    setSortField(field);
    setSortDirection(newDirection);
    
    // Save preferences
    saveTablePreferences("contacts", {
      sortField: field,
      sortDirection: newDirection
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUpDown className="h-4 w-4 rotate-180" /> : <ArrowUpDown className="h-4 w-4" />;
  };

  const handleDeleteConfirm = () => {
    if (contactToDelete !== null && onDelete) {
      onDelete(contactToDelete);
      setContactToDelete(null);
    }
  };

  const filteredAndSortedContacts = contacts
    .filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.company.toLowerCase().includes(search.toLowerCase()) ||
        contact.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "company") {
        comparison = a.company.localeCompare(b.company);
      } else if (sortField === "position") {
        comparison = a.position.localeCompare(b.position);
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === "lastContact") {
        comparison = new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="w-full sm:w-60">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(search || statusFilter !== "all") && (
          <Button variant="outline" size="sm" onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}>
            <FilterX className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("company")}>
                  Company {getSortIcon("company")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("position")}>
                  Position {getSortIcon("position")}
                </Button>
              </TableHead>
              <TableHead>Email/Phone</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("lastContact")}>
                  Last Contact {getSortIcon("lastContact")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => handleSort("status")}>
                  Status {getSortIcon("status")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No contacts found. Add your first contact to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedContacts.map((contact) => (
                <TableRow key={contact.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onView?.(contact)}
                        className="hover:underline text-left font-medium flex-1"
                      >
                        {contact.name}
                      </button>
                      {(onEdit || onDelete) && (
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(contact)}
                              className="h-6 w-6 p-0 hover:bg-transparent"
                              title="Edit contact"
                            >
                              <Edit className="h-3 w-3 text-muted-foreground" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                          {onDelete && (
                            <AlertDialog open={contactToDelete === contact.id} onOpenChange={(open) => {
                              if (!open) setContactToDelete(null);
                            }}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setContactToDelete(contact.id)}
                                  className="h-6 w-6 p-0 hover:bg-transparent"
                                  title="Delete contact"
                                >
                                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {contact.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.position}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contact.email && <div className="text-sm">{contact.email}</div>}
                      {contact.phone && <div className="text-sm">{contact.phone}</div>}
                      {contact.linkedIn && (
                        <a 
                          href={contact.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          LinkedIn <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {editingDate?.id === contact.id ? (
                        <Input
                          type="date"
                          value={editingDate.date}
                          onChange={(e) => setEditingDate({ id: contact.id, date: e.target.value })}
                          onBlur={() => {
                            if (editingDate && onLastContactChange) {
                              onLastContactChange(contact, editingDate.date);
                            }
                            setEditingDate(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingDate && onLastContactChange) {
                                onLastContactChange(contact, editingDate.date);
                              }
                              setEditingDate(null);
                            }
                            if (e.key === 'Escape') {
                              setEditingDate(null);
                            }
                          }}
                          className="h-7 w-[140px]"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingDate({ id: contact.id, date: contact.lastContact })}
                          className="text-left hover:text-primary transition-colors"
                        >
                          {new Date(contact.lastContact + 'T00:00:00').toLocaleDateString()}
                          {isFollowupNeeded(contact.lastContact) && (
                            <div className="flex items-center text-amber-600 text-xs mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Time to follow up!
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={contact.status}
                      onValueChange={(value) => onStatusChange?.(contact, value)}
                    >
                      <SelectTrigger className="h-7 w-[120px] border-0 p-0 bg-transparent hover:bg-transparent">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          contact.status === "New" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : 
                          contact.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                          contact.status === "Follow-up" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                          "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}>
                          {contact.status}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactTable;
