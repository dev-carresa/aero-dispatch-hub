
import {
  CalendarClock,
  Car,
  Clock,
  FileText,
  MapPin,
  MoreHorizontal,
  Plane,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AssignDriverDialog } from "./dialogs/AssignDriverDialog";
import { AssignFleetDialog } from "./dialogs/AssignFleetDialog";
import { AssignVehicleDialog } from "./dialogs/AssignVehicleDialog";

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
    reference?: string;
    fleet?: string;
    source?: string;
    flightNumber?: string;
    serviceType?: string;
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [showAssignFleet, setShowAssignFleet] = useState(false);
  const [showAssignVehicle, setShowAssignVehicle] = useState(false);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
        {/* Status indicator strip */}
        <div 
          className={`absolute top-0 left-0 w-1 h-full ${
            booking.status === 'confirmed' 
              ? 'bg-green-500' 
              : booking.status === 'completed'
              ? 'bg-blue-500'
              : booking.status === 'cancelled'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          }`}
        />

        <CardHeader className="px-4 py-3 pb-0 flex flex-row items-center justify-between space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/bookings/${booking.id}`} className="font-bold hover:text-primary">
              {booking.reference || `#${booking.id}`}
            </Link>
            <Badge className={`status-badge ${
              booking.status === 'confirmed' 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : booking.status === 'completed'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : booking.status === 'cancelled'
                ? 'bg-red-100 text-red-800 border-red-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            {booking.serviceType && (
              <Badge variant="outline" className="text-xs">
                {booking.serviceType}
              </Badge>
            )}
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
              <DropdownMenuItem asChild>
                <Link to={`/bookings/${booking.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/bookings/${booking.id}/edit`}>Edit Booking</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAssignDriver(true)}>
                Assign Driver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAssignFleet(true)}>
                Assign Fleet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAssignVehicle(true)}>
                Assign Vehicle
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate Booking</DropdownMenuItem>
              <DropdownMenuItem>Create Invoice</DropdownMenuItem>
              <DropdownMenuItem>View Tracking History</DropdownMenuItem>
              <DropdownMenuItem>View Payment History</DropdownMenuItem>
              <DropdownMenuItem>Meeting Board</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Cancel Booking
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-700">
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
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span>{booking.date} at {booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span>{booking.vehicle}</span>
              {booking.fleet && (
                <Badge variant="outline" className="text-xs ml-2">
                  Fleet: {booking.fleet}
                </Badge>
              )}
            </div>
            {booking.driver && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Driver: {booking.driver}</span>
              </div>
            )}
            {booking.flightNumber && (
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
                <span>Flight: {booking.flightNumber}</span>
              </div>
            )}
            {booking.source && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Source: {booking.source}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t flex justify-between">
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setShowAssignDriver(true)}
                >
                  {booking.driver ? "Change Driver" : "Assign Driver"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {booking.driver ? "Change assigned driver" : "Assign a driver to this booking"}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setShowAssignVehicle(true)}
                >
                  Assign Vehicle
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Assign a specific vehicle to this booking
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="font-semibold">{booking.price}</div>
        </CardFooter>
      </Card>
      
      <AssignDriverDialog 
        bookingId={booking.id}
        open={showAssignDriver} 
        onOpenChange={setShowAssignDriver} 
      />
      
      <AssignFleetDialog 
        bookingId={booking.id}
        open={showAssignFleet} 
        onOpenChange={setShowAssignFleet} 
      />
      
      <AssignVehicleDialog 
        bookingId={booking.id}
        open={showAssignVehicle} 
        onOpenChange={setShowAssignVehicle} 
      />
    </>
  );
}
