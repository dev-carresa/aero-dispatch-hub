
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

interface InvoiceTableHeaderProps {
  totalAmount: string;
}

export const InvoiceTableHeader = ({ totalAmount }: InvoiceTableHeaderProps) => {
  return (
    <>
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
    </>
  );
};
