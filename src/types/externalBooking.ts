
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

// Enhanced BookingComBooking interface to match the provided response structure
export interface BookingComBooking {
  id?: string;
  reference?: string;
  customerReference?: string;
  legId?: string;
  bookingReference?: string;
  state_hash?: string;
  status?: string;
  check_in?: string;
  check_out?: string;
  reservation_id?: string;
  booked_date?: string;
  pickup_date_time?: string;
  pickup_date_time_zone?: string;
  vehicle_type?: string;
  passenger_count?: number;
  meet_and_greet?: boolean;
  guest?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  passenger?: {
    name?: string;
    title?: string;
    telephone_number?: string;
  };
  price?: {
    amount?: string;
    currency?: string;
    customerOriginalPrice?: number;
    customerCurrency?: string;
  };
  price_details?: {
    total_price?: number;
    currency?: string;
  };
  room_details?: {
    room_type?: string;
    guests?: number;
  };
  property?: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    location?: {
      coordinates?: {
        latitude?: number;
        longitude?: number;
      }
    };
  };
  pickup?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    establishment_name?: string;
    postcode?: string;
    country?: string;
    type?: string;
  };
  dropoff?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    establishment_name?: string;
    postcode?: string;
    country?: string;
    type?: string;
  };
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
  check_in_time?: string;
  flight_number?: string;
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
