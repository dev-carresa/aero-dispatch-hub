
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

interface DriverCommentsFiltersProps {
  onFilter: (filters: any) => void;
}

export const DriverCommentsFilters = ({ onFilter }: DriverCommentsFiltersProps) => {
  const [driverName, setDriverName] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);

  const handleFilter = () => {
    onFilter({
      driverName: driverName || undefined,
      bookingReference: bookingReference || undefined,
      status,
      dateRange
    });
  };

  const handleReset = () => {
    setDriverName("");
    setBookingReference("");
    setStatus(undefined);
    setDateRange(undefined);
    onFilter({});
  };

  return (
    <div className="bg-muted/40 p-4 rounded-md space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="grid gap-2 flex-1">
          <label className="text-sm font-medium">Driver Name</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by driver..." 
              className="pl-9 bg-white"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2 flex-1">
          <label className="text-sm font-medium">Booking Reference</label>
          <Input 
            placeholder="Enter booking reference..." 
            className="bg-white"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
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
