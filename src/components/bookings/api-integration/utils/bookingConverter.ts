
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
  
  // Convert multiple external bookings in batch - NEW IMPROVED VERSION
  async batchConvertBookings(bookingIds: string[]): Promise<{ 
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
  }> {
    try {
      if (!bookingIds.length) {
        return {
          success: false,
          total: 0,
          successful: 0,
          failed: 0,
          results: []
        };
      }
      
      // Call the batch conversion function
      const { data, error } = await supabase.functions.invoke('batch-convert-external-bookings', {
        body: { bookingIds }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Error in batch conversion:", error);
      return {
        success: false,
        total: bookingIds.length,
        successful: 0,
        failed: bookingIds.length,
        results: bookingIds.map(id => ({
          success: false,
          bookingId: id,
          message: error.message || "Failed to process batch conversion"
        }))
      };
    }
  },
  
  // Legacy method for backward compatibility
  async convertMultipleBookings(bookingIds: string[]): Promise<{ 
    success: number;
    failed: number;
    messages: string[];
  }> {
    const batchResult = await this.batchConvertBookings(bookingIds);
    
    return {
      success: batchResult.successful,
      failed: batchResult.failed,
      messages: batchResult.results.map(result => 
        result.success 
          ? `Successfully imported booking ${result.bookingId}`
          : `Failed to import booking ${result.bookingId}: ${result.message}`
      )
    };
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
  
  // Check if an external booking can be imported (not already imported or in error state)
  canImportBooking(booking: ExternalBooking): boolean {
    return booking.status === 'pending' || booking.status === 'error';
  },

  // Extract coordinates from booking data
  extractCoordinates(bookingData: any): {
    pickupLatitude?: number;
    pickupLongitude?: number;
    destinationLatitude?: number;
    destinationLongitude?: number;
  } {
    let coordinates = {};
    
    // Try to extract coordinates from booking data if available
    if (bookingData?.property?.location?.coordinates) {
      coordinates = {
        destinationLatitude: bookingData.property.location.coordinates.latitude,
        destinationLongitude: bookingData.property.location.coordinates.longitude,
      };
    }
    
    // Some providers might include pickup location coordinates
    if (bookingData?.pickup?.coordinates) {
      coordinates = {
        ...coordinates,
        pickupLatitude: bookingData.pickup.coordinates.latitude,
        pickupLongitude: bookingData.pickup.coordinates.longitude
      };
    }
    
    return coordinates;
  }
};
