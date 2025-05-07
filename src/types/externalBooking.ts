
export type ExternalBookingSource = "booking.com" | "expedia" | "airbnb" | "other";

export type ExternalBookingStatus = "pending" | "imported" | "error" | "duplicate";

export interface ExternalBooking {
  id: string;
  external_id: string;
  external_source: ExternalBookingSource;
  booking_data: any; // Raw JSON data from the external source
  mapped_booking_id?: string;
  status: ExternalBookingStatus;
  created_at: string;
  updated_at: string;
  error_message?: string;
  user_id?: string;
}

// Simplified structure of what we expect from Booking.com API
// This will be refined as we understand the actual API response better
export interface BookingComResponse {
  bookings?: BookingComBooking[];
  status?: string;
  error?: string;
  meta?: {
    count: number;
    page: number;
    pages: number;
  };
}

export interface BookingComBooking {
  id: string;
  reservation_id?: string;
  check_in: string;
  check_out: string;
  status: string;
  guest: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
  room_details?: {
    room_type?: string;
    guests?: number;
  };
  property?: {
    name: string;
    address?: string;
    city?: string;
    country?: string;
  };
  price_details?: {
    total_price?: number;
    currency?: string;
  };
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
}
