import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusOptions } from "./ApplicationForm";

interface ApplicationData {
  id: number;
  company: string;
  position: string;
  date: string;
  status: string;
  link: string;
  notes?: string;
}

interface ApplicationTableProps {
  applications: ApplicationData[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (application: ApplicationData) => void;
  onDelete: (id: number) => void;
  onView: (application: ApplicationData) => void;
  onStatusChange?: (application: ApplicationData, newStatus: string) => void;
  getTargetCompanyByName: (name: string) => { score: number } | undefined;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  getTargetCompanyByName,
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => onSort("company")}>
                Company {sortField === "company" ? (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                ) : (
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => onSort("position")}>
                Position {sortField === "position" ? (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                ) : (
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => onSort("date")}>
                Date Applied {sortField === "date" ? (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                ) : (
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 h-auto font-medium" onClick={() => onSort("status")}>
                Status {sortField === "status" ? (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                ) : (
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="group">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onView(application)}
                    className="hover:underline text-left font-medium flex-1"
                  >
                    {application.company}
                  </button>
                  <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(application);
                      }}
                      className="h-6 w-6 p-0 hover:bg-transparent"
                      title="Edit application"
                    >
                      <Edit className="h-3 w-3 text-muted-foreground" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(application.id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-transparent"
                      title="Delete application"
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                {getTargetCompanyByName(application.company) && (
                  <div className="text-xs text-blue-600 mt-1">
                    Target {getTargetCompanyByName(application.company)?.score}
                  </div>
                )}
              </TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>{new Date(application.date + 'T00:00:00').toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    value={application.status}
                    onValueChange={(value) => onStatusChange?.(application, value)}
                  >
                    <SelectTrigger className="h-7 w-[120px] border-0 p-0 bg-transparent hover:bg-transparent">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        application.status === "Applied" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : 
                        application.status === "Screening" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : 
                        application.status === "Interview" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : 
                        application.status === "Offer" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                        application.status === "Rejected" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                        application.status === "Learning" ? "bg-teal-100 text-teal-800 hover:bg-teal-200" :
                        application.status === "Declined" ? "bg-orange-100 text-orange-800 hover:bg-orange-200" :
                        application.status === "Accepted" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" :
                        "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}>
                        {application.status}
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
                  {application.status === "Interview" && (
                    <div className="text-xs text-muted-foreground">
                      TY Note!
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {application.link && (
                  <a 
                    href={application.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationTable;
