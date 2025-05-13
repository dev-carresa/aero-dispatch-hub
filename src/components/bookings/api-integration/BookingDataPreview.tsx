
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
  onClose?: () => void;
}

export function BookingDataPreview({
  bookings,
  isLoading,
  onSaveAll,
  currentProgress,
  totalProgress,
  onClose
}: BookingDataPreviewProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  const firstBooking = bookings && bookings.length > 0 ? bookings[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Booking Data Preview</h3>
        <div className="flex gap-2">
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
          )}
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
                {firstBooking ? 'Save First Booking' : 'No Bookings to Save'}
              </>
            )}
          </Button>
        </div>
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
          // Use id as primary identifier, fallback to other fields if available
          const bookingId = booking.id || booking.reference || booking.legId || booking.bookingReference || `booking-${index}`;
          const isExpanded = expandedBooking === bookingId;
          
          // Get guest name from the appropriate property depending on API response structure
          const guestName = booking.passenger?.name || 
            (booking.guest ? `${booking.guest.first_name} ${booking.guest.last_name}` : 'No name');
          
          // Get date information from the appropriate property depending on API response structure
          const dateInfo = booking.pickup_date_time || booking.booked_date || booking.check_in || 'No date information';
          
          // Get pickup and dropoff addresses with fallbacks
          const pickupAddress = booking.pickup?.address || 
            (booking.property?.address || 'Unknown pickup');
          
          const dropoffAddress = booking.dropoff?.address || 'Unknown destination';
          
          return (
            <Card key={bookingId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">
                      {guestName}
                      {index === 0 && <Badge className="ml-2 bg-green-500">First booking</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {dateInfo}
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
                    From: {pickupAddress}
                  </div>
                  <div>
                    To: {dropoffAddress}
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
