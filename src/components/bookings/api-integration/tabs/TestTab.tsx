
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDataPreview } from "../BookingDataPreview";
import { useToast } from "@/components/ui/use-toast";
import { externalBookingService } from "@/services/externalBookingService";
import { BookingComBooking } from "@/types/externalBooking";
import { CheckCircle, Code, Database, Loader2 } from "lucide-react";

export interface TestTabProps {
  onSuccess: () => void;
}

export function TestTab({ onSuccess }: TestTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testMode, setTestMode] = useState<"sample" | "live">("sample");
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();
  
  // Sample booking for testing
  const sampleBooking: BookingComBooking = {
    id: "sample-123",
    reference: "SAMPLE-123",
    check_in: "2025-06-15",
    check_out: "2025-06-18",
    status: "CONFIRMED",
    guest: {
      first_name: "John",
      last_name: "Sample",
      email: "john.sample@example.com",
      phone: "+1234567890"
    },
    property: {
      name: "Sample Hotel",
      address: "123 Sample Street, Sample City, SC 12345",
      location: {
        coordinates: {
          latitude: 40.7128,
          longitude: -74.006
        }
      }
    },
    price_details: {
      total_price: 350.00,
      currency: "USD"
    },
    room_details: {
      guests: 2
    },
    pickup_date_time: "2025-06-15T14:00:00",
    pickup: {
      address: "Airport Terminal 1, Sample City International Airport",
      coordinates: {
        latitude: 40.6413,
        longitude: -73.7781
      }
    },
    dropoff: {
      address: "123 Sample Street, Sample City, SC 12345",
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006
      }
    }
  };
  
  // Live test - fetch real data from Booking.com API
  const handleLiveTest = async () => {
    setIsLoading(true);
    
    try {
      const response = await externalBookingService.fetchBookingsFromBookingCom({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      setTestResponse(response);
      
      if (response.success === false || !response.bookings || response.bookings.length === 0) {
        toast({
          title: "Test completed",
          description: "API connection successful, but no bookings were found. You can proceed to import.",
          variant: "default",
        });
      } else {
        toast({
          title: "Test successful",
          description: `Found ${response.bookings.length} bookings from the API.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Live test error:", error);
      setTestResponse({ error: error instanceof Error ? error.message : "Unknown error occurred" });
      
      toast({
        title: "Test failed",
        description: error instanceof Error ? error.message : "Failed to test API connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save the test booking (sample or first live booking)
  const handleSaveBooking = async () => {
    setIsLoading(true);
    setSaveProgress({ current: 1, total: 1 });
    
    try {
      const bookingsToSave = testMode === "sample" ? 
        [sampleBooking] : 
        (testResponse?.bookings && testResponse.bookings.length > 0 ? [testResponse.bookings[0]] : []);
      
      if (bookingsToSave.length === 0) {
        toast({
          title: "No booking to save",
          description: "Please run a test first or switch to sample mode.",
          variant: "destructive",
        });
        setIsLoading(false);
        setSaveProgress({ current: 0, total: 0 });
        return;
      }
      
      const result = await externalBookingService.saveExternalBookings(
        bookingsToSave,
        'booking.com'
      );
      
      if (result.success) {
        toast({
          title: "Test save successful",
          description: `Successfully saved test booking. You can now proceed to import.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Test save failed",
          description: result.message || "Failed to save test booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error saving test booking",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };
  
  const handleProceedToImport = () => {
    onSuccess();
  };
  
  const getBookingsToDisplay = (): BookingComBooking[] => {
    if (testMode === "sample") {
      return [sampleBooking];
    } else if (testResponse?.bookings && testResponse.bookings.length > 0) {
      return testResponse.bookings;
    }
    return [];
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Test API Connection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Validate your connection and test importing a booking
        </p>
      </div>
      
      <Tabs value={testMode} onValueChange={(value) => setTestMode(value as "sample" | "live")}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="sample" className="flex-1">
            <Code className="mr-2 h-4 w-4" />
            Sample Data
          </TabsTrigger>
          <TabsTrigger value="live" className="flex-1">
            <Database className="mr-2 h-4 w-4" />
            Live API Test
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sample" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Booking Data</CardTitle>
              <CardDescription>
                Test with sample booking data without calling the API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This allows you to test the import functionality with a pre-defined sample booking.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveBooking} 
                disabled={isLoading}
                className="mr-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Sample Booking"
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleProceedToImport}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Continue to Import
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="live" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Live API Test</CardTitle>
              <CardDescription>
                Test fetching real booking data from the API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                This will try to fetch recent bookings from your Booking.com account.
              </p>
              <div className="flex">
                <Button 
                  onClick={handleLiveTest} 
                  disabled={isLoading}
                  className="mr-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Run Live Test"
                  )}
                </Button>
                {testResponse && (
                  <Button 
                    onClick={handleSaveBooking} 
                    disabled={isLoading || !(testResponse?.bookings && testResponse.bookings.length > 0)}
                    variant="secondary"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save First Booking"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={handleProceedToImport}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Continue to Import
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Display bookings preview based on the selected mode */}
      <BookingDataPreview
        bookings={getBookingsToDisplay()}
        isLoading={isLoading}
        onSaveAll={handleSaveBooking}
        currentProgress={saveProgress.current}
        totalProgress={saveProgress.total}
      />
    </div>
  );
}
