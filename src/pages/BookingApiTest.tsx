import { PageTitle } from "@/components/ui/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ApiConnectionStatus } from "@/components/bookings/api-integration/ApiConnectionStatus";
import { ApiConfigForm } from "@/components/bookings/api-integration/ApiConfigForm";
import { FetchControlsForm } from "@/components/bookings/api-integration/FetchControlsForm";
import { BookingDataPreview } from "@/components/bookings/api-integration/BookingDataPreview";
import { ExternalBookingsTable } from "@/components/bookings/api-integration/ExternalBookingsTable";
import { OAuthTokenHandler } from "@/components/bookings/api-integration/OAuthTokenHandler";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

const BookingApiTest = () => {
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex justify-between items-start">
        <PageTitle 
          heading="Booking.com API Test"
          text="Configure and test Booking.com API integration"
        />
        
        <Link to="/settings/api">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Settings
          </Button>
        </Link>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Static Authentication</AlertTitle>
        <AlertDescription>
          This page uses static credentials for testing the Booking.com API integration.
          The connection should already be established with the provided credentials.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="configure">Configure API</TabsTrigger>
          <TabsTrigger value="test">Test API</TabsTrigger>
          <TabsTrigger value="import">Imported Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-4">Static Authentication Credentials</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Username:</p>
                  <code className="bg-muted p-2 rounded block text-sm">{STATIC_CREDENTIALS.username}</code>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Password:</p>
                  <code className="bg-muted p-2 rounded block text-sm">*********************</code>
                </div>
              </div>
            </div>
            
            <ApiConnectionStatus 
              apiName="Booking.com" 
              initialStatus={connectionStatus === "loading" ? "disconnected" : connectionStatus}
              onConnectionChange={handleConnectionChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FetchControlsForm
                onFetch={handleFetchBookings}
                isLoading={isFetching}
              />
            </div>
            <div className="p-6 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-4">Static Authentication Active</h3>
              <p className="text-sm text-muted-foreground">
                Using static credentials for API requests. No OAuth token required.
              </p>
            </div>
          </div>

          {fetchedBookings.length > 0 && (
            <BookingDataPreview
              bookings={fetchedBookings}
              isLoading={isSaving}
              onSaveAll={handleSaveAllBookings}
              currentProgress={saveProgress.current}
              totalProgress={saveProgress.total}
            />
          )}
        </TabsContent>

        <TabsContent value="import">
          <ExternalBookingsTable
            bookings={externalBookings}
            isLoading={isLoading}
            onSaveBooking={handleSaveBooking}
            onViewDetails={handleViewBookingDetails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingApiTest;
