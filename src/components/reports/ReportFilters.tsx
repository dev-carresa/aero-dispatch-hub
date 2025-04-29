
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ReportFilter } from "@/types/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReportFiltersProps {
  filters: ReportFilter;
  onFiltersChange: (filters: ReportFilter) => void;
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export function ReportFilters({
  filters,
  onFiltersChange,
  onGenerateReport,
  isGenerating,
}: ReportFiltersProps) {
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);
  
  // Convert string dates to Date objects for the calendar component
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : undefined;
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : undefined;
  
  const bookingStatusOptions = [
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
    { id: "no-show", label: "No-show" },
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
  ];

  const handleBookingStatusChange = (statusId: string, checked: boolean) => {
    const currentStatuses = filters.bookingStatus || [];
    const newStatuses = checked
      ? [...currentStatuses, statusId]
      : currentStatuses.filter(id => id !== statusId);
    
    onFiltersChange({
      ...filters,
      bookingStatus: newStatuses
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
        <CardDescription>
          Select date range and data to include in your report
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dateFrom"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    onFiltersChange({
                      ...filters,
                      dateFrom: date ? format(date, "yyyy-MM-dd") : undefined
                    });
                    setDateFromOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dateTo"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    onFiltersChange({
                      ...filters,
                      dateTo: date ? format(date, "yyyy-MM-dd") : undefined
                    });
                    setDateToOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-base">Booking Status</Label>
            <div className="grid grid-cols-2 gap-3 mt-2 md:grid-cols-5">
              {bookingStatusOptions.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${status.id}`} 
                    checked={filters.bookingStatus?.includes(status.id)}
                    onCheckedChange={(checked) => 
                      handleBookingStatusChange(status.id, checked === true)
                    }
                  />
                  <label
                    htmlFor={`status-${status.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base">Data to Include</Label>
            <div className="grid grid-cols-2 gap-3 mt-2 md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-driver"
                  checked={filters.includeDriver}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      ...filters, 
                      includeDriver: checked === true
                    })
                  }
                />
                <label
                  htmlFor="include-driver"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Driver
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-fleet"
                  checked={filters.includeFleet}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      ...filters, 
                      includeFleet: checked === true
                    })
                  }
                />
                <label
                  htmlFor="include-fleet"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Fleet
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-customer"
                  checked={filters.includeCustomer}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      ...filters, 
                      includeCustomer: checked === true
                    })
                  }
                />
                <label
                  htmlFor="include-customer"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Customer
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-vehicle"
                  checked={filters.includeVehicle}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      ...filters, 
                      includeVehicle: checked === true
                    })
                  }
                />
                <label
                  htmlFor="include-vehicle"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Vehicle
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onGenerateReport} 
          disabled={isGenerating || !dateFrom || !dateTo}
          className="w-full md:w-auto"
        >
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  );
}
