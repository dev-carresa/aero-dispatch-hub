
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { TrackingHistoryEntry } from '@/lib/schemas/bookingSchema';
import { Map, MapPin } from "lucide-react";

interface MapDisplayProps {
  trackingHistory: TrackingHistoryEntry[];
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return '#3b82f6'; // blue
    case 'onroute':
      return '#f59e0b'; // amber
    case 'arrived':
      return '#10b981'; // emerald
    case 'onboard':
      return '#8b5cf6'; // violet
    case 'completed':
      return '#16a34a'; // green
    case 'noshow':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

// This is a placeholder component that would be replaced with a real map implementation
export function MapDisplay({ trackingHistory, className }: MapDisplayProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, this would initialize a map library like Mapbox or Google Maps
    if (!mapContainerRef.current) return;
    
    // Sample code for initializing a map would go here
    console.log("Map would be initialized with tracking history:", trackingHistory);
    
    // Cleanup function
    return () => {
      // Cleanup map instance
    };
  }, [trackingHistory]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="relative h-full border rounded-md bg-slate-100">
        <div ref={mapContainerRef} className="absolute inset-0">
          {/* Placeholder for map - would be replaced with actual map */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <Map className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Map would display tracking points here.
                <br />
                <span className="text-xs">
                  (In a real implementation, this would use a mapping library)
                </span>
              </p>
              
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium">Tracking Legend:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['accepted', 'onroute', 'arrived', 'onboard', 'completed', 'noshow'].map((status) => (
                    <div key={status} className="flex items-center gap-1.5">
                      <span 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: getStatusColor(status) }}
                      ></span>
                      <span className="text-xs capitalize">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-6">
                {trackingHistory.map((entry, index) => (
                  <div key={entry.id} className="flex items-start gap-1 text-xs text-left">
                    <MapPin 
                      className="h-3 w-3 mt-0.5 flex-shrink-0" 
                      style={{ color: getStatusColor(entry.status) }}
                    />
                    <div>
                      <span className="capitalize font-medium">{entry.status}</span>
                      <br />
                      <span className="text-muted-foreground">{entry.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-2">
        <Button variant="outline" size="sm" className="text-xs">
          <Map className="h-3 w-3 mr-1" />
          Center Map
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Show All Points
        </Button>
      </div>
    </div>
  );
}
