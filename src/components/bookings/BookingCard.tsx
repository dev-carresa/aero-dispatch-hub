
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Booking, BookingStatus } from "./types/booking";
import { Clock, MapPin, Calendar, User, Tag, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  // Get badge color based on booking status
  const getBadgeColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    }
  };
  
  // Check if this is an external booking
  const isExternalBooking = !!booking.external_source;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{booking.customer}</h3>
              <Badge variant="outline" className={getBadgeColor(booking.status)}>
                {booking.status}
              </Badge>
              {isExternalBooking && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  {booking.external_source}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1">
              {booking.reference && (
                <>
                  <Tag className="h-3.5 w-3.5" />
                  <span className="mr-2">#{booking.reference}</span>
                </>
              )}
              {booking.serviceType && (
                <span className="mr-2">{booking.serviceType}</span>
              )}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 flex flex-col sm:text-right">
            <span className="font-medium text-green-600">{booking.price}</span>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {booking.date} at {booking.time}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-start gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Origin</p>
                <p className="text-sm text-muted-foreground">{booking.origin}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-start gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-sm text-muted-foreground">{booking.destination}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-2 px-4 flex justify-between items-center">
        <div className="flex gap-2 text-sm">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{booking.driver || "Unassigned"}</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{booking.vehicle}</span>
          </div>
        </div>
        <Link to={`/bookings/${booking.id}`}>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
