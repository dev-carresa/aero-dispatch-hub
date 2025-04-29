
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "../types/booking";
import { FileText, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
}

export function InvoiceDetailsDialog({
  open,
  onOpenChange,
  booking,
}: InvoiceDetailsDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Generate a random invoice number
  const invoiceNumber = `INV-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsGenerating(true);
    // Simulate download process
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Invoice Downloaded",
        description: `Invoice ${invoiceNumber} has been downloaded.`,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Invoice #{invoiceNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 border rounded-lg bg-white" id="printable-invoice">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-sm text-gray-600">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Your Company Name</p>
              <p className="text-sm text-gray-600">123 Business Street</p>
              <p className="text-sm text-gray-600">City, State ZIP</p>
              <p className="text-sm text-gray-600">contact@company.com</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Bill To:</h3>
              <p className="text-sm">{booking.customer}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-medium text-gray-700">Invoice Date:</span>
                <span className="text-sm ml-2">{invoiceDate}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium text-gray-700">Due Date:</span>
                <span className="text-sm ml-2">{dueDate}</span>
              </div>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">
                  <p className="font-medium">{booking.serviceType || "Transportation Service"}</p>
                  <p className="text-sm text-gray-600">
                    From: {booking.origin}<br />
                    To: {booking.destination}<br />
                    Date: {booking.date} at {booking.time}
                  </p>
                </td>
                <td className="text-right align-top py-3">{booking.price}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Vehicle: {booking.vehicle}</td>
                <td className="text-right py-2">Included</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Total</td>
                <td className="text-right py-2 font-bold">{booking.price}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-gray-700 text-sm mb-8">
            <h4 className="font-medium mb-2">Notes:</h4>
            <p>Thank you for your business. Payment is due within 30 days.</p>
          </div>

          <div className="text-center text-gray-600 text-xs">
            <p>This invoice was automatically generated.</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
