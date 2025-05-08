
import { ExternalBookingsTable } from "@/components/bookings/api-integration/ExternalBookingsTable";
import { ExternalBooking } from "@/types/externalBooking";

interface ImportTabProps {
  bookings: ExternalBooking[];
  isLoading: boolean;
  onSaveBooking: (booking: ExternalBooking) => Promise<void>;
  onViewDetails: (booking: ExternalBooking) => void;
}

export function ImportTab({ bookings, isLoading, onSaveBooking, onViewDetails }: ImportTabProps) {
  return (
    <ExternalBookingsTable
      bookings={bookings}
      isLoading={isLoading}
      onSaveBooking={onSaveBooking}
      onViewDetails={onViewDetails}
    />
  );
}
