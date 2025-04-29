
import { useState } from "react";
import { Search, CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface QualityReviewsFiltersProps {
  onFilterChange: (filters: any) => void;
  fleets: { id: number; name: string }[];
  drivers: { id: number; name: string }[];
}

export const QualityReviewsFilters = ({
  onFilterChange,
  fleets,
  drivers,
}: QualityReviewsFiltersProps) => {
  const [bookingRef, setBookingRef] = useState("");
  const [fleetId, setFleetId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [scoreType, setScoreType] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    applyFilters();
  };

  const applyFilters = () => {
    onFilterChange({
      bookingRef,
      fleetId: fleetId ? parseInt(fleetId) : undefined,
      driverId: driverId ? parseInt(driverId) : undefined,
      scoreType,
      dateRange,
    });
  };

  const resetFilters = () => {
    setBookingRef("");
    setFleetId("");
    setDriverId("");
    setScoreType("");
    setDateRange(undefined);
    onFilterChange({});
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Booking Reference</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search booking..."
              className="pl-9"
              value={bookingRef}
              onChange={(e) => {
                setBookingRef(e.target.value);
                applyFilters();
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fleet</label>
          <Select
            value={fleetId}
            onValueChange={(value) => {
              setFleetId(value);
              applyFilters();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Fleets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Fleets</SelectItem>
              {fleets.map((fleet) => (
                <SelectItem key={fleet.id} value={fleet.id.toString()}>
                  {fleet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Driver</label>
          <Select
            value={driverId}
            onValueChange={(value) => {
              setDriverId(value);
              applyFilters();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Drivers</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id.toString()}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Review Score</label>
          <Select
            value={scoreType}
            onValueChange={(value) => {
              setScoreType(value);
              applyFilters();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Reviews</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Review Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="gap-1"
        >
          <X className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
