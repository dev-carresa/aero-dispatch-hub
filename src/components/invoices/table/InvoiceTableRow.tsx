
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import { InvoiceStatusBadge } from "../InvoiceStatusBadge";

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

interface InvoiceTableRowProps {
  invoice: Invoice;
  index: number;
  onStatusClick: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onDeleteClick: (invoice: Invoice) => void;
}

export const InvoiceTableRow = ({ 
  invoice, 
  index, 
  onStatusClick, 
  onViewInvoice, 
  onDeleteClick 
}: InvoiceTableRowProps) => {
  return (
    <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'} hover:bg-muted/30`}>
      <td className="px-4 py-3 text-sm font-medium">{invoice.id}</td>
      <td className="px-4 py-3 text-sm">{invoice.customer}</td>
      <td className="px-4 py-3 text-sm">{invoice.date}</td>
      <td className="px-4 py-3 text-sm text-right">${invoice.amount.toFixed(2)}</td>
      <td className="px-4 py-3">
        <button 
          onClick={() => onStatusClick(invoice)}
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
            onClick={() => onViewInvoice(invoice)}
            title="View Invoice"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={() => onDeleteClick(invoice)}
            title="Delete Invoice"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
