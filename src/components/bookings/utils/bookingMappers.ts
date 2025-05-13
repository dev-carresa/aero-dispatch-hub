
import { Booking, BookingStatus } from "@/components/bookings/types/booking";

/**
 * Maps database booking records to the format expected by the BookingsList component
 */
export function mapDbBookingsToDisplayBookings(dbBookings: any[]): Booking[] {
  return dbBookings.map(booking => {
    return {
      id: booking.id,
      reference: booking.reference_source || `B${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      customer: booking.customer_name,
      origin: booking.pickup_location,
      destination: booking.destination,
      date: booking.pickup_date,
      time: booking.pickup_time,
      vehicle: booking.vehicle_type,
      driver: booking.driver_name || "Unassigned",
      status: mapStatus(booking.status),
      price: `$${booking.price}`,
      fleet: booking.fleet_name,
      flightNumber: booking.flight_number,
      serviceType: booking.source ? `${booking.source} Transfer` : "Transfer",
      external_id: booking.external_id,
      external_source: booking.external_source
    };
  });
}

/**
 * Maps database booking status to our BookingStatus type
 */
function mapStatus(status?: string): BookingStatus {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'confirmed';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}
