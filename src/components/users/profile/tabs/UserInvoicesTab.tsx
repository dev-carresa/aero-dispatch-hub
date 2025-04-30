
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  reference: string;
  customer_name: string;
  fleet_name: string | null;
  status: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
}

interface UserInvoicesTabProps {
  userId?: string | number;
}

export const UserInvoicesTab = ({ userId }: UserInvoicesTabProps) => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        // Fetch actual invoices data from Supabase
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('customer_id', userId)
          .order('issue_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setInvoices(data);
        } else {
          // Use sample data if no real data is available or for demo purposes
          const { data: sampleData } = await supabase
            .from('invoices')
            .select('*')
            .order('issue_date', { ascending: false })
            .limit(5);
            
          setInvoices(sampleData || []);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error('Failed to load invoices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const viewInvoiceDetails = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>View and manage your invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : invoices.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.reference}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.issue_date), 'PP')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.due_date), 'PP')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.total_amount)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => viewInvoiceDetails(invoice.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No invoices found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
