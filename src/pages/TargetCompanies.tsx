import { useState } from "react";
import { toast } from "sonner";
import CompanyForm from "@/components/CompanyForm";
import CompanyTable from "@/components/CompanyTable";
import { Company } from "@/types/Company";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TargetCompanies = () => {
  const { companies, setCompanies } = useData();
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [open, setOpen] = useState(false);

  // Calculate score including affinity bonus
  const calculateScore = (company: Omit<Company, "id" | "score">) => {
    const baseScore = company.motivation + company.posting + company.strengths + company.values;
    return company.affinity === "Y" ? baseScore + 4 : baseScore;
  };

  const handleAddCompany = (newCompany: Omit<Company, "id" | "score">) => {
    try {
      const score = calculateScore(newCompany);
      const companyWithId = {
        ...newCompany,
        id: Date.now().toString(),
        score
      };
      
      const updatedCompanies = [...companies, companyWithId];
      setCompanies(updatedCompanies);
      toast.success(`${newCompany.name} added to your target companies`);
      handleCancel();
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company");
    }
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    try {
      const score = calculateScore(updatedCompany);
      const companyWithUpdatedScore = { ...updatedCompany, score };
      
      const updatedCompanies = companies.map(company => 
        company.id === updatedCompany.id ? companyWithUpdatedScore : company
      );
      
      setCompanies(updatedCompanies);
      toast.success(`${updatedCompany.name} has been updated`);
      handleCancel();
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    }
  };

  const handleDeleteCompany = (id: string) => {
    const companyToDelete = companies.find(company => company.id === id);
    if (!companyToDelete) return;
    
    const updatedCompanies = companies.filter(company => company.id !== id);
    setCompanies(updatedCompanies);
    toast.success(`${companyToDelete.name} has been removed`);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setOpen(true);
  };

  const handleCancel = () => {
    setEditingCompany(null);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Target Companies</h1>
        <p className="text-muted-foreground">
          Create a LAMPSV list of your target companies. Prioritize companies based on criteria like affinity, motivation, posting availability, alignment with strengths, and values fit.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCompany(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
              <DialogDescription>
                {editingCompany 
                  ? `Update the details for ${editingCompany.name}`
                  : "Fill in the company details below to add it to your target list."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CompanyForm
                onSubmit={handleAddCompany}
                onUpdate={handleUpdateCompany}
                onCancel={handleCancel}
                editingCompany={editingCompany}
              />
            </div>
          </DialogContent>
        </Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground italic cursor-help flex items-center gap-1">
                How the Score is Calculated
                <Info className="h-3 w-3" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[300px] p-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold border-b pb-2">How the Score is Calculated:</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Affinity:</span></p>
                  <p className="pl-4">4 = I know someone here</p>
                  <p className="pl-4">0 = No connection</p>
                </div>
                <div className="space-y-1">
                  <p><span className="font-medium">Motivation, Strengths and Values:</span></p>
                  <p className="pl-4">Score ranges from 0-4 depending on your inputs.</p>
                </div>
                <div className="space-y-1">
                  <p><span className="font-medium">Posting:</span></p>
                  <p className="pl-4">2 = Desired job posting</p>
                  <p className="pl-4">1 = Posting for related job</p>
                  <p className="pl-4">0 = No posting</p>
                </div>
                <p className="pt-2">Total score is calculated out of a maximum of 18 and converted into a percentage.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CompanyTable
        companies={companies}
        onEdit={handleEdit}
        onDelete={handleDeleteCompany}
      />
    </div>
  );
};

export default TargetCompanies;
