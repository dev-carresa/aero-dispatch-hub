
import { supabase } from "@/integrations/supabase/client";
import { BookingCredentials } from "./types";

// Static credentials for authentication
const STATIC_CREDENTIALS: BookingCredentials = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

/**
 * Service for testing connection with Booking.com API
 */
export const connectionService = {
  // Get static credentials for authentication
  getCredentials(): BookingCredentials {
    return STATIC_CREDENTIALS;
  },

  // Check connection status with Booking.com API
  async testBookingComConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('test-booking-api-connection', {
        body: { 
          source: 'booking.com',
          credentials: STATIC_CREDENTIALS
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Error testing Booking.com connection:", error);
      return { 
        success: false, 
        message: error.message || "Connection test failed" 
      };
    }
  }
};
