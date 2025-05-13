
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { externalBookingService } from "@/services/externalBookingService";
import { Loader2 } from "lucide-react";

interface ApiConnectionStatusProps {
  status: "connected" | "disconnected" | "error" | "loading";
  onStatusChange: (status: "connected" | "disconnected" | "error" | "loading") => void;
}

export function ApiConnectionStatus({ 
  status, 
  onStatusChange 
}: ApiConnectionStatusProps) {
  const [isChecking, setIsChecking] = useState(false);
  
  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);
  
  // Determine color based on status
  const getStatusColor = () => {
    switch(status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-300";
      case "disconnected":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "error":
        return "bg-red-100 text-red-800 border-red-300";
      case "loading":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  // Check status against API
  const checkConnectionStatus = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    onStatusChange("loading");
    
    try {
      const result = await externalBookingService.testBookingComConnection();
      onStatusChange(result.success ? "connected" : "error");
    } catch (error) {
      console.error("Error checking connection status:", error);
      onStatusChange("error");
    } finally {
      setIsChecking(false);
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch(status) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Not Connected";
      case "error":
        return "Connection Error";
      case "loading":
        return "Checking Connection...";
      default:
        return "Unknown";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-md border ${getStatusColor()}`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${status === "connected" ? "bg-green-500" : status === "loading" ? "bg-blue-500" : "bg-red-500"}`}></div>
          <p className="font-medium">{getStatusText()}</p>
        </div>
      </div>
      
      <Button 
        onClick={checkConnectionStatus} 
        disabled={isChecking || status === "loading"}
        variant="outline" 
        className="w-full"
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : "Test Connection"}
      </Button>
    </div>
  );
}
