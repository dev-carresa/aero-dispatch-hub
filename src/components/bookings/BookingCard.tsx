
import {
  AlertTriangle,
  CalendarClock,
  Car,
  Clock,
  Copy,
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
import { TrackingHistoryDialog } from "./dialogs/TrackingHistoryDialog";
import { PaymentHistoryDialog } from "./dialogs/PaymentHistoryDialog";
import { MeetingBoardDialog } from "./dialogs/MeetingBoardDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle, 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const [showTrackingHistory, setShowTrackingHistory] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showMeetingBoard, setShowMeetingBoard] = useState(false);
  
  // Alert dialogs
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  const { toast } = useToast();

  // Action handlers
  const handleDuplicateBooking = () => {
    toast({
      title: "Booking duplicated",
      description: `Booking ${booking.reference || booking.id} has been duplicated.`,
    });
  };

  const handleCreateInvoice = () => {
    toast({
      title: "Invoice created",
      description: `Invoice for booking ${booking.reference || booking.id} has been created.`,
    });
  };

  const handleCancelBooking = () => {
    setShowCancelAlert(false);
    toast({
      title: "Booking cancelled",
      description: `Booking ${booking.reference || booking.id} has been cancelled.`,
    });
  };

  const handleDeleteBooking = () => {
    setShowDeleteAlert(false);
    toast({
      title: "Booking deleted",
      description: `Booking ${booking.reference || booking.id} has been deleted.`,
    });
  };

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
              <DropdownMenuItem onClick={handleDuplicateBooking}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Booking
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateInvoice}>
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTrackingHistory(true)}>
                <MapPin className="h-4 w-4 mr-2" />
                View Tracking History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowPaymentHistory(true)}>
                <FileText className="h-4 w-4 mr-2" />
                View Payment History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowMeetingBoard(true)}>
                <User className="h-4 w-4 mr-2" />
                Meeting Board
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowCancelAlert(true)} 
                className="text-red-500"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Cancel Booking
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteAlert(true)} 
                className="text-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
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
      
      {/* Dialogs */}
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

      {/* New dialogs */}
      <TrackingHistoryDialog 
        bookingId={booking.id}
        open={showTrackingHistory}
        onOpenChange={setShowTrackingHistory}
      />

      <PaymentHistoryDialog
        bookingId={booking.id}
        open={showPaymentHistory}
        onOpenChange={setShowPaymentHistory}
      />

      <MeetingBoardDialog
        bookingId={booking.id}
        open={showMeetingBoard}
        onOpenChange={setShowMeetingBoard}
        bookingData={{
          customer: booking.customer,
          origin: booking.origin,
          destination: booking.destination,
          date: booking.date,
          time: booking.time,
          flightNumber: booking.flightNumber
        }}
      />

      {/* Alert dialogs */}
      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelBooking} 
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone and will permanently remove this booking from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBooking} 
              className="bg-red-700 hover:bg-red-800"
            >
              Yes, Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
