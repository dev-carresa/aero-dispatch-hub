
import { PageTitle } from "@/components/ui/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ApiConnectionStatus } from "@/components/bookings/api-integration/ApiConnectionStatus";
import { ApiConfigForm } from "@/components/bookings/api-integration/ApiConfigForm";
import { FetchControlsForm } from "@/components/bookings/api-integration/FetchControlsForm";
import { BookingDataPreview } from "@/components/bookings/api-integration/BookingDataPreview";
import { ExternalBookingsTable } from "@/components/bookings/api-integration/ExternalBookingsTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { usePermission } from "@/context/PermissionContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const BookingApiTest = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("configure");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "loading">("loading");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [fetchedBookings, setFetchedBookings] = useState<BookingComBooking[]>([]);
  const [externalBookings, setExternalBookings] = useState<ExternalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  
  // Check if user has permission to access this page
  useEffect(() => {
    if (!hasPermission('bookings:api_integration')) {
      toast.error("You don't have permission to access this page");
      navigate('/dashboard');
    }
  }, [hasPermission, navigate]);
  
  // Load API configuration and check connection status
  useEffect(() => {
    const loadApiConfig = async () => {
      try {
        setConnectionStatus("loading");
        
        const { data, error } = await supabase
          .from('api_integrations')
          .select('key_value, status')
          .eq('key_name', 'BOOKING_COM_API_KEY')
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setApiKey(data.key_value);
          
          if (data.status === 'connected') {
            setConnectionStatus('connected');
          } else if (data.status === 'error') {
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
        const { data, error } = await supabase
          .from('api_integrations')
          .select('key_value')
          .eq('key_name', 'BOOKING_COM_API_KEY')
          .single();
          
        if (error) throw error;
        
        setApiKey(data?.key_value || null);
        setConnectionStatus('disconnected');
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
  
  // Handle fetch bookings
  const handleFetchBookings = async (params: any) => {
    try {
      setIsFetching(true);
      
      if (connectionStatus !== 'connected') {
        toast.error('API is not connected. Please configure and test the connection first.');
        return;
      }
      
      const response = await externalBookingService.fetchBookingsFromBookingCom(params);
      
      if (response.bookings && Array.isArray(response.bookings)) {
        setFetchedBookings(response.bookings);
        setActiveTab('test');
        toast.success(`Retrieved ${response.bookings.length} bookings from Booking.com`);
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
  
  if (!hasPermission('bookings:api_integration')) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <PageTitle 
        heading="Booking.com API Test"
        text="Configure and test Booking.com API integration"
      />

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Integration Test Page</AlertTitle>
        <AlertDescription>
          This page allows you to test the Booking.com API integration, retrieve sample bookings, and import them into your system.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="configure">Configure API</TabsTrigger>
          <TabsTrigger value="test">Test API</TabsTrigger>
          <TabsTrigger value="import">Imported Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <ApiConnectionStatus 
            apiName="Booking.com" 
            initialStatus={connectionStatus === "loading" ? "disconnected" : connectionStatus}
            onConnectionChange={handleConnectionChange}
          />
          <ApiConfigForm 
            apiName="Booking.com" 
            keyName="BOOKING_COM_API_KEY"
            onConfigSaved={handleConfigSaved}
          />
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FetchControlsForm
                onFetch={handleFetchBookings}
                isLoading={isFetching}
              />
            </div>
            <div>
              <ApiConnectionStatus 
                apiName="Booking.com" 
                initialStatus={connectionStatus === "loading" ? "disconnected" : connectionStatus}
                onConnectionChange={handleConnectionChange}
              />
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
