
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BookingPagination } from "@/components/bookings/BookingPagination";
import { SuccessNotification } from "@/components/invoices/SuccessNotification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Booking {
  id: string;
  fleet: string;
  customer: string;
  date: string;
  time: string;
  service: string;
  pickup: string;
  dropoff: string;
  price: number;
  status: string;
}

interface InvoicePreviewProps {
  bookings: Booking[] | null;
  dateFrom?: Date;
  dateTo?: Date;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalIncome: number;
}

export const InvoicePreview = ({ 
  bookings, 
  dateFrom, 
  dateTo,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  totalIncome
}: InvoicePreviewProps) => {
  const navigate = useNavigate();
  const [invoiceName, setInvoiceName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Tax calculation on total amount
  const taxAmount = totalIncome * 0.08; // 8% tax
  const grandTotal = totalIncome + taxAmount;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Save invoice
  const handleSaveInvoice = () => {
    if (!invoiceName.trim()) {
      toast.error("Please enter an invoice name");
      return;
    }
    
    // This would be an API call to save the invoice
    toast.success(`Invoice "${invoiceName}" saved successfully`);
    setSaveDialogOpen(false);
    setSuccessMessage(`Invoice "${invoiceName}" has been saved successfully with ${totalItems} bookings totaling ${formatCurrency(grandTotal)}`);

    // Navigate to invoices page after a brief delay
    setTimeout(() => {
      navigate("/invoices");
    }, 3000);
  };
  
  // Handle export
  const handleExport = (format: "pdf" | "csv" | "excel") => {
    // In a real app, this would call an API to generate the export
    toast.success(`Invoice exported as ${format.toUpperCase()}`);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (!bookings) return null;

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <h3 className="text-lg font-medium">No bookings found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters to find bookings
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoice Preview</CardTitle>
            <CardDescription>
              Found {totalItems} bookings matching your filters from {dateFrom ? format(dateFrom, "PPP") : ""} to {dateTo ? format(dateTo, "PPP") : ""}
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
            
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Invoice</DialogTitle>
                  <DialogDescription>
                    Enter a name for this invoice to save it to your invoices list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="invoice-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="invoice-name"
                      value={invoiceName}
                      onChange={(e) => setInvoiceName(e.target.value)}
                      className="col-span-3"
                      placeholder="Monthly Invoice - Fleet One"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveInvoice}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-2">
        <div className="bg-muted/50 p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Total Bookings</h4>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Total Invoice Amount</h4>
              <p className="text-2xl font-bold text-primary">{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Fleet</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.fleet}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{format(new Date(booking.date), "PP")} {booking.time}</TableCell>
                  <TableCell className="text-right">{formatCurrency(booking.price)}</TableCell>
                </TableRow>
              ))}
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
        
        <div className="mt-6 border-t pt-4 flex flex-col items-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({totalItems} bookings):</span>
              <span className="font-medium">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (8%):</span>
              <span className="font-medium">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-card">
        <div>
          <p className="text-sm text-muted-foreground">Generated on {format(new Date(), "PPP")}</p>
        </div>
      </CardFooter>
      
      {successMessage && (
        <div className="mt-4 px-6 pb-6">
          <SuccessAlert message={successMessage} />
        </div>
      )}
    </Card>
  );
};

// Simple success alert component
const SuccessAlert = ({ message }: { message: string }) => {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex gap-2 items-start">
      <div className="h-5 w-5 text-green-500 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="font-medium">Success</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
