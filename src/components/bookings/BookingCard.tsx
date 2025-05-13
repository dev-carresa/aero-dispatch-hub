
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Booking, BookingStatus } from "./types/booking";
import { CalendarClock, Car, MapPin, MoreHorizontal, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  
  return (
    <Card className="border rounded-lg shadow-sm relative overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row gap-4">
        {/* Left section: Booking reference and status */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-blue-700 font-bold text-lg">
                  {booking.reference || `#${booking.id.substring(0, 6)}`}
                </h3>
                <Badge variant="outline" className={cn(getBadgeColor(booking.status))}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{booking.serviceType || "Transfer"}</p>
            </div>
            
            <div className="text-right hidden md:block">
              <div className="text-blue-700 font-bold text-lg">{booking.price}</div>
              <div className="text-xs text-gray-500">Total price</div>
            </div>
          </div>
          
          {/* Vehicle section */}
          <div className="flex items-center gap-2 mt-3 bg-blue-50 p-2 rounded-lg">
            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm">{booking.vehicle}</p>
              <p className="text-xs text-gray-500">Premium Transportation</p>
            </div>
          </div>
          
          {/* Customer and locations */}
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="text-sm">{booking.customer || "Guest from booking.com"}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">From:</span>
                <span className="text-sm font-medium">{booking.origin || "Imported Address"}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">To:</span>
                <span className="text-sm font-medium">{booking.destination || "Imported Destination"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right section - Time and action buttons */}
        <div className="flex flex-col md:border-l md:pl-4 w-full md:w-1/3">
          <div className="text-right md:hidden mb-3">
            <div className="text-blue-700 font-bold text-lg">{booking.price}</div>
            <div className="text-xs text-gray-500">Total price</div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{booking.date} at {booking.time}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Driver: {booking.driver || "Unassigned"}</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-auto pt-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {}}
            >
              Change Driver
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => {}}
            >
              Assign Fleet
            </Button>
            
            <Link to={`/bookings/${booking.id}`} className="flex-1">
              <Button 
                className="w-full"
                size="sm"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
