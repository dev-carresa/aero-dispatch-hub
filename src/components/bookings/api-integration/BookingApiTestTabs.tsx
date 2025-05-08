
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { supabase } from "@/integrations/supabase/client";
import { ConfigureTab } from "./tabs/ConfigureTab";
import { TestTab } from "./tabs/TestTab";
import { ImportTab } from "./tabs/ImportTab";

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

export function BookingApiTestTabs() {
  const [activeTab, setActiveTab] = useState("configure");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "loading">("loading");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [oauthToken, setOauthToken] = useState<string>("");
  const [fetchedBookings, setFetchedBookings] = useState<BookingComBooking[]>([]);
  const [externalBookings, setExternalBookings] = useState<ExternalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  
  // Load API configuration and check connection status
  useEffect(() => {
    const loadApiConfig = async () => {
      try {
        setConnectionStatus("loading");
        
        // Since we're using static credentials, we can set connected status directly
        setApiKey(STATIC_CREDENTIALS.username);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Error loading API configuration:', error);
        setConnectionStatus('error');
      }
    };
    
    loadApiConfig();
  }, []);
  
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
  
  // Handle API configuration update
  const handleConfigSaved = () => {
    // Use static credentials instead of loading from database
    setApiKey(STATIC_CREDENTIALS.username);
    setConnectionStatus('connected');
  };
  
  // Handle connection status change
  const handleConnectionChange = (status: "connected" | "disconnected" | "error") => {
    setConnectionStatus(status);
  };
  
  // Handle OAuth token received
  const handleTokenReceived = (token: string) => {
    setOauthToken(token);
    setConnectionStatus('connected');
  };
  
  // Handle fetch bookings with static credentials
  const handleFetchBookings = async (params: any) => {
    try {
      setIsFetching(true);
      
      // Use the external booking service with static credentials
      const response = await supabase.functions.invoke('fetch-external-bookings', {
        body: { 
          source: 'booking.com',
          params,
          credentials: {
            username: STATIC_CREDENTIALS.username,
            password: STATIC_CREDENTIALS.password
          }
        }
      });
      
      if (response.error) {
        throw response.error;
      }
      
      const data = response.data;
      
      if (data.bookings && Array.isArray(data.bookings)) {
        setFetchedBookings(data.bookings);
        setActiveTab('test');
        toast.success(`Retrieved ${data.bookings.length} bookings from Booking.com`);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        toast.warning('No bookings found matching your criteria');
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
    // Logic to save a single booking to our system will be implemented in a future update
    toast.info('This functionality will be implemented in a future update');
  };
  
  // Handle view booking details
  const handleViewBookingDetails = (booking: ExternalBooking) => {
    // Logic to view booking details will be implemented in a future update
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
          onConnectionChange={handleConnectionChange}
          onConfigSaved={handleConfigSaved}
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
