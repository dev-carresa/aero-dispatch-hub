
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
}

export const InvoicePreview = ({ bookings, dateFrom, dateTo }: InvoicePreviewProps) => {
  const navigate = useNavigate();
  const [invoiceName, setInvoiceName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
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
    <Card className="border-green-100 bg-green-50/30">
      <CardHeader className="border-b">
        <CardTitle className="text-green-700">Invoice Preview</CardTitle>
        <CardDescription>
          {bookings.length} bookings from {dateFrom ? format(dateFrom, "PPP") : ""} to {dateTo ? format(dateTo, "PPP") : ""}
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
      
      {successMessage && (
        <div className="mt-4">
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
