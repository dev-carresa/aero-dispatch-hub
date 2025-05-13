
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiConfigForm } from "../ApiConfigForm";
import { ApiConnectionStatus } from "../ApiConnectionStatus";
import { externalBookingService } from "@/services/externalBookingService";
import { useToast } from "@/components/ui/use-toast";
import { OAuthTokenHandler } from "../OAuthTokenHandler";
import { CheckCircle } from "lucide-react";

export interface ConfigureTabProps {
  connectionStatus: "connected" | "disconnected" | "error" | "loading";
  onConnectionChange: (status: "connected" | "disconnected" | "error" | "loading") => void;
  onConfigured: () => void;
}

export function ConfigureTab({ 
  connectionStatus,
  onConnectionChange,
  onConfigured 
}: ConfigureTabProps) {
  const [accessToken, setAccessToken] = useState("");
  const { toast } = useToast();

  const handleTestConnection = async () => {
    onConnectionChange("loading");
    
    try {
      const result = await externalBookingService.testBookingComConnection();
      
      if (result.success) {
        onConnectionChange("connected");
        toast({
          title: "Connection successful",
          description: "Successfully connected to the Booking.com API",
          variant: "default",
        });
      } else {
        onConnectionChange("error");
        toast({
          title: "Connection failed",
          description: result.message || "Failed to connect to the Booking.com API",
          variant: "destructive",
        });
      }
    } catch (error) {
      onConnectionChange("error");
      toast({
        title: "Connection error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleTokenReceived = (token: string) => {
    setAccessToken(token);
  };

  const handleConfigureComplete = () => {
    onConfigured();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">API Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure your connection to the Booking.com API
        </p>
      </div>
      
      <ApiConnectionStatus status={connectionStatus} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApiConfigForm />
        <OAuthTokenHandler onTokenReceived={handleTokenReceived} />
      </div>
      
      <div className="flex space-x-4 pt-4">
        <Button onClick={handleTestConnection} variant="outline">
          Test Connection
        </Button>
        <Button
          onClick={handleConfigureComplete}
          disabled={connectionStatus !== "connected"}
        >
          {connectionStatus === "connected" ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Continue to Test
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
