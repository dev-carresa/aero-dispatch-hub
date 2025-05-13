
import { supabase } from "@/integrations/supabase/client";
import { BookingComResponse } from "@/types/externalBooking";
import { BookingCredentials, FetchParams } from "./types";
import { connectionService } from "./connectionService";

/**
 * Service for fetching bookings from external APIs
 */
export const fetchService = {
  // Fetch bookings from Booking.com
  async fetchBookingsFromBookingCom(params: FetchParams): Promise<BookingComResponse> {
    try {
      const credentials = connectionService.getCredentials();
      
      const { data, error } = await supabase.functions.invoke('fetch-external-bookings', {
        body: { 
          source: 'booking.com',
          params,
          credentials
        }
      });
      
      if (error) throw error;
      
      // Handle different response formats
      let responseData: BookingComResponse = {};
      
      if (Array.isArray(data)) {
        // If data is directly an array of bookings
        responseData.bookings = data;
        responseData.meta = { count: data.length, page: 1, pages: 1 };
      } else {
        // Normal response format
        responseData = data;
      }
      
      return responseData;
    } catch (error: any) {
      console.error("Error fetching bookings from Booking.com:", error);
      throw new Error(error.message || "Failed to fetch bookings");
    }
  }
};
