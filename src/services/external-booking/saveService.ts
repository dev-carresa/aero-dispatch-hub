
import { BookingComBooking } from "@/types/externalBooking";

export interface SaveResponse {
  success: boolean;
  message: string;
  savedCount: number;
  errors?: any[];
}

import { supabase } from "@/integrations/supabase/client";

/**
 * Service for saving external bookings
 */
export const saveService = {
  /**
   * Save fetched bookings to the database
   */
  saveExternalBookings: async (bookings: BookingComBooking[]): Promise<SaveResponse> => {
    try {
      console.log('Saving external bookings:', bookings.length);
      
      if (!bookings.length) {
        return { success: false, message: 'No bookings to save', savedCount: 0 };
      }
  
      const response = await supabase.functions.invoke('save-external-bookings', {
        body: { bookings }
      });
  
      if (response.error) {
        console.error('Error from edge function:', response.error);
        return { 
          success: false, 
          message: `Failed to save bookings: ${response.error.message || 'Unknown error'}`,
          savedCount: 0
        };
      }
  
      if (!response.data) {
        return { success: false, message: 'No response data from save function', savedCount: 0 };
      }
  
      return {
        success: true,
        message: `Successfully saved ${response.data.savedCount} bookings`,
        savedCount: response.data.savedCount,
        errors: response.data.errors || []
      };
    } catch (error: any) {
      console.error('Error saving external bookings:', error);
      return { 
        success: false, 
        message: `Error saving bookings: ${error.message || 'Unknown error'}`,
        savedCount: 0
      };
    }
  }
};

// Also export the function directly for backward compatibility
export const { saveExternalBookings } = saveService;
