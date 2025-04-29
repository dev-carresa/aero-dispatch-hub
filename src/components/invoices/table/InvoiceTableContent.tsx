
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InvoiceTableRow } from "./InvoiceTableRow";
import { InvoiceTablePagination } from "./InvoiceTablePagination";

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

interface InvoiceTableContentProps {
  invoices: Invoice[];
  onStatusClick: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onDeleteClick: (invoice: Invoice) => void;
}

export const InvoiceTableContent = ({ 
  invoices, 
  onStatusClick, 
  onViewInvoice, 
  onDeleteClick 
}: InvoiceTableContentProps) => {
  return (
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
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                index={index}
                onStatusClick={onStatusClick}
                onViewInvoice={onViewInvoice}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      <InvoiceTablePagination />
    </div>
  );
};
