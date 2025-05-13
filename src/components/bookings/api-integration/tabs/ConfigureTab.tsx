
import { useState } from "react";
import { ApiConnectionStatus } from "@/components/bookings/api-integration/ApiConnectionStatus";

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

interface ConfigureTabProps {
  connectionStatus?: "connected" | "disconnected" | "error" | "loading";
  onConnectionChange?: (status: "connected" | "disconnected" | "error") => void;
  onConfigured?: () => void;
}

export function ConfigureTab({ 
  connectionStatus = "disconnected", 
  onConnectionChange = () => {}, 
  onConfigured = () => {} 
}: ConfigureTabProps) {
  return (
    <div className="space-y-6">
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
          onConnectionChange={(status) => {
            onConnectionChange(status);
            if (status === "connected") {
              onConfigured();
            }
          }}
        />
      </div>
    </div>
  );
}
