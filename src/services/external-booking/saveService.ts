
import { supabase } from "@/integrations/supabase/client";
import { BookingComBooking } from "@/types/externalBooking";
import { toast } from "sonner";
import { SaveResult } from "./types";

/**
 * Service for saving external bookings
 */
export const saveService = {
  // Save external bookings directly to bookings_data table
  async saveExternalBookings(bookings: BookingComBooking[], source: string): Promise<SaveResult> {
    try {
      console.log("Saving bookings:", JSON.stringify(bookings, null, 2));
      
      // Call the edge function without authentication requirement
      const { data, error } = await supabase.functions.invoke('save-external-bookings', {
        body: {
          source,
          bookings
        }
      });
      
      if (error) {
        console.error("Function invocation error:", error);
        throw error;
      }
      
      console.log("Save response:", data);
      
      return {
        success: true,
        saved: data.saved || 0,
        errors: data.errors || 0,
        duplicates: data.duplicates || 0,
        message: data.message,
        code: data.code
      };
    } catch (error: any) {
      console.error("Error saving bookings:", error);
      return {
        success: false,
        saved: 0,
        errors: bookings.length,
        duplicates: 0,
        message: error.message || "Failed to save bookings",
        code: error.code || 500
      };
    }
  }
};
