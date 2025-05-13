
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

// Link object for pagination in Booking.com API responses
export interface BookingApiLink {
  rel: string;
  href: string;
  type: string;
}

// Simplified structure of what we expect from Booking.com API
export interface BookingComResponse {
  bookings?: BookingComBooking[];
  status?: string;
  error?: string;
  meta?: {
    count: number;
    page: number;
    pages: number;
  };
  links?: BookingApiLink[]; // Added links array for pagination
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
    location?: {
      coordinates?: {
        latitude: number;
        longitude: number;
      }
    };
  };
  price_details?: {
    total_price?: number;
    currency?: string;
  };
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
  check_in_time?: string;
  flight_number?: string;
  pickup?: {
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
}

export interface BatchConversionResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    success: boolean;
    bookingId: string;
    message: string;
    internalBookingId?: string;
  }>;
}
