
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Clock } from "lucide-react";
import { type TrackingHistoryEntry } from "@/lib/schemas/bookingSchema";
import { TimelineView } from "../tracking/TimelineView";
import { MapDisplay } from "../tracking/MapDisplay";

interface TrackingHistoryDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample tracking history data with the specified flow and coordinates
const trackingHistory: TrackingHistoryEntry[] = [
  {
    id: "1",
    status: "accepted",
    timestamp: "2023-10-15 14:05:12",
    location: "Driver's Office",
    coords: [-73.9866, 40.7306], // NYC coordinates
    notes: "Driver accepted the booking",
    user: "Michael Rodriguez (Driver)"
  },
  {
    id: "2",
    status: "onroute",
    timestamp: "2023-10-15 14:15:45",
    location: "East Village",
    coords: [-73.9772, 40.7253],
    notes: "Driver is on the way to pickup location",
    user: "System"
  },
  {
    id: "3",
    status: "arrived",
    timestamp: "2023-10-15 14:25:22",
    location: "JFK Airport Terminal 4",
    coords: [-73.7781, 40.6413],
    notes: "Driver arrived at pickup location",
    user: "Michael Rodriguez (Driver)"
  },
  {
    id: "4",
    status: "onboard",
    timestamp: "2023-10-15 14:35:18",
    location: "JFK Airport Terminal 4",
    coords: [-73.7781, 40.6413],
    notes: "Customer is on board, starting journey",
    user: "Michael Rodriguez (Driver)"
  },
  {
    id: "5",
    status: "completed",
    timestamp: "2023-10-15 15:45:10",
    location: "Hilton Manhattan Hotel",
    coords: [-73.9819, 40.7629],
    notes: "Journey completed, customer dropped off",
    user: "Michael Rodriguez (Driver)"
  }
];

export function TrackingHistoryDialog({ bookingId, open, onOpenChange }: TrackingHistoryDialogProps) {
  const [viewMode, setViewMode] = useState<"split" | "timeline" | "map">("split");

  // Function to determine layout based on viewMode
  const getLayoutClasses = () => {
    switch (viewMode) {
      case "timeline":
        return "flex-col";
      case "map":
        return "flex-col";
      case "split":
      default:
        return "flex-col md:flex-row";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Tracking History - Booking #{bookingId}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-auto">
              <TabsList className="grid grid-cols-3 h-8">
                <TabsTrigger value="split" className="text-xs px-2">Split View</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs px-2">Timeline</TabsTrigger>
                <TabsTrigger value="map" className="text-xs px-2">Map</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>
        
        <div className={`flex flex-1 gap-4 overflow-hidden ${getLayoutClasses()}`}>
          <TabsContent value="split" className="flex-1 mt-0 flex flex-col md:flex-row gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto md:max-w-[40%]">
              <TimelineView trackingHistory={trackingHistory} className="h-full" />
            </div>
            <div className="flex-1">
              <MapDisplay trackingHistory={trackingHistory} className="h-full" />
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="flex-1 mt-0 overflow-y-auto">
            <TimelineView trackingHistory={trackingHistory} className="h-full" />
          </TabsContent>
          
          <TabsContent value="map" className="flex-1 mt-0">
            <MapDisplay trackingHistory={trackingHistory} className="h-full" />
          </TabsContent>
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
