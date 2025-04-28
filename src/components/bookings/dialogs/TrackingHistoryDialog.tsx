
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  MessageSquare, 
  User 
} from "lucide-react";

interface TrackingHistoryDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample tracking history data
const trackingHistory = [
  {
    id: "1",
    status: "Driver Arrived",
    timestamp: "2023-10-15 14:25:12",
    location: "JFK Airport Terminal 4",
    notes: "Driver arrived at pickup location",
    user: "System"
  },
  {
    id: "2",
    status: "Customer Picked Up",
    timestamp: "2023-10-15 14:35:45",
    location: "JFK Airport Terminal 4",
    notes: "Customer picked up, starting journey",
    user: "Michael Rodriguez (Driver)"
  },
  {
    id: "3",
    status: "En Route",
    timestamp: "2023-10-15 14:40:22",
    location: "Van Wyck Expressway",
    notes: "Heading to destination",
    user: "System"
  },
  {
    id: "4",
    status: "Traffic Delay",
    timestamp: "2023-10-15 15:05:18",
    location: "Queens Midtown Tunnel",
    notes: "Experiencing delay due to heavy traffic",
    user: "Michael Rodriguez (Driver)"
  },
  {
    id: "5",
    status: "Approaching Destination",
    timestamp: "2023-10-15 15:30:55",
    location: "Manhattan",
    notes: "5 minutes from destination",
    user: "System"
  },
  {
    id: "6",
    status: "Completed",
    timestamp: "2023-10-15 15:45:10",
    location: "Hilton Manhattan Hotel",
    notes: "Journey completed, customer dropped off",
    user: "Michael Rodriguez (Driver)"
  }
];

export function TrackingHistoryDialog({ bookingId, open, onOpenChange }: TrackingHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Tracking History - Booking #{bookingId}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 pr-2">
          <div className="space-y-6">
            {trackingHistory.map((event, index) => (
              <div key={event.id} className="relative pl-8 pb-6 border-l border-muted last:border-0 last:pb-0">
                <div className={`absolute w-6 h-6 rounded-full flex items-center justify-center -left-3 top-0 ${
                  index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                }`}>
                  {index === trackingHistory.length - 1 ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{event.status}</p>
                    <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{event.location}</p>
                  </div>
                  {event.notes && (
                    <div className="flex items-start gap-2 mt-1">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{event.notes}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2 mt-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{event.user}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          
          <Button size="sm">
            Print History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
