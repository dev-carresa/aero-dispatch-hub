
import { Card } from "@/components/ui/card";
import { BookingCardHeader } from "./card/BookingCardHeader";
import { BookingCardContent } from "./card/BookingCardContent";
import { BookingCardFooter } from "./card/BookingCardFooter";
import { BookingStatusIndicator } from "./card/BookingStatusIndicator";
import { BookingCardDialogs } from "./card/BookingCardDialogs";
import { useBookingDialogs } from "./hooks/useBookingDialogs";
import { Booking } from "./types/booking";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { dialogs, currentBooking, handlers } = useBookingDialogs(booking);

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200 bg-gradient-to-br from-white to-slate-50/70">
        {/* Status indicator strip */}
        <BookingStatusIndicator status={currentBooking.status} />

        <BookingCardHeader 
          id={currentBooking.id}
          reference={currentBooking.reference}
          status={currentBooking.status}
          serviceType={currentBooking.serviceType}
          price={currentBooking.price}
          onStatusClick={() => dialogs.setShowChangeStatus(true)}
          onAssignDriver={() => dialogs.setShowAssignDriver(true)}
          onAssignFleet={() => dialogs.setShowAssignFleet(true)}
          onAssignVehicle={() => dialogs.setShowAssignVehicle(true)}
          onDuplicate={handlers.handleDuplicateBooking}
          onCreateInvoice={handlers.handleCreateInvoice}
          onViewTracking={() => dialogs.setShowTrackingHistory(true)}
          onViewPayment={() => dialogs.setShowPaymentHistory(true)}
          onViewMeetingBoard={() => dialogs.setShowMeetingBoard(true)}
          onCancel={() => dialogs.setShowCancelAlert(true)}
          onDelete={() => dialogs.setShowDeleteAlert(true)}
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
          onAssignDriver={() => dialogs.setShowAssignDriver(true)}
          onAssignVehicle={() => dialogs.setShowAssignVehicle(true)}
        />
      </Card>
      
      <BookingCardDialogs 
        bookingId={currentBooking.id}
        currentBooking={currentBooking}
        dialogs={dialogs}
        handlers={handlers}
      />
    </>
  );
}
