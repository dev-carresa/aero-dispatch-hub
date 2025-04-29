
import { BookingStatus } from "../types/booking";

interface BookingStatusIndicatorProps {
  status: BookingStatus;
}

export function BookingStatusIndicator({ status }: BookingStatusIndicatorProps) {
  return (
    <div 
      className={`absolute top-0 right-0 w-1 h-full ${
        status === 'confirmed' 
          ? 'bg-green-500' 
          : status === 'completed'
          ? 'bg-blue-500'
          : status === 'cancelled'
          ? 'bg-red-500'
          : 'bg-yellow-500'
      }`}
    />
  );
}
