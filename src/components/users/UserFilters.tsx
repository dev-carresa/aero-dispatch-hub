
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleFilterChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
}

export const UserFilters = ({
  searchTerm,
  roleFilter,
  statusFilter,
  handleSearchChange,
  handleRoleFilterChange,
  handleStatusFilterChange,
}: UserFiltersProps) => {
  return (
    <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Users</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="dispatcher">Dispatcher</SelectItem>
            <SelectItem value="fleet">Fleet</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
