
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
        
        // Check if OAuth credentials are configured
        const { data: clientIdData } = await supabase
          .from('api_integrations')
          .select('key_value, status')
          .eq('key_name', 'bookingComClientId')
          .maybeSingle();
          
        const { data: clientSecretData } = await supabase
          .from('api_integrations')
          .select('key_value')
          .eq('key_name', 'bookingComClientSecret')
          .maybeSingle();
          
        if (clientIdData?.key_value && clientSecretData?.key_value) {
          setApiKey(clientIdData.key_value);
          
          if (clientIdData.status === 'connected') {
            setConnectionStatus('connected');
          } else if (clientIdData.status === 'error') {
            setConnectionStatus('error');
          } else {
            setConnectionStatus('disconnected');
          }
        } else {
          setConnectionStatus('disconnected');
        }
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
    // Reload the API configuration
    const loadApiConfig = async () => {
      try {
        const { data: clientIdData } = await supabase
          .from('api_integrations')
          .select('key_value')
          .eq('key_name', 'bookingComClientId')
          .maybeSingle();
          
        const { data: clientSecretData } = await supabase
          .from('api_integrations')
          .select('key_value')
          .eq('key_name', 'bookingComClientSecret')
          .maybeSingle();
          
        if (clientIdData?.key_value && clientSecretData?.key_value) {
          setApiKey(clientIdData.key_value);
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.error('Error loading API configuration:', error);
      }
    };
    
    loadApiConfig();
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
  
  // Handle fetch bookings
  const handleFetchBookings = async (params: any) => {
    try {
      setIsFetching(true);
      
      if (!oauthToken) {
        toast.error('OAuth token is required. Please get an OAuth token first.');
        setActiveTab('configure');
        return;
      }
      
      // Use the external booking service with the OAuth token
      const response = await supabase.functions.invoke('fetch-external-bookings', {
        body: { 
          source: 'booking.com',
          params,
          token: oauthToken
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
      
      // If token error, clear the token
      if (error.message?.includes('401') || error.message?.includes('unauthorized') || error.message?.includes('token')) {
        setOauthToken('');
        toast.error('OAuth token may have expired. Please get a new token.');
      }
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
        <AlertTitle>OAuth Integration Test</AlertTitle>
        <AlertDescription>
          This page allows you to test the Booking.com API integration using OAuth authentication.
          Configure your Client ID and Secret in the Settings page first.
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
            <OAuthTokenHandler onTokenReceived={handleTokenReceived} />
            
            <ApiConnectionStatus 
              apiName="Booking.com" 
              initialStatus={connectionStatus === "loading" ? "disconnected" : connectionStatus}
              onConnectionChange={handleConnectionChange}
            />
          </div>

          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>API Credentials Required</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Make sure you have configured your Booking.com API credentials in the Settings.
              </p>
              <p>
                <Link to="/settings/api" className="text-primary underline underline-offset-4">
                  Go to API Settings
                </Link> and set up your Client ID and Client Secret under the Travel category.
              </p>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FetchControlsForm
                onFetch={handleFetchBookings}
                isLoading={isFetching}
              />
            </div>
            <OAuthTokenHandler onTokenReceived={handleTokenReceived} />
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
