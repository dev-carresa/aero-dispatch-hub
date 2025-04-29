
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ReportFilter, ReportType } from "@/types/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

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

  const handleReportTypeChange = (type: ReportType) => {
    onFiltersChange({
      ...filters,
      reportType: type
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
          Select date range and report type
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
            <Label className="text-base">Report Type</Label>
            <Tabs 
              value={filters.reportType} 
              onValueChange={(value) => handleReportTypeChange(value as ReportType)}
              className="mt-2"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="driver">Driver</TabsTrigger>
                <TabsTrigger value="fleet">Fleet</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              </TabsList>
            </Tabs>
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
