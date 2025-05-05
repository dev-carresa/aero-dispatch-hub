
import { BookingFormContainer } from "./form/BookingFormContainer";

interface BookingFormProps {
  isEditing?: boolean;
  bookingId?: string;
}

export function BookingForm({ isEditing = false, bookingId }: BookingFormProps) {
  return (
    <BookingFormContainer isEditing={isEditing} bookingId={bookingId} />
  );
}
