
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service for converting external bookings to internal bookings
 */
export const bookingConverter = {
  // Convert a single external booking to an internal booking
  async convertExternalBooking(bookingId: string): Promise<{ success: boolean; message: string; internalBookingId?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('convert-external-booking', {
        body: {
          externalBookingId: bookingId
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        // Return success with the internal booking ID
        return {
          success: true,
          message: "Booking successfully imported",
          internalBookingId: data.internalBookingId
        };
      } else {
        // Return the error message from the function
        return {
          success: false,
          message: data.message || "Failed to import booking"
        };
      }
    } catch (error: any) {
      console.error("Error converting external booking:", error);
      return {
        success: false,
        message: error.message || "Failed to import booking"
      };
    }
  },
  
  // Update external booking status
  async updateBookingStatus(bookingId: string, status: string, errorMessage?: string): Promise<boolean> {
    try {
      const update: any = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (errorMessage) {
        update.error_message = errorMessage;
      }
      
      const { error } = await supabase
        .from('external_bookings')
        .update(update)
        .eq('id', bookingId);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      toast.error(error.message || "Failed to update booking status");
      return false;
    }
  },
  
  // Convert multiple external bookings in batch
  async convertMultipleBookings(bookingIds: string[]): Promise<{ 
    success: number;
    failed: number;
    messages: string[];
  }> {
    const results = {
      success: 0,
      failed: 0,
      messages: [] as string[]
    };
    
    for (const bookingId of bookingIds) {
      const result = await this.convertExternalBooking(bookingId);
      
      if (result.success) {
        results.success++;
        results.messages.push(`Successfully imported booking ${bookingId}`);
      } else {
        results.failed++;
        results.messages.push(`Failed to import booking ${bookingId}: ${result.message}`);
      }
    }
    
    return results;
  },
  
  // Check if an external booking can be imported (not already imported or in error state)
  canImportBooking(booking: ExternalBooking): boolean {
    return booking.status === 'pending' || booking.status === 'error';
  }
};
