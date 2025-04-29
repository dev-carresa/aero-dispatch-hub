
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const InvoiceHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-muted-foreground">
          Manage and track customer invoices
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Link to="/invoices/generate">
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            New Invoice
          </Button>
        </Link>
      </div>
    </div>
  );
};
