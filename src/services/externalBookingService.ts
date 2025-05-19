
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
  
  // Get all external bookings with optional filtering
  async getExternalBookings(
    source?: string, 
    status?: string,
    options?: { 
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }
  ): Promise<ExternalBooking[]> {
    try {
      let query = supabase
        .from('external_bookings')
        .select('*');
        
      // Apply source filter
      if (source) {
        query = query.eq('external_source', source);
      }
      
      // Apply status filter
      if (status) {
        query = query.eq('status', status);
      }
      
      // Apply ordering
      const orderBy = options?.orderBy || 'created_at';
      const orderDirection = options?.orderDirection || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options?.limit || 10) - 1);
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
  },
  
  // Get statistics about external bookings
  async getExternalBookingStats(source?: string): Promise<{
    total: number;
    pending: number;
    imported: number;
    error: number;
    lastImport?: string;
  }> {
    try {
      // Count total bookings
      let countQuery = supabase
        .from('external_bookings')
        .select('*', { count: 'exact', head: true });
        
      if (source) {
        countQuery = countQuery.eq('external_source', source);
      }
        
      const { count: total, error: totalError } = await countQuery;
      
      if (totalError) throw totalError;
      
      // Count pending bookings
      let pendingQuery = supabase
        .from('external_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (source) {
        pendingQuery = pendingQuery.eq('external_source', source);
      }
        
      const { count: pending, error: pendingError } = await pendingQuery;
      
      if (pendingError) throw pendingError;
      
      // Count imported bookings
      let importedQuery = supabase
        .from('external_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'imported');
        
      if (source) {
        importedQuery = importedQuery.eq('external_source', source);
      }
        
      const { count: imported, error: importedError } = await importedQuery;
      
      if (importedError) throw importedError;
      
      // Count error bookings
      let errorQuery = supabase
        .from('external_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'error');
        
      if (source) {
        errorQuery = errorQuery.eq('external_source', source);
      }
        
      const { count: error, error: errorQueryError } = await errorQuery;
      
      if (errorQueryError) throw errorQueryError;
      
      // Get the last import date
      let lastImportQuery = supabase
        .from('external_bookings')
        .select('updated_at')
        .eq('status', 'imported')
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (source) {
        lastImportQuery = lastImportQuery.eq('external_source', source);
      }
        
      const { data: lastImportData, error: lastImportError } = await lastImportQuery;
      
      if (lastImportError) throw lastImportError;
      
      const lastImport = lastImportData && lastImportData.length > 0 ? lastImportData[0].updated_at : undefined;
      
      return {
        total: total || 0,
        pending: pending || 0,
        imported: imported || 0,
        error: error || 0,
        lastImport
      };
    } catch (error: any) {
      console.error("Error fetching external booking stats:", error);
      throw new Error("Failed to fetch external booking statistics");
    }
  }
};
