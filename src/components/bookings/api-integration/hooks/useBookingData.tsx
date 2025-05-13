
import { useState, useCallback } from "react";
import { BookingComBooking, BookingApiLink } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { externalBookingService } from "@/services/externalBookingService";

export function useBookingData(user: any) {
  const [fetchedBookings, setFetchedBookings] = useState<BookingComBooking[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  const [paginationLinks, setPaginationLinks] = useState<BookingApiLink[]>([]);
  const [totalBookingsLoaded, setTotalBookingsLoaded] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Extract next pagination link if available
  const getNextLink = useCallback(() => {
    if (!paginationLinks || paginationLinks.length === 0) return null;
    return paginationLinks.find(link => link.rel === "next")?.href || null;
  }, [paginationLinks]);
  
  // Handle fetch bookings with OAuth token
  const handleFetchBookings = async (oauthToken: string, isLoadingMore = false) => {
    if (!oauthToken) {
      toast.error("Please get an OAuth token before fetching bookings");
      return;
    }

    try {
      // Set the appropriate loading state
      if (isLoadingMore) {
        setIsPaginationLoading(true);
      } else {
        setIsFetching(true);
        // Clear existing bookings when starting a new fetch
        setFetchedBookings([]);
        setPaginationLinks([]);
        setTotalBookingsLoaded(0);
      }
      
      // Get the next link if loading more
      const nextLink = isLoadingMore ? getNextLink() : null;
      
      // Prepare the request with OAuth token
      const requestBody = { 
        source: 'booking.com',
        oauthToken: oauthToken,
        nextLink: nextLink,
        params: {
          size: 20 // Request a smaller page size to demonstrate pagination
        }
      };
      
      const response = await supabase.functions.invoke('fetch-external-bookings', {
        body: requestBody
      });
      
      if (response.error) {
        throw response.error;
      }
      
      const data = response.data;
      console.log("Received data from API:", data);
      
      // Store the raw API response
      if (!isLoadingMore) {
        setRawApiResponse(data);
      }
      
      // Store pagination links if present
      if (data.links && Array.isArray(data.links)) {
        setPaginationLinks(data.links);
      } else {
        setPaginationLinks([]);
      }
      
      // Check different possible formats of bookings in the response
      let bookingsData = [];
      if (data.bookings && Array.isArray(data.bookings)) {
        bookingsData = data.bookings;
      } else if (Array.isArray(data)) {
        // Some APIs might return the array directly
        bookingsData = data;
      }
      
      if (bookingsData.length > 0) {
        if (isLoadingMore) {
          // Append new bookings to existing ones
          setFetchedBookings(prev => [...prev, ...bookingsData]);
          setTotalBookingsLoaded(prev => prev + bookingsData.length);
          toast.success(`Loaded ${bookingsData.length} more bookings`);
        } else {
          // Set new bookings
          setFetchedBookings(bookingsData);
          setTotalBookingsLoaded(bookingsData.length);
          toast.success(`Retrieved ${bookingsData.length} bookings from Booking.com`);
        }
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        if (!isLoadingMore) {
          toast.warning('No bookings found');
          setFetchedBookings([]);
          setTotalBookingsLoaded(0);
        } else {
          toast.info('No more bookings to load');
        }
      }
      
      // Clear any previous error details
      setErrorDetails(null);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error(error.message || 'Failed to fetch bookings');
      setErrorDetails(JSON.stringify(error, null, 2));
    } finally {
      if (isLoadingMore) {
        setIsPaginationLoading(false);
      } else {
        setIsFetching(false);
      }
    }
  };
  
  // Handle load more bookings
  const handleLoadMoreBookings = useCallback((oauthToken: string) => {
    handleFetchBookings(oauthToken, true);
  }, []);
  
  // Handle save bookings - saves one or more bookings directly to bookings_data
  const handleSaveBookings = async () => {
    if (!fetchedBookings || fetchedBookings.length === 0) {
      toast.warning("No bookings to save");
      return;
    }
    
    if (!user) {
      toast.error("Please log in to save bookings");
      return;
    }

    try {
      setIsSaving(true);
      setErrorDetails(null);
      
      // Select the booking to save - always use the first booking
      const bookingToSave = fetchedBookings[0];
      console.log("Attempting to save booking:", bookingToSave);
      setSaveProgress({ current: 0, total: 1 });
      
      // Small delay to show progress (this is just for UX)
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveProgress({ current: 1, total: 1 });
      
      const result = await externalBookingService.saveExternalBookings([bookingToSave], 'booking.com');
      
      if (result.success) {
        toast.success(`Successfully saved booking`);
        
        if (result.duplicates > 0) {
          toast.info(`The booking was already saved previously and was skipped`);
        }
        
        if (result.errors > 0) {
          toast.warning(`There was an error saving the booking`);
        }
      } else {
        throw new Error(result.message || 'Failed to save booking');
      }
    } catch (error: any) {
      console.error('Error saving booking:', error);
      
      // Capture and display detailed error information
      const errorMessage = error.message || 'Failed to save booking';
      toast.error(errorMessage);
      
      // Store detailed error info for debugging
      if (error.status) {
        setErrorDetails(`Status: ${error.status}\nMessage: ${errorMessage}\nDetails: ${JSON.stringify(error, null, 2)}`);
      } else {
        setErrorDetails(JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };

  return {
    fetchedBookings,
    isFetching,
    isPaginationLoading,
    isSaving,
    saveProgress, 
    rawApiResponse,
    totalBookingsLoaded,
    errorDetails, // Add this to the returned object
    handleFetchBookings,
    handleLoadMoreBookings,
    handleSaveBookings,
    getNextLink
  };
}
