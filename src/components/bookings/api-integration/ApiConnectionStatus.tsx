
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { externalBookingService } from "@/services/externalBookingService";
import { toast } from "sonner";

export interface ApiConnectionStatusProps {
  apiName?: string;
  initialStatus?: "connected" | "disconnected" | "error" | "loading";
  onConnectionChange?: (status: "connected" | "disconnected" | "error" | "loading") => void;
  status?: "connected" | "disconnected" | "error" | "loading"; // Added status prop
}

export function ApiConnectionStatus({ 
  apiName = "Booking.com", 
  initialStatus = "disconnected",
  onConnectionChange,
  status: externalStatus, // Renamed to avoid conflict with local state
}: ApiConnectionStatusProps) {
  // Use externalStatus (passed prop) if available, otherwise use initialStatus
  const [status, setStatus] = useState<"connected" | "disconnected" | "error" | "loading">(
    externalStatus || initialStatus
  );
  const [message, setMessage] = useState<string>("");
  
  // Update internal state when external status prop changes
  React.useEffect(() => {
    if (externalStatus) {
      setStatus(externalStatus);
    }
  }, [externalStatus]);
  
  const testConnection = async () => {
    try {
      setStatus("loading");
      setMessage("Testing connection...");
      
      // We currently only support Booking.com
      if (apiName.toLowerCase() === "booking.com") {
        const result = await externalBookingService.testBookingComConnection();
        
        if (result.success) {
          setStatus("connected");
          setMessage(result.message);
          if (onConnectionChange) onConnectionChange("connected");
          toast.success(result.message);
        } else {
          setStatus("error");
          setMessage(result.message);
          if (onConnectionChange) onConnectionChange("error");
          toast.error(result.message);
        }
      } else {
        setStatus("error");
        setMessage(`Testing ${apiName} is not implemented yet.`);
        if (onConnectionChange) onConnectionChange("error");
        toast.error(`Testing ${apiName} is not implemented yet.`);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || `Failed to connect to ${apiName}.`);
      if (onConnectionChange) onConnectionChange("error");
      toast.error(error.message || `Failed to connect to ${apiName}.`);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{apiName} API Connection</CardTitle>
        <CardDescription>Check the connection status to the {apiName} API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === "connected" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Connected</span>
              </>
            )}
            {status === "disconnected" && (
              <>
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Disconnected</span>
              </>
            )}
            {status === "error" && (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Error</span>
              </>
            )}
            {status === "loading" && (
              <>
                <Spinner size="sm" className="text-primary" />
                <span className="text-sm font-medium text-gray-600">Testing...</span>
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testConnection}
            disabled={status === "loading"}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Test Connection
          </Button>
        </div>
        
        {message && (
          <div className={`mt-2 text-sm p-2 rounded ${
            status === "connected" ? "bg-green-50 text-green-700" : 
            status === "error" ? "bg-red-50 text-red-700" : 
            "bg-gray-50 text-gray-600"
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
