
import { useState, useCallback } from "react";
import { BookingComBooking, BookingApiLink } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseBookingFetcherProps {
  setFetchedBookings: React.Dispatch<React.SetStateAction<BookingComBooking[]>>;
  setRawApiResponse: React.Dispatch<React.SetStateAction<any>>;
  setTotalBookingsLoaded: React.Dispatch<React.SetStateAction<number>>;
  setErrorDetails: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useBookingFetcher({
  setFetchedBookings,
  setRawApiResponse,
  setTotalBookingsLoaded,
  setErrorDetails
}: UseBookingFetcherProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [paginationLinks, setPaginationLinks] = useState<BookingApiLink[]>([]);
  
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
        // Clear any previous errors
        setErrorDetails(null);
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
  
  return {
    isFetching,
    isPaginationLoading,
    paginationLinks,
    handleFetchBookings,
    handleLoadMoreBookings,
    getNextLink
  };
}
