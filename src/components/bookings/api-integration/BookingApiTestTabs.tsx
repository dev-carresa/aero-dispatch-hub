
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ConfigureTab } from "./tabs/ConfigureTab";
import { TestTab } from "./tabs/TestTab";
import { useAuth } from "@/context/AuthContext";
import { useBookingData } from "./hooks/useBookingData";
import { useOAuthToken } from "./hooks/useOAuthToken";

export function BookingApiTestTabs() {
  const [activeTab, setActiveTab] = useState("configure");
  const { user } = useAuth();
  
  // Use our custom hooks
  const { oauthToken, connectionStatus, setConnectionStatus, handleTokenReceived } = useOAuthToken();
  const { 
    fetchedBookings, 
    isFetching, 
    isPaginationLoading, 
    isSaving, 
    saveProgress, 
    rawApiResponse, 
    totalBookingsLoaded, 
    handleFetchBookings, 
    handleLoadMoreBookings, 
    handleSaveBookings, 
    getNextLink 
  } = useBookingData(user);
  
  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.warning("Please log in to save and manage bookings");
    }
  }, [user]);
  
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
          onFetch={() => handleFetchBookings(oauthToken)}
          isFetching={isFetching}
          fetchedBookings={fetchedBookings || []} 
          isSaving={isSaving}
          onSaveAll={handleSaveBookings}
          saveProgress={saveProgress}
          onTokenReceived={handleTokenReceived}
          hasValidToken={!!oauthToken}
          rawApiResponse={rawApiResponse}
          hasNextPage={!!getNextLink()}
          onLoadMore={() => handleLoadMoreBookings(oauthToken)}
          isPaginationLoading={isPaginationLoading}
          totalBookingsLoaded={totalBookingsLoaded}
        />
      </TabsContent>
    </Tabs>
  );
}
