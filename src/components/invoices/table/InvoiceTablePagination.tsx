
import { Button } from "@/components/ui/button";

export const InvoiceTablePagination = () => {
  return (
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
  );
};
