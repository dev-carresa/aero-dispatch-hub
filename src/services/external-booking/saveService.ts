
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
      
      // Get current auth session before proceeding
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Authentication error:", sessionError || "No active session");
        return {
          success: false,
          saved: 0,
          errors: bookings.length,
          duplicates: 0,
          message: "Authentication required. Please log in to save bookings.",
          code: 401
        };
      }
      
      // Call the edge function with session token explicitly included
      const { data, error } = await supabase.functions.invoke('save-external-bookings', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: {
          source,
          bookings
        }
      });
      
      if (error) {
        console.error("Function invocation error:", error);
        
        // Check if it's an authentication error
        if (error.message && (
          error.message.includes('auth') || 
          error.message.includes('401') ||
          error.message.includes('unauthorized') ||
          error.message.includes('not authenticated')
        )) {
          return {
            success: false,
            saved: 0,
            errors: bookings.length,
            duplicates: 0,
            message: "Authentication failed. Please log in again to save bookings.",
            code: 401
          };
        }
        
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
