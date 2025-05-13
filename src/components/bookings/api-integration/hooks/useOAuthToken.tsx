
import { useState } from "react";
import { toast } from "sonner";

export function useOAuthToken() {
  const [oauthToken, setOauthToken] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error" | "loading">("loading");

  // Handle OAuth token received
  const handleTokenReceived = (token: string) => {
    setOauthToken(token);
    setConnectionStatus('connected');
    toast.success("OAuth token saved and ready to use");
  };

  return {
    oauthToken,
    connectionStatus,
    setConnectionStatus,
    handleTokenReceived
  };
}
