
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingApiLink, BookingComBooking } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { ConfigureTab } from "./tabs/ConfigureTab";
import { TestTab } from "./tabs/TestTab";
import { useAuth } from "@/context/AuthContext";

export function BookingApiTestTabs() {
  const [activeTab, setActiveTab] = useState("configure");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "loading">("loading");
  const [oauthToken, setOauthToken] = useState<string>("");
  const [fetchedBookings, setFetchedBookings] = useState<BookingComBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  const [paginationLinks, setPaginationLinks] = useState<BookingApiLink[]>([]);
  const [totalBookingsLoaded, setTotalBookingsLoaded] = useState(0);
  const { user } = useAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.warning("Please log in to save and manage bookings");
    }
  }, [user]);
  
  // Handle OAuth token received
  const handleTokenReceived = (token: string) => {
    setOauthToken(token);
    setConnectionStatus('connected');
    toast.success("OAuth token saved and ready to use");
    // Auto-switch to the test tab when a token is received
    setActiveTab('test');
  };
  
  // Extract next pagination link if available
  const getNextLink = useCallback(() => {
    if (!paginationLinks || paginationLinks.length === 0) return null;
    return paginationLinks.find(link => link.rel === "next")?.href || null;
  }, [paginationLinks]);
  
  // Handle fetch bookings with OAuth token
  const handleFetchBookings = async (isLoadingMore = false) => {
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
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error(error.message || 'Failed to fetch bookings');
    } finally {
      if (isLoadingMore) {
        setIsPaginationLoading(false);
      } else {
        setIsFetching(false);
      }
    }
  };
  
  // Handle load more bookings
  const handleLoadMoreBookings = () => {
    handleFetchBookings(true);
  };
  
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
      
      // Select the booking to save - always use the first booking
      const bookingToSave = fetchedBookings[0];
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
        toast.error('Failed to save booking');
      }
    } catch (error: any) {
      console.error('Error saving booking:', error);
      toast.error(error.message || 'Failed to save booking');
    } finally {
      setIsSaving(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="configure">Configure API</TabsTrigger>
        <TabsTrigger value="test">Test & Import</TabsTrigger>
      </TabsList>

      <TabsContent value="configure">
        <ConfigureTab 
          connectionStatus={connectionStatus} 
          onConnectionChange={(status) => setConnectionStatus(status)}
          onConfigSaved={() => setConnectionStatus('connected')}
        />
      </TabsContent>

      <TabsContent value="test">
        <TestTab 
          onFetch={() => handleFetchBookings(false)}
          isFetching={isFetching}
          fetchedBookings={fetchedBookings || []} 
          isSaving={isSaving}
          onSaveAll={handleSaveBookings}
          saveProgress={saveProgress}
          onTokenReceived={handleTokenReceived}
          hasValidToken={!!oauthToken}
          rawApiResponse={rawApiResponse}
          hasNextPage={!!getNextLink()}
          onLoadMore={handleLoadMoreBookings}
          isPaginationLoading={isPaginationLoading}
          totalBookingsLoaded={totalBookingsLoaded}
        />
      </TabsContent>
    </Tabs>
  );
}
