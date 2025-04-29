
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
  vehicleTypeFilter?: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleFilterChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleVehicleTypeFilterChange?: (value: string) => void;
}

export const UserFilters = ({
  searchTerm,
  roleFilter,
  statusFilter,
  vehicleTypeFilter = "all",
  handleSearchChange,
  handleRoleFilterChange,
  handleStatusFilterChange,
  handleVehicleTypeFilterChange = () => {},
}: UserFiltersProps) => {
  const isDriverView = roleFilter === "Driver" || roleFilter === "all";

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
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Driver">Driver</SelectItem>
            <SelectItem value="Dispatcher">Dispatcher</SelectItem>
            <SelectItem value="Fleet">Fleet</SelectItem>
            <SelectItem value="Customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isDriverView ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Vehicle Type</label>
          <Select value={vehicleTypeFilter} onValueChange={handleVehicleTypeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
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
      )}
    </div>
  );
};
