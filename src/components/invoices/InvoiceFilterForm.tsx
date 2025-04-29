
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "@/components/reports/filter-components/DateRangeSelector";
import { BookingStatusSelector } from "@/components/reports/filter-components/BookingStatusSelector";
import { Filter } from "lucide-react";

interface InvoiceFilterFormProps {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  selectedStatuses: string[];
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onStatusChange: (statusId: string, checked: boolean) => void;
  onGenerateInvoice: () => void;
  isGenerating: boolean;
}

export const InvoiceFilterForm = ({
  dateFrom,
  dateTo,
  selectedStatuses,
  onDateFromChange,
  onDateToChange,
  onStatusChange,
  onGenerateInvoice,
  isGenerating
}: InvoiceFilterFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Invoice Filters
        </CardTitle>
        <CardDescription>
          Select date range and booking statuses to include
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateRangeSelector
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={onDateFromChange}
          onDateToChange={onDateToChange}
        />

        <BookingStatusSelector
          selectedStatuses={selectedStatuses}
          onStatusChange={onStatusChange}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onGenerateInvoice} 
          disabled={isGenerating || !dateFrom || !dateTo}
          className="w-full md:w-auto"
        >
          {isGenerating ? "Generating..." : "Generate Invoice"}
        </Button>
      </CardFooter>
    </Card>
  );
};
