
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Save } from "lucide-react";
import { BookingComBooking } from "@/types/externalBooking";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface BookingDataPreviewProps {
  bookings: BookingComBooking[];
  isLoading: boolean;
  onSaveAll: () => void;
  currentProgress: number;
  totalProgress: number;
}

export function BookingDataPreview({
  bookings,
  isLoading,
  onSaveAll,
  currentProgress,
  totalProgress
}: BookingDataPreviewProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Booking Data Preview</h3>
        <Button 
          onClick={onSaveAll} 
          disabled={isLoading || bookings.length === 0}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save First Booking
            </>
          )}
        </Button>
      </div>

      {isLoading && totalProgress > 0 && (
        <div className="space-y-2">
          <Progress value={(currentProgress / totalProgress) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Saving booking {currentProgress} of {totalProgress}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {bookings.map((booking, index) => {
          const bookingId = booking.id || booking.reference || booking.legId || booking.bookingReference || `booking-${index}`;
          const isExpanded = expandedBooking === bookingId;
          
          return (
            <Card key={bookingId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">
                      {booking.passenger?.name || 'No passenger name'} 
                      {index === 0 && <Badge className="ml-2 bg-green-500">First booking</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {booking.pickup_date_time || booking.booked_date || 'No date information'}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleExpand(bookingId)}
                  >
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pb-3">
                  <ScrollArea className="h-[300px] rounded border p-4">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(booking, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              )}
              
              <CardFooter className="bg-muted/50 px-6 py-3">
                <div className="flex justify-between items-center w-full text-sm">
                  <div>
                    From: {booking.pickup?.address || 'Unknown pickup'}
                  </div>
                  <div>
                    To: {booking.dropoff?.address || 'Unknown destination'}
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
