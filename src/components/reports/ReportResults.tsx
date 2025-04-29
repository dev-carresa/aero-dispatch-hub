
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Printer, Save } from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { BookingPagination } from "@/components/bookings/BookingPagination";
import { ReportType } from "@/types/report";

interface ReportResultsProps {
  results: any[];
  onSaveReport: (name: string) => void;
  columns: { key: string; label: string }[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalIncome: number | null;
  reportType: ReportType;
}

export function ReportResults({ 
  results, 
  onSaveReport, 
  columns, 
  totalItems, 
  currentPage, 
  totalPages, 
  onPageChange,
  totalIncome,
  reportType
}: ReportResultsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");

  const handleSaveReport = () => {
    if (reportName.trim()) {
      onSaveReport(reportName);
      setIsDialogOpen(false);
      setReportName("");
    }
  };

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    // In a real app, this would call an API to generate the export
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Report Results</CardTitle>
            <CardDescription>
              Found {totalItems} {reportType === "driver" ? "drivers" : 
                     reportType === "customer" ? "customers" : 
                     reportType === "fleet" ? "fleets" : "vehicles"} 
              matching your filters
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Report</DialogTitle>
                  <DialogDescription>
                    Give your report a name to save it for future reference.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      placeholder="e.g., Q1 Driver Performance"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveReport} disabled={!reportName.trim()}>
                    Save Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      {totalIncome !== null && (
        <div className="px-6 pb-2">
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Bookings</h4>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Total {reportType === "driver" ? "Driver" : reportType === "fleet" ? "Fleet" : "Vehicle"} Income
                </h4>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>{row[column.key]}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <BookingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
