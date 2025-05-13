
import { supabase } from "@/integrations/supabase/client";
import { BookingStats } from "./types";

/**
 * Service for retrieving booking statistics
 */
export const statsService = {
  // Get booking stats by source
  async getBookingStatsBySource(source?: string): Promise<BookingStats> {
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
