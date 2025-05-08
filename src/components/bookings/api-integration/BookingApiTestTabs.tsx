
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { ConfigureTab } from "./tabs/ConfigureTab";
import { TestTab } from "./tabs/TestTab";
import { ImportTab } from "./tabs/ImportTab";

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
  
  // Load existing external bookings
  useEffect(() => {
    const loadExternalBookings = async () => {
      try {
        setIsLoading(true);
        const bookings = await externalBookingService.getExternalBookings('booking.com');
        setExternalBookings(bookings);
      } catch (error) {
        console.error('Error loading external bookings:', error);
        toast.error('Failed to load external bookings');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExternalBookings();
  }, []);
  
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
    if (!fetchedBookings || fetchedBookings.length === 0) return;
    
    try {
      setIsSaving(true);
      setSaveProgress({ current: 0, total: fetchedBookings.length });
      
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
        const updatedBookings = await externalBookingService.getExternalBookings('booking.com');
        setExternalBookings(updatedBookings);
        
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
  
  // Handle save single booking
  const handleSaveBooking = async (booking: ExternalBooking) => {
    toast.info('This functionality will be implemented in a future update');
  };
  
  // Handle view booking details
  const handleViewBookingDetails = (booking: ExternalBooking) => {
    toast.info('This functionality will be implemented in a future update');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        />
      </TabsContent>

      <TabsContent value="import">
        <ImportTab 
          bookings={externalBookings}
          isLoading={isLoading}
          onSaveBooking={handleSaveBooking}
          onViewDetails={handleViewBookingDetails}
        />
      </TabsContent>
    </Tabs>
  );
}
