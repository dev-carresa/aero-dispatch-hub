
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VehicleFiltersProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  fleetFilter: string;
  driverFilter: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilterChange: (value: string) => void;
  handleTypeFilterChange: (value: string) => void;
  handleFleetFilterChange: (value: string) => void;
  handleDriverFilterChange: (value: string) => void;
}

export function VehicleFilters({
  searchTerm,
  statusFilter,
  typeFilter,
  fleetFilter,
  driverFilter,
  handleSearchChange,
  handleStatusFilterChange,
  handleTypeFilterChange,
  handleFleetFilterChange,
  handleDriverFilterChange,
}: VehicleFiltersProps) {
  // Sample data for filters (in a real app, this would come from an API)
  const fleets = [
    { id: "1", name: "North Fleet" },
    { id: "2", name: "South Fleet" },
    { id: "3", name: "East Fleet" },
    { id: "4", name: "West Fleet" },
  ];

  const drivers = [
    { id: "1", name: "Michael Rodriguez" },
    { id: "2", name: "Sarah Thompson" },
    { id: "3", name: "David Brown" },
    { id: "4", name: "James Wilson" },
    { id: "5", name: "Emily Davis" },
  ];
  
  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by make, model, license plate, registration..."
          className="pl-9"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
        <Select value={fleetFilter} onValueChange={handleFleetFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Fleet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fleets</SelectItem>
            {fleets.map(fleet => (
              <SelectItem key={fleet.id} value={fleet.id}>{fleet.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={driverFilter} onValueChange={handleDriverFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Driver" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            {drivers.map(driver => (
              <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
