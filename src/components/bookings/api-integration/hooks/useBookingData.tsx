
import { useBookingFetcher } from './useBookingFetcher';
import { useBookingSaver } from './useBookingSaver';
import { useState, useCallback } from "react";
import { BookingComBooking } from "@/types/externalBooking";
import { useAuth } from "@/context/AuthContext";

export function useBookingData(user: any) {
  const { isAuthenticated } = useAuth();
  const [fetchedBookings, setFetchedBookings] = useState<BookingComBooking[]>([]);
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  const [totalBookingsLoaded, setTotalBookingsLoaded] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Use our specialized hooks for fetching and saving bookings
  const { 
    isFetching,
    isPaginationLoading,
    paginationLinks,
    handleFetchBookings,
    handleLoadMoreBookings,
    getNextLink 
  } = useBookingFetcher({
    setFetchedBookings,
    setRawApiResponse,
    setTotalBookingsLoaded,
    setErrorDetails
  });
  
  const { 
    isSaving,
    saveProgress,
    handleSaveBookings
  } = useBookingSaver({
    fetchedBookings,
    setErrorDetails,
    isAuthenticated
  });

  return {
    fetchedBookings,
    isFetching,
    isPaginationLoading,
    isSaving,
    saveProgress, 
    rawApiResponse,
    totalBookingsLoaded,
    errorDetails,
    handleFetchBookings,
    handleLoadMoreBookings,
    handleSaveBookings,
    getNextLink
  };
}
