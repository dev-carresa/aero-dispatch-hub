
import {
  Calendar,
  Car,
  Clock,
  MapPin,
  MoreHorizontal,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface BookingCardProps {
  booking: {
    id: string;
    customer: string;
    origin: string;
    destination: string;
    date: string;
    time: string;
    vehicle: string;
    driver: string;
    status: string;
    price: string;
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 py-3 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Link to={`/bookings/${booking.id}`} className="font-bold hover:text-primary">
            #{booking.id}
          </Link>
          <span className={`status-badge ${
            booking.status === 'confirmed' 
              ? 'status-badge-confirmed' 
              : booking.status === 'completed'
              ? 'status-badge-completed'
              : booking.status === 'cancelled'
              ? 'status-badge-cancelled'
              : 'status-badge-pending'
          }`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Booking</DropdownMenuItem>
            <DropdownMenuItem>Assign Driver</DropdownMenuItem>
            <DropdownMenuItem>Cancel Booking</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{booking.customer}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{booking.origin} → {booking.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{booking.date}</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{booking.vehicle}</span>
          </div>
          {booking.driver && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Driver: {booking.driver}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <div className="text-xs text-muted-foreground">
          Created 2 hours ago
        </div>
        <div className="font-semibold">{booking.price}</div>
      </CardFooter>
    </Card>
  );
}
