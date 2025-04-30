
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ApiUsersFiltersProps {
  searchTerm: string;
  statusFilter: string;
  serviceTypeFilter: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilterChange: (value: string) => void;
  handleServiceTypeFilterChange: (value: string) => void;
}

export function ApiUsersFilters({
  searchTerm,
  statusFilter,
  serviceTypeFilter,
  handleSearchChange,
  handleStatusFilterChange,
  handleServiceTypeFilterChange,
}: ApiUsersFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email or company..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={serviceTypeFilter} onValueChange={handleServiceTypeFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="api_access">API Access</SelectItem>
            <SelectItem value="white_label">White Label</SelectItem>
            <SelectItem value="both">Both Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
