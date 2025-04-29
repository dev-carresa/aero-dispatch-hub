
import { useMemo } from "react";
import { InvoiceHeader } from "@/components/invoices/InvoiceHeader";
import { InvoiceBanner } from "@/components/invoices/InvoiceBanner";
import { InvoiceStats } from "@/components/invoices/InvoiceStats";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";

// Sample data for invoices
const invoices = [
  {
    id: "INV-2023-001",
    customer: "John Smith",
    date: "Jan 15, 2025",
    amount: 250.00,
    status: "paid"
  },
  {
    id: "INV-2023-002",
    customer: "Alice Johnson",
    date: "Jan 17, 2025",
    amount: 420.50,
    status: "pending"
  },
  {
    id: "INV-2023-003",
    customer: "Robert Davis",
    date: "Jan 20, 2025",
    amount: 185.75,
    status: "paid"
  },
  {
    id: "INV-2023-004",
    customer: "Maria Garcia",
    date: "Jan 22, 2025",
    amount: 310.25,
    status: "overdue"
  },
  {
    id: "INV-2023-005",
    customer: "David Wilson",
    date: "Jan 25, 2025",
    amount: 540.00,
    status: "pending"
  },
  {
    id: "INV-2023-006",
    customer: "Sarah Lee",
    date: "Jan 27, 2025",
    amount: 195.50,
    status: "paid"
  },
  {
    id: "INV-2023-007",
    customer: "Michael Brown",
    date: "Jan 29, 2025",
    amount: 275.25,
    status: "overdue"
  },
  {
    id: "INV-2023-008",
    customer: "Jennifer Miller",
    date: "Feb 01, 2025",
    amount: 430.00,
    status: "pending"
  }
];

// Stats for the dashboard
const stats = [
  { title: "Total Invoices", value: "$24,780", change: "+12%", duration: "from last month" },
  { title: "Pending", value: "$5,230", change: "-2%", duration: "from last month" },
  { title: "Overdue", value: "$2,130", change: "+5%", duration: "from last month" },
];

const Invoices = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <InvoiceHeader />
      <InvoiceBanner />
      <InvoiceStats stats={stats} />
      <InvoiceTable invoices={invoices} />
    </div>
  );
};

export default Invoices;
