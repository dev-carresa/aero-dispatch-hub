
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'pending';

export interface Booking {
  id: string;
  reference?: string;
  customer: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  vehicle: string;
  driver: string;
  status: BookingStatus;
  price: string;
  fleet?: string;
  source?: string;
  flightNumber?: string;
  serviceType?: string;
}

export interface BookingMeetingData {
  customer: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  flightNumber?: string;
}
