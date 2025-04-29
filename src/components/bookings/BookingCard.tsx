import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { AssignDriverDialog } from "./dialogs/AssignDriverDialog";
import { AssignFleetDialog } from "./dialogs/AssignFleetDialog";
import { AssignVehicleDialog } from "./dialogs/AssignVehicleDialog";
import { TrackingHistoryDialog } from "./dialogs/TrackingHistoryDialog";
import { PaymentHistoryDialog } from "./dialogs/PaymentHistoryDialog";
import { MeetingBoardDialog } from "./dialogs/MeetingBoardDialog";
import { ChangeStatusDialog } from "./dialogs/ChangeStatusDialog";
import { InvoiceDetailsDialog } from "./dialogs/InvoiceDetailsDialog";
import { BookingCardHeader } from "./card/BookingCardHeader";
import { BookingCardContent } from "./card/BookingCardContent";
import { BookingCardFooter } from "./card/BookingCardFooter";
import { BookingCardAlerts } from "./card/BookingCardAlerts";
import { Booking, BookingStatus } from "./types/booking";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  // Existing dialog state
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [showAssignFleet, setShowAssignFleet] = useState(false);
  const [showAssignVehicle, setShowAssignVehicle] = useState(false);
  const [showTrackingHistory, setShowTrackingHistory] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showMeetingBoard, setShowMeetingBoard] = useState(false);
  
  // Alert dialogs
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  // New dialog states
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  
  // New booking state that we can modify
  const [currentBooking, setCurrentBooking] = useState<Booking>(booking);
  
  const { toast } = useToast();

  // Action handlers
  const handleDuplicateBooking = () => {
    toast({
      title: "Booking duplicated",
      description: `Booking ${currentBooking.reference || currentBooking.id} has been duplicated.`,
    });
  };

  const handleCreateInvoice = () => {
    setShowInvoiceDetails(true);
  };

  const handleCancelBooking = () => {
    setShowCancelAlert(false);
    setCurrentBooking({
      ...currentBooking,
      status: 'cancelled'
    });
    toast({
      title: "Booking cancelled",
      description: `Booking ${currentBooking.reference || currentBooking.id} has been cancelled.`,
    });
  };

  const handleDeleteBooking = () => {
    setShowDeleteAlert(false);
    toast({
      title: "Booking deleted",
      description: `Booking ${currentBooking.reference || currentBooking.id} has been deleted.`,
    });
  };
  
  const handleStatusChange = (newStatus: BookingStatus) => {
    setCurrentBooking({
      ...currentBooking,
      status: newStatus
    });
    toast({
      title: "Status updated",
      description: `Booking status changed to ${newStatus}.`,
    });
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200 bg-gradient-to-br from-white to-slate-50/70">
        {/* Status indicator strip */}
        <div 
          className={`absolute top-0 left-0 w-1 h-full ${
            currentBooking.status === 'confirmed' 
              ? 'bg-green-500' 
              : currentBooking.status === 'completed'
              ? 'bg-blue-500'
              : currentBooking.status === 'cancelled'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          }`}
        />

        <BookingCardHeader 
          id={currentBooking.id}
          reference={currentBooking.reference}
          status={currentBooking.status}
          serviceType={currentBooking.serviceType}
          price={currentBooking.price}
          onStatusClick={() => setShowChangeStatus(true)}
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

        <BookingCardContent 
          customer={currentBooking.customer}
          origin={currentBooking.origin}
          destination={currentBooking.destination}
          date={currentBooking.date}
          time={currentBooking.time}
          vehicle={currentBooking.vehicle}
          driver={currentBooking.driver}
          fleet={currentBooking.fleet}
          flightNumber={currentBooking.flightNumber}
          source={currentBooking.source}
        />

        <BookingCardFooter 
          price={currentBooking.price}
          driver={currentBooking.driver}
          onAssignDriver={() => setShowAssignDriver(true)}
          onAssignVehicle={() => setShowAssignVehicle(true)}
        />
      </Card>
      
      {/* Existing Dialogs */}
      <AssignDriverDialog 
        bookingId={currentBooking.id}
        open={showAssignDriver} 
        onOpenChange={setShowAssignDriver} 
      />
      
      <AssignFleetDialog 
        bookingId={currentBooking.id}
        open={showAssignFleet} 
        onOpenChange={setShowAssignFleet} 
      />
      
      <AssignVehicleDialog 
        bookingId={currentBooking.id}
        open={showAssignVehicle} 
        onOpenChange={setShowAssignVehicle} 
      />

      <TrackingHistoryDialog 
        bookingId={currentBooking.id}
        open={showTrackingHistory}
        onOpenChange={setShowTrackingHistory}
      />

      <PaymentHistoryDialog
        bookingId={currentBooking.id}
        open={showPaymentHistory}
        onOpenChange={setShowPaymentHistory}
      />

      <MeetingBoardDialog
        bookingId={currentBooking.id}
        open={showMeetingBoard}
        onOpenChange={setShowMeetingBoard}
        bookingData={{
          customer: currentBooking.customer,
          origin: currentBooking.origin,
          destination: currentBooking.destination,
          date: currentBooking.date,
          time: currentBooking.time,
          flightNumber: currentBooking.flightNumber
        }}
      />
      
      {/* New Dialogs */}
      <ChangeStatusDialog
        bookingId={currentBooking.id}
        currentStatus={currentBooking.status}
        open={showChangeStatus}
        onOpenChange={setShowChangeStatus}
        onStatusChange={handleStatusChange}
      />
      
      <InvoiceDetailsDialog
        open={showInvoiceDetails}
        onOpenChange={setShowInvoiceDetails}
        booking={currentBooking}
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
