
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "@/components/reports/filter-components/DateRangeSelector";
import { BookingStatusSelector } from "@/components/reports/filter-components/BookingStatusSelector";
import { Check, Filter, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Extended mock booking data with more details for better demonstration
const mockBookings = [
  { 
    id: "B001", 
    fleet: "Fleet One", 
    customer: "John Smith", 
    date: "2025-01-15", 
    time: "09:30 AM",
    service: "Airport Transfer",
    pickup: "JFK Airport",
    dropoff: "Manhattan Hotel",
    price: 120.00, 
    status: "completed" 
  },
  { 
    id: "B002", 
    fleet: "Fleet One", 
    customer: "Alice Johnson", 
    date: "2025-01-16", 
    time: "14:00 PM",
    service: "City Tour",
    pickup: "Times Square",
    dropoff: "Central Park",
    price: 85.50, 
    status: "completed" 
  },
  { 
    id: "B003", 
    fleet: "Fleet Two", 
    customer: "Robert Brown", 
    date: "2025-01-18", 
    time: "10:15 AM",
    service: "Point to Point",
    pickup: "Brooklyn",
    dropoff: "Queens",
    price: 200.75, 
    status: "completed" 
  },
  { 
    id: "B004", 
    fleet: "Fleet One", 
    customer: "Mary Davis", 
    date: "2025-01-22", 
    time: "16:45 PM",
    service: "Corporate Transport",
    pickup: "Wall Street",
    dropoff: "Midtown Office",
    price: 150.25, 
    status: "completed" 
  },
  { 
    id: "B005", 
    fleet: "Fleet Three", 
    customer: "David Wilson", 
    date: "2025-01-25", 
    time: "08:00 AM",
    service: "Airport Transfer",
    pickup: "Newark Airport",
    dropoff: "Jersey City Hotel",
    price: 95.00, 
    status: "completed" 
  }
];

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(2025, 0, 15)); // Pre-set dates for demo
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date(2025, 0, 25));
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["completed"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookings, setBookings] = useState<any[] | null>(null);
  const [invoiceName, setInvoiceName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle booking status selection
  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, statusId]);
    } else {
      setSelectedStatuses(prev => prev.filter(id => id !== statusId));
    }
  };

  // Generate invoice
  const handleGenerateInvoice = () => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select date range");
      return;
    }
    
    setIsGenerating(true);
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      // Filter bookings based on selected statuses and date range
      const filteredBookings = mockBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return (
          selectedStatuses.includes(booking.status) &&
          bookingDate >= dateFrom &&
          bookingDate <= dateTo
        );
      });
      
      setBookings(filteredBookings);
      setIsGenerating(false);
      toast.success("Invoice data generated successfully");
    }, 1000);
  };

  // Calculate total amount of bookings
  const totalAmount = bookings ? bookings.reduce((sum, booking) => sum + booking.price, 0) : 0;
  const taxAmount = totalAmount * 0.08; // 8% tax
  const grandTotal = totalAmount + taxAmount;

  // Save invoice
  const handleSaveInvoice = () => {
    if (!invoiceName.trim()) {
      toast.error("Please enter an invoice name");
      return;
    }
    
    // This would be an API call to save the invoice
    toast.success(`Invoice "${invoiceName}" saved successfully`);
    setSaveDialogOpen(false);
    setSuccessMessage(`Invoice "${invoiceName}" has been saved successfully with ${bookings?.length} bookings totaling $${grandTotal.toFixed(2)}`);

    // Navigate to invoices page after a brief delay
    setTimeout(() => {
      navigate("/invoices");
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-muted-foreground">
          Create a new invoice by selecting bookings from a specific date range
        </p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

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
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />

          <BookingStatusSelector
            selectedStatuses={selectedStatuses}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerateInvoice} 
            disabled={isGenerating || !dateFrom || !dateTo}
            className="w-full md:w-auto"
          >
            {isGenerating ? "Generating..." : "Generate Invoice"}
          </Button>
        </CardFooter>
      </Card>

      {bookings && bookings.length > 0 && (
        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="border-b">
            <CardTitle className="text-green-700">Invoice Preview</CardTitle>
            <CardDescription>
              {bookings.length} bookings from {format(dateFrom!, "PPP")} to {format(dateTo!, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
                    <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 border-t pt-4 flex flex-col items-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-card">
            <div>
              <p className="text-sm text-muted-foreground">Generated on {format(new Date(), "PPP")}</p>
            </div>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
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
          </CardFooter>
        </Card>
      )}

      {bookings && bookings.length === 0 && (
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
      )}
    </div>
  );
};

export default GenerateInvoice;
