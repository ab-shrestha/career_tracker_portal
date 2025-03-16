import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import ApplicationForm from "@/components/applications/ApplicationForm";
import ApplicationDetails from "@/components/applications/ApplicationDetails";
import ApplicationTable from "@/components/applications/ApplicationTable";
import ApplicationSearch from "@/components/applications/ApplicationSearch";
import { getTablePreferences, saveTablePreferences } from "@/utils/tablePreferences";

const Applications = () => {
  const { applications, setApplications, getTargetCompanyByName } = useData();
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [editingApplication, setEditingApplication] = useState<any | null>(null);
  const [applicationToDelete, setApplicationToDelete] = useState<number | null>(null);
  
  // Sorting and filtering state
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = getTablePreferences("applications");
    if (savedPreferences) {
      setSortField(savedPreferences.sortField);
      setSortDirection(savedPreferences.sortDirection);
    }
  }, []);

  const handleSubmit = (applicationData: any) => {
    if (editingApplication) {
      // Update existing application
      const updatedApplications = applications.map((app) => 
        app.id === editingApplication.id 
          ? { ...app, ...applicationData }
          : app
      );
      
      setApplications(updatedApplications);
      toast(`Application for ${applicationData.position} at ${applicationData.company} updated`);
      setEditingApplication(null);
    } else {
      // Add new application
      const application = {
        id: applications.length ? Math.max(...applications.map(a => a.id)) + 1 : 1,
        ...applicationData,
      };
      
      setApplications((prev) => [...prev, application]);
      toast(`Application for ${application.position} at ${application.company} added`);
    }
    
    setOpen(false);
  };

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  const handleEdit = (application: any) => {
    setEditingApplication(application);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedApplications = applications.filter((app) => app.id !== id);
    setApplications(updatedApplications);
    setApplicationToDelete(null);
    toast("Application deleted successfully");
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    const newDirection = sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "desc";
    setSortField(field);
    setSortDirection(newDirection);
    
    // Save preferences
    saveTablePreferences("applications", {
      sortField: field,
      sortDirection: newDirection
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterStatus("all");
    setSearchQuery("");
  };

  // Filtered and sorted applications
  const filteredAndSortedApplications = useMemo(() => {
    // First filter the applications
    let filtered = applications;
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(query) ||
        app.position.toLowerCase().includes(query)
      );
    }
    
    // Then sort the filtered applications
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "company") {
        comparison = a.company.localeCompare(b.company);
      } else if (sortField === "position") {
        comparison = a.position.localeCompare(b.position);
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [applications, filterStatus, searchQuery, sortField, sortDirection]);

  const handleCancelEdit = () => {
    setEditingApplication(null);
    setOpen(false);
  };

  const handleStatusChange = (application: any, newStatus: string) => {
    const updatedApplications = applications.map((app) => 
      app.id === application.id 
        ? { ...app, status: newStatus }
        : app
    );
    
    setApplications(updatedApplications);
    toast(`Status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications through every stage of the process, from initial submission to final offer.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ApplicationForm 
              initialData={editingApplication}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              isEditing={!!editingApplication}
            />
          </DialogContent>
        </Dialog>

        {/* Application Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-md">
            {selectedApplication && (
              <ApplicationDetails
                application={selectedApplication}
                onEdit={() => {
                  setDetailsOpen(false);
                  handleEdit(selectedApplication);
                }}
                onClose={() => setDetailsOpen(false)}
                targetCompany={getTargetCompanyByName(selectedApplication.company)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and sort controls */}
      <ApplicationSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        showResetButton={filterStatus !== "all" || searchQuery !== ""}
        onResetFilters={handleResetFilters}
      />

      <ApplicationTable
        applications={filteredAndSortedApplications}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={setApplicationToDelete}
        onView={handleViewDetails}
        onStatusChange={handleStatusChange}
        getTargetCompanyByName={getTargetCompanyByName}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={applicationToDelete !== null} onOpenChange={(open) => 
        !open && setApplicationToDelete(null)
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              {applicationToDelete !== null && applications.find(a => a.id === applicationToDelete) && (
                <>
                  Are you sure you want to delete the application for {applications.find(a => a.id === applicationToDelete)?.position} at {applications.find(a => a.id === applicationToDelete)?.company}? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => applicationToDelete !== null && handleDelete(applicationToDelete)}
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

export default Applications;
