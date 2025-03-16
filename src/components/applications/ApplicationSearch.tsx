
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX } from "lucide-react";
import { statusOptions } from "./ApplicationForm";

interface ApplicationSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
  showResetButton: boolean;
  onResetFilters: () => void;
}

const ApplicationSearch: React.FC<ApplicationSearchProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  showResetButton,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Input
          placeholder="Search companies or positions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      
      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showResetButton && (
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          <FilterX className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default ApplicationSearch;
