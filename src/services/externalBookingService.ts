
import { supabase } from "@/integrations/supabase/client";
import { BookingComBooking, BookingComResponse } from "@/types/externalBooking";
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
  },
  
  // Save external bookings directly to bookings_data table
  async saveExternalBookings(bookings: BookingComBooking[], source: string): Promise<{ 
    success: boolean; 
    saved: number;
    errors: number;
    duplicates: number;
    message?: string;
    code?: number;
  }> {
    try {
      console.log("Saving bookings:", JSON.stringify(bookings, null, 2));
      
      // Verify user is authenticated before proceeding
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error("Auth error:", authError);
        return {
          success: false,
          saved: 0,
          errors: bookings.length,
          duplicates: 0,
          message: "Authentication required. Please log in to save bookings.",
          code: 401
        };
      }

      if (!authData.session) {
        return {
          success: false,
          saved: 0,
          errors: bookings.length,
          duplicates: 0,
          message: "No authenticated session found. Please log in to save bookings.",
          code: 401
        };
      }
      
      // Call the edge function to save bookings, ensuring auth header is passed with session token
      const { data, error } = await supabase.functions.invoke('save-external-bookings', {
        body: {
          source,
          bookings
        }
      });
      
      if (error) {
        console.error("Function invocation error:", error);
        // Check if it's an authentication error
        if (error.message && (error.message.includes('auth') || error.message.includes('401'))) {
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
  },
  
  // Get booking stats by source
  async getBookingStatsBySource(source?: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    lastImport?: string;
  }> {
    try {
      // Count total bookings from this source
      let countQuery = supabase
        .from('bookings_data')
        .select('*', { count: 'exact', head: true });
        
      if (source) {
        countQuery = countQuery.eq('source', source);
      }
        
      const { count: total, error: totalError } = await countQuery;
      
      if (totalError) throw totalError;
      
      // Count pending bookings
      let pendingQuery = supabase
        .from('bookings_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (source) {
        pendingQuery = pendingQuery.eq('source', source);
      }
        
      const { count: pending, error: pendingError } = await pendingQuery;
      
      if (pendingError) throw pendingError;
      
      // Count confirmed bookings
      let confirmedQuery = supabase
        .from('bookings_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');
        
      if (source) {
        confirmedQuery = confirmedQuery.eq('source', source);
      }
        
      const { count: confirmed, error: confirmedError } = await confirmedQuery;
      
      if (confirmedError) throw confirmedError;
      
      // Count completed bookings
      let completedQuery = supabase
        .from('bookings_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
        
      if (source) {
        completedQuery = completedQuery.eq('source', source);
      }
        
      const { count: completed, error: completedError } = await completedQuery;
      
      if (completedError) throw completedError;
      
      // Count cancelled bookings
      let cancelledQuery = supabase
        .from('bookings_data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'cancelled');
        
      if (source) {
        cancelledQuery = cancelledQuery.eq('source', source);
      }
        
      const { count: cancelled, error: cancelledError } = await cancelledQuery;
      
      if (cancelledError) throw cancelledError;
      
      // Get the last import date
      let lastImportQuery = supabase
        .from('bookings_data')
        .select('created_at')
        .eq('source', source || '')
        .order('created_at', { ascending: false })
        .limit(1);
        
      const { data: lastImportData, error: lastImportError } = await lastImportQuery;
      
      if (lastImportError) throw lastImportError;
      
      const lastImport = lastImportData && lastImportData.length > 0 ? lastImportData[0].created_at : undefined;
      
      return {
        total: total || 0,
        pending: pending || 0,
        confirmed: confirmed || 0,
        completed: completed || 0,
        cancelled: cancelled || 0,
        lastImport
      };
    } catch (error: any) {
      console.error("Error fetching booking stats:", error);
      throw new Error("Failed to fetch booking statistics");
    }
  }
};
