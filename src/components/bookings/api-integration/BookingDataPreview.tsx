
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, MapPin, Save, User, CalendarClock, MoreHorizontal } from "lucide-react";
import { BookingComBooking } from "@/types/externalBooking";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface BookingDataPreviewProps {
  bookings: BookingComBooking[];
  isLoading: boolean;
  onSaveAll: () => void;
  currentProgress?: number;
  totalProgress?: number;
}

export function BookingDataPreview({
  bookings,
  isLoading,
  onSaveAll,
  currentProgress = 0,
  totalProgress = 0
}: BookingDataPreviewProps) {
  if (!bookings || bookings.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Retrieved Bookings Preview</CardTitle>
        <Button
          onClick={onSaveAll}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save One Booking
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && totalProgress > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              Saving booking: {currentProgress} of {totalProgress}
            </p>
            <Progress value={(currentProgress / totalProgress) * 100} />
          </div>
        )}
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden border border-slate-200 bg-gradient-to-br from-white to-slate-50/70 relative">
                {/* Header section with booking ID and price */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-700">{booking.reservation_id || booking.id?.substring(0, 6)}</span>
                      <StatusBadge status={booking.status || "pending"} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {booking.property?.name || "Transfer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-700">
                        {booking.price_details?.total_price 
                          ? `$${booking.price_details.total_price}`
                          : "$150"}
                      </div>
                      <div className="text-xs text-muted-foreground">Total price</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Main content section */}
                <div className="p-3 flex flex-col md:flex-row gap-4">
                  {/* Left section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">
                          {booking.guest 
                            ? `${booking.guest.first_name || ''} ${booking.guest.last_name || ''}`
                            : "Guest Name"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {booking.room_details?.room_type || "Premium Transportation"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1.5 mt-2">
                      {/* From location */}
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground leading-none">From:</span>
                          <span className="text-xs font-medium line-clamp-1">{booking.property?.address || "Origin Address"}</span>
                        </div>
                      </div>
                      
                      {/* To location - Using destination or creating a placeholder */}
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground leading-none">To:</span>
                          <span className="text-xs font-medium line-clamp-1">
                            {booking.special_requests?.includes("airport") 
                              ? "Airport Transfer" 
                              : "Destination Address"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right section */}
                  <div className="flex-1 space-y-2">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CalendarClock className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-xs font-medium">
                          {booking.check_in && format(new Date(booking.check_in), "yyyy-MM-dd")} at {booking.check_in_time || "00:00"}
                        </span>
                      </div>
                      
                      {/* Driver information */}
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs">Driver: Unassigned</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer with action buttons */}
                <div className="px-4 py-2 border-t flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                  >
                    Change Driver
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                  >
                    Assign Fleet
                  </Button>
                  
                  <Button 
                    className="h-7 ml-2"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Helper components - Renamed from Badge to StatusBadge
function StatusBadge({ status }: { status: string }) {
  let bgColor = "bg-gray-100 text-gray-800";
  
  switch (status.toLowerCase()) {
    case "confirmed":
      bgColor = "bg-green-100 text-green-800 border border-green-200";
      break;
    case "pending":
      bgColor = "bg-yellow-100 text-yellow-800 border border-yellow-200";
      break;
    case "cancelled":
      bgColor = "bg-red-100 text-red-800 border border-red-200";
      break;
    case "completed":
      bgColor = "bg-blue-100 text-blue-800 border border-blue-200";
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
