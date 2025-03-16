import { useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp, Edit, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Company } from "@/types/Company";
import { getTablePreferences, saveTablePreferences } from "@/utils/tablePreferences";

interface CompanyTableProps {
  companies: Company[];
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
}

type SortField = "name" | "affinity" | "motivation" | "posting" | "strengths" | "values" | "score" | "id";
type SortDirection = "asc" | "desc";

const affinityLabels: Record<string, string> = {
  "Y": "I know someone here",
  "N": "No connection"
};

const motivationLabels: Record<number, string> = {
  0: "Never heard of them",
  1: "Don't want to work here",
  2: "Would work here",
  3: "Love to work here",
  4: "Dream job"
};

const postingLabels: Record<number, string> = {
  0: "No positions open",
  1: "Posting for related job",
  2: "Desired job posting"
};

const alignmentLabels: Record<number, string> = {
  0: "Bad alignment",
  1: "No alignment",
  2: "Some alignment",
  3: "Good alignment",
  4: "Great alignment"
};

export default function CompanyTable({ companies, onEdit, onDelete }: CompanyTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [affinityFilter, setAffinityFilter] = useState<"all" | "Y" | "N">("all");
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = getTablePreferences("companies");
    if (savedPreferences) {
      setSortField(savedPreferences.sortField as SortField);
      setSortDirection(savedPreferences.sortDirection);
    }
  }, []);

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    // Save preferences
    saveTablePreferences("companies", {
      sortField: field,
      sortDirection: newDirection
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleDeleteConfirm = () => {
    if (companyToDelete && onDelete) {
      onDelete(companyToDelete);
      setCompanyToDelete(null);
    }
  };

  const filteredCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
      const matchesAffinity = affinityFilter === "all" || company.affinity === affinityFilter;
      return matchesSearch && matchesAffinity;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "affinity") {
        comparison = a.affinity.localeCompare(b.affinity);
      } else if (sortField === "id") {
        // For id, we'll sort by the numeric value
        comparison = Number(a.id) - Number(b.id);
      } else {
        comparison = (a[sortField] as number) - (b[sortField] as number);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-60">
          <Select 
            value={affinityFilter} 
            onValueChange={(value) => setAffinityFilter(value as "all" | "Y" | "N")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by affinity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Affinities</SelectItem>
              <SelectItem value="Y">With Connection</SelectItem>
              <SelectItem value="N">No Connection</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Company</TableHead>
              <TableHead className="w-[160px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("affinity")}
                  className="flex items-center gap-1 font-medium justify-start h-8 px-0 hover:bg-transparent"
                >
                  Affinity
                  {getSortIcon("affinity")}
                </Button>
              </TableHead>
              <TableHead className="w-[160px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("motivation")}
                  className="flex items-center gap-1 font-medium justify-start h-8 px-0 hover:bg-transparent"
                >
                  Motivation
                  {getSortIcon("motivation")}
                </Button>
              </TableHead>
              <TableHead className="w-[160px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("posting")}
                  className="flex items-center gap-1 font-medium justify-start h-8 px-0 hover:bg-transparent"
                >
                  Posting
                  {getSortIcon("posting")}
                </Button>
              </TableHead>
              <TableHead className="w-[160px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("strengths")}
                  className="flex items-center gap-1 font-medium justify-start h-8 px-0 hover:bg-transparent"
                >
                  Strengths
                  {getSortIcon("strengths")}
                </Button>
              </TableHead>
              <TableHead className="w-[160px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("values")}
                  className="flex items-center gap-1 font-medium justify-start h-8 px-0 hover:bg-transparent"
                >
                  Values
                  {getSortIcon("values")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("score")}
                    className="flex items-center gap-1 font-medium justify-start h-8 px-0 hover:bg-transparent"
                  >
                    Score
                    {getSortIcon("score")}
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] p-4">
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
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id} className="group">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{affinityLabels[company.affinity]}</TableCell>
                  <TableCell>{motivationLabels[company.motivation]}</TableCell>
                  <TableCell>{postingLabels[company.posting]}</TableCell>
                  <TableCell>{alignmentLabels[company.strengths]}</TableCell>
                  <TableCell>{alignmentLabels[company.values]}</TableCell>
                  <TableCell className="font-semibold">
                    {Math.round((company.score / 18) * 100)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(company)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setCompanyToDelete(company.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Company</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {company.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCompanyToDelete(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
