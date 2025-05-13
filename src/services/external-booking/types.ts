
import { BookingComBooking, BookingComResponse } from "@/types/externalBooking";

// Authentication credentials type
export interface BookingCredentials {
  username: string;
  password: string;
}

// Fetch parameters type
export interface FetchParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
}

// Save result type
export interface SaveResult {
  success: boolean;
  saved: number;
  errors: number;
  duplicates: number;
  message?: string;
  code?: number;
}

// Stats result type
export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  lastImport?: string;
}
