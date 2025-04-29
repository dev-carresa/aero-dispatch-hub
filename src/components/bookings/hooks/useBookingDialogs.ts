
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Booking, BookingStatus } from "../types/booking";

export const useBookingDialogs = (initialBooking: Booking) => {
  // Dialog states
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [showAssignFleet, setShowAssignFleet] = useState(false);
  const [showAssignVehicle, setShowAssignVehicle] = useState(false);
  const [showTrackingHistory, setShowTrackingHistory] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showMeetingBoard, setShowMeetingBoard] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  
  // Booking state
  const [currentBooking, setCurrentBooking] = useState<Booking>(initialBooking);
  
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

  return {
    dialogs: {
      showAssignDriver,
      setShowAssignDriver,
      showAssignFleet,
      setShowAssignFleet,
      showAssignVehicle,
      setShowAssignVehicle,
      showTrackingHistory,
      setShowTrackingHistory,
      showPaymentHistory,
      setShowPaymentHistory,
      showMeetingBoard,
      setShowMeetingBoard,
      showCancelAlert,
      setShowCancelAlert,
      showDeleteAlert,
      setShowDeleteAlert,
      showChangeStatus,
      setShowChangeStatus,
      showInvoiceDetails,
      setShowInvoiceDetails,
    },
    currentBooking,
    handlers: {
      handleDuplicateBooking,
      handleCreateInvoice,
      handleCancelBooking,
      handleDeleteBooking,
      handleStatusChange,
    }
  };
};
