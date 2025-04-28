
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { AssignDriverDialog } from "./dialogs/AssignDriverDialog";
import { AssignFleetDialog } from "./dialogs/AssignFleetDialog";
import { AssignVehicleDialog } from "./dialogs/AssignVehicleDialog";
import { TrackingHistoryDialog } from "./dialogs/TrackingHistoryDialog";
import { PaymentHistoryDialog } from "./dialogs/PaymentHistoryDialog";
import { MeetingBoardDialog } from "./dialogs/MeetingBoardDialog";
import { BookingCardHeader } from "./card/BookingCardHeader";
import { BookingCardContent } from "./card/BookingCardContent";
import { BookingCardFooter } from "./card/BookingCardFooter";
import { BookingCardActions } from "./card/BookingCardActions";
import { BookingCardAlerts } from "./card/BookingCardAlerts";
import { Booking } from "./types/booking";

interface BookingCardProps {
  booking: Booking;
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

        <BookingCardHeader 
          id={booking.id}
          reference={booking.reference}
          status={booking.status}
          serviceType={booking.serviceType}
        />

        <BookingCardContent 
          customer={booking.customer}
          origin={booking.origin}
          destination={booking.destination}
          date={booking.date}
          time={booking.time}
          vehicle={booking.vehicle}
          driver={booking.driver}
          fleet={booking.fleet}
          flightNumber={booking.flightNumber}
          source={booking.source}
        />

        <BookingCardFooter 
          price={booking.price}
          driver={booking.driver}
          onAssignDriver={() => setShowAssignDriver(true)}
          onAssignVehicle={() => setShowAssignVehicle(true)}
        />

        <BookingCardActions 
          id={booking.id}
          onAssignDriver={() => setShowAssignDriver(true)}
          onAssignFleet={() => setShowAssignFleet(true)}
          onAssignVehicle={() => setShowAssignVehicle(true)}
          onDuplicate={handleDuplicateBooking}
          onCreateInvoice={handleCreateInvoice}
          onViewTracking={() => setShowTrackingHistory(true)}
          onViewPayment={() => setShowPaymentHistory(true)}
          onViewMeetingBoard={() => setShowMeetingBoard(true)}
          onCancel={() => setShowCancelAlert(true)}
          onDelete={() => setShowDeleteAlert(true)}
        />
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

      <BookingCardAlerts 
        showCancelAlert={showCancelAlert}
        showDeleteAlert={showDeleteAlert}
        onCancelAlertChange={setShowCancelAlert}
        onDeleteAlertChange={setShowDeleteAlert}
        onConfirmCancel={handleCancelBooking}
        onConfirmDelete={handleDeleteBooking}
      />
    </>
  );
}
