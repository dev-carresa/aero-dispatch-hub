
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { BookingComBooking } from "@/types/externalBooking";
import { Progress } from "@/components/ui/progress";

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
              Save All
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && totalProgress > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              Saving bookings: {currentProgress} of {totalProgress}
            </p>
            <Progress value={(currentProgress / totalProgress) * 100} />
          </div>
        )}
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">ID: {booking.id}</span>
                      <Badge status={booking.status || "unknown"} />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      title="Save this booking"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3 pt-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Field 
                      label="Guest" 
                      value={booking.guest && `${booking.guest.first_name || 'N/A'} ${booking.guest.last_name || 'N/A'}` || "N/A"} 
                    />
                    <Field label="Room" value={booking.room_details?.room_type || "N/A"} />
                    <Field label="Check In" value={booking.check_in || "N/A"} />
                    <Field label="Check Out" value={booking.check_out || "N/A"} />
                    <Field 
                      label="Price" 
                      value={
                        booking.price_details?.total_price
                          ? `${booking.price_details.total_price} ${booking.price_details.currency || ''}`
                          : "N/A"
                      } 
                    />
                    <Field label="Created" value={booking.created_at || "N/A"} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Helper components
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  let bgColor = "bg-gray-100 text-gray-800";
  
  switch (status.toLowerCase()) {
    case "confirmed":
      bgColor = "bg-green-100 text-green-800";
      break;
    case "pending":
      bgColor = "bg-yellow-100 text-yellow-800";
      break;
    case "cancelled":
      bgColor = "bg-red-100 text-red-800";
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {status}
    </span>
  );
}
