
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiConnectionStatus } from "@/components/bookings/api-integration/ApiConnectionStatus";
import { ApiConfigForm } from "@/components/bookings/api-integration/ApiConfigForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ConfigureTabProps {
  connectionStatus: "connected" | "disconnected" | "error" | "loading";
  onConnectionChange: (status: "connected" | "disconnected" | "error" | "loading") => void;
  onConfigSaved: () => void;
}

export function ConfigureTab({ 
  connectionStatus, 
  onConnectionChange,
  onConfigSaved 
}: ConfigureTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">API Connection Status</CardTitle>
            <CardDescription>Current status of your Booking.com API connection</CardDescription>
          </CardHeader>
          <CardContent>
            <ApiConnectionStatus 
              status={connectionStatus} 
              onStatusChange={onConnectionChange} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">API Documentation</CardTitle>
            <CardDescription>Resources to help you integrate with Booking.com API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Developer Documentation</AlertTitle>
              <AlertDescription>
                Visit the <a href="https://developers.booking.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Booking.com Developer Portal</a> for detailed API documentation.
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-muted-foreground">
              You'll need to register as a developer to get access to the Booking.com API. 
              Then generate API keys from your developer account.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <ApiConfigForm 
        apiName="Booking.com" 
        keyName="BOOKING_API_KEY" 
        onConfigSaved={onConfigSaved}
      />
      
      <div className="text-sm text-muted-foreground bg-yellow-50 p-4 rounded-md">
        <p className="font-medium">Note about API access:</p>
        <p>
          Booking.com requires verification of your account and may take up to 48 hours to approve your API access request. 
          Test functionality is available immediately with sample data.
        </p>
      </div>
    </div>
  );
}
