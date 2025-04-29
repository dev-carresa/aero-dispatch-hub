
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  Trash2 
} from "lucide-react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { InvoiceStatusDialog } from "./InvoiceStatusDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
}

export const InvoiceTable = ({ invoices }: InvoiceTableProps) => {
  const navigate = useNavigate();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2);
  
  const handleStatusClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setStatusDialogOpen(true);
  };
  
  const handleStatusChange = (id: string, newStatus: string) => {
    // In a real app, this would update the invoice status in your data source
    console.log(`Updated invoice ${id} status to ${newStatus}`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // In a real app, this would navigate to the invoice details page
    toast.info(`Viewing invoice ${invoice.id}`);
    // Simulate navigation to invoice details
    navigate(`/invoices/${invoice.id}`);
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      // In a real app, this would delete the invoice from your data source
      toast.success(`Invoice ${invoiceToDelete.id} deleted successfully`);
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">All Invoices</CardTitle>
          <CardDescription>Total value: ${totalAmount}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-9 h-9 w-[180px] md:w-[240px] bg-white" />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Invoice ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Customer</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Date</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'} hover:bg-muted/30`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{invoice.id}</td>
                    <td className="px-4 py-3 text-sm">{invoice.customer}</td>
                    <td className="px-4 py-3 text-sm">{invoice.date}</td>
                    <td className="px-4 py-3 text-sm text-right">${invoice.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleStatusClick(invoice)}
                        className="bg-transparent border-none p-0 cursor-pointer"
                      >
                        <InvoiceStatusBadge status={invoice.status} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewInvoice(invoice)}
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(invoice)}
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-muted/20 py-3 px-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing 1-8 of 24 invoices
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {selectedInvoice && (
        <InvoiceStatusDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          invoiceId={selectedInvoice.id}
          currentStatus={selectedInvoice.status}
          onStatusChange={handleStatusChange}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete invoice 
              {invoiceToDelete ? ` ${invoiceToDelete.id}` : ""} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
