
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceDetails {
  id: string;
  name: string;
  customer: string;
  date: string;
  dueDate: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  notes: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock invoice data - in a real app would come from an API
        const mockInvoice: InvoiceDetails = {
          id: id || "INV-2023-001",
          name: `Invoice #${id || "INV-2023-001"}`,
          customer: "Fleet Transportation Inc.",
          date: "2023-04-15",
          dueDate: "2023-05-15", 
          items: [
            {
              id: "1",
              description: "Airport Transfer Service - JFK to Manhattan",
              quantity: 5,
              rate: 120,
              amount: 600
            },
            {
              id: "2",
              description: "Corporate Event Transportation",
              quantity: 1,
              rate: 850,
              amount: 850
            },
            {
              id: "3",
              description: "VIP Chauffeur Service - Daily Rate",
              quantity: 3,
              rate: 450,
              amount: 1350
            }
          ],
          notes: "Please process payment within 30 days. For any inquiries, contact accounts@fleetdrive.com",
          status: "issued",
          subtotal: 2800,
          taxRate: 0.08,
          taxAmount: 224,
          total: 3024
        };
        
        setInvoice(mockInvoice);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice", error);
        toast.error("Failed to load invoice details");
        setLoading(false);
      }
    };
    
    fetchInvoiceDetails();
  }, [id]);
  
  const handleExport = (format: "pdf" | "csv" | "excel") => {
    toast.success(`Invoice exported as ${format.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/invoices")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Loading Invoice...</h1>
            <p className="text-muted-foreground">Please wait while we load the invoice details</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/invoices")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Invoice Not Found</h1>
            <p className="text-muted-foreground">The invoice you're looking for couldn't be found</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">This invoice may have been deleted or doesn't exist</p>
          <Button onClick={() => navigate("/invoices")}>
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/invoices")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.name}</h1>
            <p className="text-muted-foreground">
              Invoice issued on {formatDate(invoice.date)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
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
          </div>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Invoice #{invoice.id} for {invoice.customer}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <div className="px-6 pb-2">
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Invoice Date</h4>
                <p className="text-lg font-medium">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
                <p className="text-lg font-medium">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p className="text-lg font-medium capitalize">{invoice.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Amount</h4>
                <p className="text-lg font-bold text-primary">{formatCurrency(invoice.total)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 border-t pt-4 flex flex-col items-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({invoice.taxRate * 100}%):</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-card">
          <div>
            <p className="text-sm text-muted-foreground">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
