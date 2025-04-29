
import { format } from "date-fns";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportFilter, ReportType } from "@/types/report";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DateRangeSelector } from "./filter-components/DateRangeSelector";
import { BookingStatusSelector } from "./filter-components/BookingStatusSelector";
import { ReportTypeSelector } from "./filter-components/ReportTypeSelector";

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
  // Convert string dates to Date objects for the calendar component
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : undefined;
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : undefined;
  
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

  const handleDateFromChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: date ? format(date, "yyyy-MM-dd") : undefined
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateTo: date ? format(date, "yyyy-MM-dd") : undefined
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
        <DateRangeSelector
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={handleDateFromChange}
          onDateToChange={handleDateToChange}
        />

        <BookingStatusSelector
          selectedStatuses={filters.bookingStatus}
          onStatusChange={handleBookingStatusChange}
        />

        <ReportTypeSelector
          selectedType={filters.reportType}
          onTypeChange={handleReportTypeChange}
        />
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
