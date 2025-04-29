
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, Search, RefreshCcw } from "lucide-react";
import { ComplaintStatus } from "@/types/complaint";

interface ComplaintsFiltersProps {
  onFilter: (filters: any) => void;
}

export const ComplaintsFilters = ({ onFilter }: ComplaintsFiltersProps) => {
  const [bookingReference, setBookingReference] = useState("");
  const [fleetId, setFleetId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<ComplaintStatus | undefined>(undefined);
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);

  const handleFilter = () => {
    onFilter({
      bookingReference: bookingReference || undefined,
      fleetId,
      status,
      dateRange
    });
  };

  const handleReset = () => {
    setBookingReference("");
    setFleetId(undefined);
    setStatus(undefined);
    setDateRange(undefined);
    onFilter({});
  };

  return (
    <div className="bg-muted/40 p-4 rounded-md space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid gap-2 flex-1">
          <label className="text-sm font-medium">Booking Reference</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by booking reference..." 
              className="pl-9 bg-white"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Fleet</label>
          <Select value={fleetId} onValueChange={setFleetId}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select fleet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Premium Fleet Services</SelectItem>
              <SelectItem value="2">City Cab Co.</SelectItem>
              <SelectItem value="3">Express Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={(value) => setStatus(value as ComplaintStatus)}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Date Range</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleFilter} className="gap-2">
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
