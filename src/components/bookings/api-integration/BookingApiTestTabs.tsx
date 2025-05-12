
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { ConfigureTab } from "./tabs/ConfigureTab";
import { TestTab } from "./tabs/TestTab";
import { ImportTab } from "./tabs/ImportTab";
import { bookingConverter } from "./utils/bookingConverter";
import { useAuth } from "@/context/AuthContext";

export function BookingApiTestTabs() {
  const [activeTab, setActiveTab] = useState("configure");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "loading">("loading");
  const [oauthToken, setOauthToken] = useState<string>("");
  const [fetchedBookings, setFetchedBookings] = useState<BookingComBooking[]>([]);
  const [externalBookings, setExternalBookings] = useState<ExternalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  const { user } = useAuth();
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.warning("Please log in to save and manage bookings");
    }
  }, [user]);
  
  // Load existing external bookings
  const loadExternalBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const bookings = await externalBookingService.getExternalBookings('booking.com');
      setExternalBookings(bookings);
      return; // Return void instead of the bookings
    } catch (error) {
      console.error('Error loading external bookings:', error);
      toast.error('Failed to load external bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadExternalBookings();
  }, [loadExternalBookings]);
  
  // Handle OAuth token received
  const handleTokenReceived = (token: string) => {
    setOauthToken(token);
    setConnectionStatus('connected');
    toast.success("OAuth token saved and ready to use");
    // Auto-switch to the test tab when a token is received
    setActiveTab('test');
  };
  
  // Handle fetch bookings with OAuth token
  const handleFetchBookings = async () => {
    if (!oauthToken) {
      toast.error("Please get an OAuth token before fetching bookings");
      return;
    }

    try {
      setIsFetching(true);
      
      // Prepare the request with OAuth token
      const requestBody = { 
        source: 'booking.com',
        oauthToken: oauthToken
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
      setRawApiResponse(data);
      
      if (data.bookings && Array.isArray(data.bookings)) {
        setFetchedBookings(data.bookings);
        toast.success(`Retrieved ${data.bookings.length} bookings from Booking.com`);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        toast.warning('No bookings found');
        setFetchedBookings([]);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error(error.message || 'Failed to fetch bookings');
    } finally {
      setIsFetching(false);
    }
  };
  
  // Handle save all bookings
  const handleSaveAllBookings = async () => {
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
      setSaveProgress({ current: 0, total: fetchedBookings.length });
      
      // Progress tracking
      for (let i = 0; i < fetchedBookings.length; i++) {
        setSaveProgress({ current: i+1, total: fetchedBookings.length });
        // Small delay to show progress (this is just for UX)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const result = await externalBookingService.saveExternalBookings(fetchedBookings, 'booking.com');
      
      if (result.success) {
        toast.success(`Successfully saved ${result.saved} bookings`);
        
        if (result.duplicates > 0) {
          toast.info(`${result.duplicates} bookings were duplicates and skipped`);
        }
        
        if (result.errors > 0) {
          toast.warning(`${result.errors} bookings had errors and were not saved`);
        }
        
        // Refresh the external bookings list
        await loadExternalBookings();
        
        // Switch to the import tab
        setActiveTab('import');
      } else {
        toast.error('Failed to save bookings');
      }
    } catch (error: any) {
      console.error('Error saving bookings:', error);
      toast.error(error.message || 'Failed to save bookings');
    } finally {
      setIsSaving(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };
  
  // Handle import external booking to internal system
  const handleImportBooking = async (booking: ExternalBooking) => {
    try {
      toast.info(`Starting import of booking ${booking.external_id}`);
      
      const result = await bookingConverter.convertExternalBooking(booking.id);
      
      if (result.success) {
        toast.success(`Successfully imported booking ${booking.external_id}`);
        await loadExternalBookings();
      } else {
        toast.error(`Failed to import booking: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Error importing booking:', error);
      toast.error(error.message || 'Failed to import booking');
    }
  };
  
  // Handle view booking details
  const handleViewBookingDetails = (booking: ExternalBooking) => {
    // Display booking details in a toast for now
    toast.info('Viewing booking details', {
      description: `Booking ID: ${booking.external_id} from ${booking.external_source}`,
      duration: 5000,
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    // If switching to import tab, refresh bookings
    if (value === 'import') {
      loadExternalBookings();
    }
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="configure">Configure API</TabsTrigger>
        <TabsTrigger value="test">Test API</TabsTrigger>
        <TabsTrigger value="import">Imported Bookings</TabsTrigger>
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
          onFetch={handleFetchBookings}
          isFetching={isFetching}
          fetchedBookings={fetchedBookings}
          isSaving={isSaving}
          onSaveAll={handleSaveAllBookings}
          saveProgress={saveProgress}
          onTokenReceived={handleTokenReceived}
          hasValidToken={!!oauthToken}
          rawApiResponse={rawApiResponse}
        />
      </TabsContent>

      <TabsContent value="import">
        <ImportTab 
          bookings={externalBookings}
          isLoading={isLoading}
          onSaveBooking={handleImportBooking}
          onViewDetails={handleViewBookingDetails}
          refreshBookings={() => {
            return loadExternalBookings(); // Explicitly return the Promise to match the expected type
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
