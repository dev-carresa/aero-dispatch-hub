
import { AssignDriverDialog } from "../dialogs/AssignDriverDialog";
import { AssignFleetDialog } from "../dialogs/AssignFleetDialog";
import { AssignVehicleDialog } from "../dialogs/AssignVehicleDialog";
import { TrackingHistoryDialog } from "../dialogs/TrackingHistoryDialog";
import { PaymentHistoryDialog } from "../dialogs/PaymentHistoryDialog";
import { MeetingBoardDialog } from "../dialogs/MeetingBoardDialog";
import { ChangeStatusDialog } from "../dialogs/ChangeStatusDialog";
import { InvoiceDetailsDialog } from "../dialogs/InvoiceDetailsDialog";
import { BookingCardAlerts } from "./BookingCardAlerts";
import { Booking, BookingStatus } from "../types/booking";
import { BookingMeetingData } from "../types/booking";

interface BookingCardDialogsProps {
  bookingId: string;
  currentBooking: Booking;
  dialogs: {
    showAssignDriver: boolean;
    setShowAssignDriver: (show: boolean) => void;
    showAssignFleet: boolean;
    setShowAssignFleet: (show: boolean) => void;
    showAssignVehicle: boolean;
    setShowAssignVehicle: (show: boolean) => void;
    showTrackingHistory: boolean;
    setShowTrackingHistory: (show: boolean) => void;
    showPaymentHistory: boolean;
    setShowPaymentHistory: (show: boolean) => void;
    showMeetingBoard: boolean;
    setShowMeetingBoard: (show: boolean) => void;
    showCancelAlert: boolean;
    setShowCancelAlert: (show: boolean) => void;
    showDeleteAlert: boolean;
    setShowDeleteAlert: (show: boolean) => void;
    showChangeStatus: boolean;
    setShowChangeStatus: (show: boolean) => void;
    showInvoiceDetails: boolean;
    setShowInvoiceDetails: (show: boolean) => void;
  };
  handlers: {
    handleCancelBooking: () => void;
    handleDeleteBooking: () => void;
    handleStatusChange: (status: BookingStatus) => void;
  };
}

export function BookingCardDialogs({ 
  bookingId, 
  currentBooking,
  dialogs,
  handlers
}: BookingCardDialogsProps) {
  // Extract meeting data for the meeting board dialog
  const meetingData: BookingMeetingData = {
    customer: currentBooking.customer,
    origin: currentBooking.origin,
    destination: currentBooking.destination,
    date: currentBooking.date,
    time: currentBooking.time,
    flightNumber: currentBooking.flightNumber
  };

  return (
    <>
      <AssignDriverDialog 
        bookingId={bookingId}
        open={dialogs.showAssignDriver} 
        onOpenChange={dialogs.setShowAssignDriver} 
      />
      
      <AssignFleetDialog 
        bookingId={bookingId}
        open={dialogs.showAssignFleet} 
        onOpenChange={dialogs.setShowAssignFleet} 
      />
      
      <AssignVehicleDialog 
        bookingId={bookingId}
        open={dialogs.showAssignVehicle} 
        onOpenChange={dialogs.setShowAssignVehicle} 
      />

      <TrackingHistoryDialog 
        bookingId={bookingId}
        open={dialogs.showTrackingHistory}
        onOpenChange={dialogs.setShowTrackingHistory}
      />

      <PaymentHistoryDialog
        bookingId={bookingId}
        open={dialogs.showPaymentHistory}
        onOpenChange={dialogs.setShowPaymentHistory}
      />

      <MeetingBoardDialog
        bookingId={bookingId}
        open={dialogs.showMeetingBoard}
        onOpenChange={dialogs.setShowMeetingBoard}
        bookingData={meetingData}
      />
      
      <ChangeStatusDialog
        bookingId={bookingId}
        currentStatus={currentBooking.status}
        open={dialogs.showChangeStatus}
        onOpenChange={dialogs.setShowChangeStatus}
        onStatusChange={handlers.handleStatusChange}
      />
      
      <InvoiceDetailsDialog
        open={dialogs.showInvoiceDetails}
        onOpenChange={dialogs.setShowInvoiceDetails}
        booking={currentBooking}
      />

      <BookingCardAlerts 
        showCancelAlert={dialogs.showCancelAlert}
        showDeleteAlert={dialogs.showDeleteAlert}
        onCancelAlertChange={dialogs.setShowCancelAlert}
        onDeleteAlertChange={dialogs.setShowDeleteAlert}
        onConfirmCancel={handlers.handleCancelBooking}
        onConfirmDelete={handlers.handleDeleteBooking}
      />
    </>
  );
}
