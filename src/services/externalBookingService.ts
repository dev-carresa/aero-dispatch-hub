
import { supabase } from "@/integrations/supabase/client";
import { BookingComBooking, BookingComResponse, ExternalBooking, ExternalBookingSource } from "@/types/externalBooking";
import { toast } from "sonner";

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

/**
 * Service for interacting with external booking APIs and the local database
 */
export const externalBookingService = {
  // Check connection status with Booking.com API
  async testBookingComConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('test-booking-api-connection', {
        body: { 
          source: 'booking.com',
          credentials: {
            username: STATIC_CREDENTIALS.username,
            password: STATIC_CREDENTIALS.password
          }
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
  },
  
  // Fetch bookings from Booking.com
  async fetchBookingsFromBookingCom(params: { 
    startDate?: string; 
    endDate?: string;
    status?: string;
    page?: number;
  }): Promise<BookingComResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-external-bookings', {
        body: { 
          source: 'booking.com',
          params,
          credentials: {
            username: STATIC_CREDENTIALS.username,
            password: STATIC_CREDENTIALS.password
          }
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Error fetching bookings from Booking.com:", error);
      throw new Error(error.message || "Failed to fetch bookings");
    }
  },
  
  // Save external bookings to the database
  async saveExternalBookings(bookings: BookingComBooking[], source: string): Promise<{ 
    success: boolean; 
    saved: number;
    errors: number;
    duplicates: number;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('save-external-bookings', {
        body: { 
          source,
          bookings
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Error saving external bookings:", error);
      throw new Error(error.message || "Failed to save bookings");
    }
  },
  
  // Get all external bookings
  async getExternalBookings(source?: string): Promise<ExternalBooking[]> {
    try {
      let query = supabase
        .from('external_bookings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (source) {
        query = query.eq('external_source', source);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to ensure it matches the ExternalBooking type
      return (data || []).map(item => ({
        ...item,
        external_source: item.external_source as ExternalBookingSource,
        status: item.status as ExternalBooking['status'],
      }));
    } catch (error: any) {
      console.error("Error fetching external bookings:", error);
      throw new Error("Failed to fetch external bookings");
    }
  },
  
  // Get a specific external booking by ID
  async getExternalBookingById(id: string): Promise<ExternalBooking | null> {
    try {
      const { data, error } = await supabase
        .from('external_bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          external_source: data.external_source as ExternalBookingSource,
          status: data.status as ExternalBooking['status'],
        };
      }
      
      return null;
    } catch (error: any) {
      console.error(`Error fetching external booking with ID ${id}:`, error);
      throw new Error("Failed to fetch the external booking");
    }
  },
  
  // Update external booking status
  async updateExternalBookingStatus(
    id: string, 
    status: ExternalBooking['status'], 
    mapped_booking_id?: string, 
    error_message?: string
  ): Promise<void> {
    try {
      const updates: any = { status };
      
      if (mapped_booking_id) {
        updates.mapped_booking_id = mapped_booking_id;
      }
      
      if (error_message) {
        updates.error_message = error_message;
      }
      
      const { error } = await supabase
        .from('external_bookings')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Booking status updated to ${status}`);
    } catch (error: any) {
      console.error(`Error updating external booking status:`, error);
      toast.error("Failed to update booking status");
      throw error;
    }
  }
};
