
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";

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
  const totalAmount = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + invoice.amount, 0).toFixed(2);
  }, [invoices]);

  return (
    <div className="space-y-6 animate-fade-in">
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
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="info-banner">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <span>The next batch of invoices will be generated on Feb 1, 2025</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-scale shadow-sm card-gradient">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold">{stat.value}</p>
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                        <span className={`status-badge ${
                          invoice.status === 'paid' 
                            ? 'status-badge-confirmed' 
                            : invoice.status === 'pending'
                            ? 'status-badge-pending'
                            : 'status-badge-cancelled'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Search className="h-4 w-4" />
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
      </Card>
    </div>
  );
};

export default Invoices;
