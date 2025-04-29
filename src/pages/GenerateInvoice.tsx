
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "@/components/reports/filter-components/DateRangeSelector";
import { BookingStatusSelector } from "@/components/reports/filter-components/BookingStatusSelector";
import { Filter, Save } from "lucide-react";
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

// Mock booking data for demonstration
const mockBookings = [
  { id: "B001", fleet: "Fleet One", customer: "John Smith", date: "2025-01-15", price: 120.00, status: "completed" },
  { id: "B002", fleet: "Fleet One", customer: "Alice Johnson", date: "2025-01-16", price: 85.50, status: "completed" },
  { id: "B003", fleet: "Fleet Two", customer: "Robert Brown", date: "2025-01-18", price: 200.75, status: "completed" },
  { id: "B004", fleet: "Fleet One", customer: "Mary Davis", date: "2025-01-22", price: 150.25, status: "completed" },
  { id: "B005", fleet: "Fleet Three", customer: "David Wilson", date: "2025-01-25", price: 95.00, status: "completed" }
];

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["completed"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookings, setBookings] = useState<any[] | null>(null);
  const [invoiceName, setInvoiceName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

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
    }, 1500);
  };

  // Calculate total amount of bookings
  const totalAmount = bookings ? bookings.reduce((sum, booking) => sum + booking.price, 0) : 0;

  // Save invoice
  const handleSaveInvoice = () => {
    if (!invoiceName.trim()) {
      toast.error("Please enter an invoice name");
      return;
    }
    
    // This would be an API call to save the invoice
    toast.success(`Invoice "${invoiceName}" saved successfully`);
    setSaveDialogOpen(false);

    // Navigate to invoices page after a brief delay
    setTimeout(() => {
      navigate("/invoices");
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-muted-foreground">
          Create a new invoice by selecting bookings from a specific date range
        </p>
      </div>

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
        <Card>
          <CardHeader>
            <CardTitle>Invoice Preview</CardTitle>
            <CardDescription>
              {bookings.length} bookings from {format(dateFrom!, "PPP")} to {format(dateTo!, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Total amount: ${totalAmount.toFixed(2)}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Fleet</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.fleet}</TableCell>
                    <TableCell>{booking.customer}</TableCell>
                    <TableCell>{format(new Date(booking.date), "PP")}</TableCell>
                    <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">All prices are exclusive of tax</p>
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
