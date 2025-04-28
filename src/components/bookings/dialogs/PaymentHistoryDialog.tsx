
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Badge 
} from "@/components/ui/badge";
import { CreditCard, Download } from "lucide-react";

interface PaymentHistoryDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample payment history data
const paymentHistory = [
  {
    id: "1",
    amount: "$125.00",
    status: "Paid",
    method: "Credit Card",
    date: "2023-10-11",
    time: "10:12:34",
    reference: "TXN-23498753",
    description: "Booking payment",
    card: "**** **** **** 4242"
  },
  {
    id: "2",
    amount: "$15.00",
    status: "Paid",
    method: "Credit Card",
    date: "2023-10-15",
    time: "16:05:22",
    reference: "TXN-23498754", 
    description: "Extra wait time",
    card: "**** **** **** 4242"
  },
  {
    id: "3",
    amount: "$10.00",
    status: "Refunded",
    method: "Credit Card",
    date: "2023-10-16",
    time: "09:34:11",
    reference: "TXN-23498760",
    description: "Partial refund - service issue",
    card: "**** **** **** 4242"
  }
];

export function PaymentHistoryDialog({ bookingId, open, onOpenChange }: PaymentHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Payment History - Booking #{bookingId}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Method</th>
                  <th className="py-3 px-4 text-left hidden sm:table-cell">Reference</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div>
                        <div>{payment.date}</div>
                        <div className="text-xs text-muted-foreground">{payment.time}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{payment.description}</div>
                      {payment.card && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {payment.card}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">{payment.method}</td>
                    <td className="py-3 px-4 hidden sm:table-cell text-xs">{payment.reference}</td>
                    <td className="py-3 px-4">
                      <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {payment.status === 'Refunded' ? (
                        <span className="text-red-500">-{payment.amount}</span>
                      ) : (
                        payment.amount
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="border-t bg-muted/30">
                  <td colSpan={5} className="py-3 px-4 font-medium">Total</td>
                  <td className="py-3 px-4 text-right font-medium">$130.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col text-sm">
              <span className="font-medium">Booking Amount: $125.00</span>
              <span className="text-muted-foreground">Additional Charges: $15.00</span>
              <span className="text-muted-foreground text-red-500">Refunds: $10.00</span>
              <span className="font-bold mt-1">Final Amount: $130.00</span>
            </div>
            
            <div className="space-x-2 self-end">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                Send Receipt
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Last updated: 2023-10-16 09:34:11
          </p>
          
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
