
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InvoiceStatusDialog } from "./InvoiceStatusDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { InvoiceTableHeader } from "./table/InvoiceTableHeader";
import { InvoiceTableContent } from "./table/InvoiceTableContent";
import { DeleteInvoiceDialog } from "./table/DeleteInvoiceDialog";

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
        <InvoiceTableHeader totalAmount={totalAmount} />
      </CardHeader>
      <CardContent>
        <InvoiceTableContent 
          invoices={invoices} 
          onStatusClick={handleStatusClick}
          onViewInvoice={handleViewInvoice}
          onDeleteClick={handleDeleteClick}
        />
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

      <DeleteInvoiceDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        invoiceToDelete={invoiceToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </Card>
  );
};
