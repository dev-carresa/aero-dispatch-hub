
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Key, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface OAuthTokenHandlerProps {
  onTokenReceived: (token: string) => void;
}

export function OAuthTokenHandler({ onTokenReceived }: OAuthTokenHandlerProps) {
  const [token, setToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [receivedAt, setReceivedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(100);
  
  // Calculate time remaining and progress for token expiration
  useEffect(() => {
    if (!receivedAt || !expiresIn) return;
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = (now.getTime() - receivedAt.getTime()) / 1000;
      const remainingSeconds = expiresIn - elapsedSeconds;
      
      if (remainingSeconds <= 0) {
        setProgress(0);
        setToken(""); // Token expired
        clearInterval(intervalId);
      } else {
        const progressValue = (remainingSeconds / expiresIn) * 100;
        setProgress(progressValue);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [receivedAt, expiresIn]);
  
  // Request OAuth token from the edge function
  const getOAuthToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('test-booking-oauth-connection', {
        body: { useStoredCredentials: true }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Failed to get OAuth token");
      }
      
      setToken(data.access_token);
      setExpiresIn(data.expires_in);
      setReceivedAt(new Date());
      onTokenReceived(data.access_token);
      
      toast.success("OAuth token retrieved successfully");
    } catch (error: any) {
      console.error("Error getting OAuth token:", error);
      setError(error.message || "Failed to get OAuth token");
      toast.error(error.message || "Failed to get OAuth token");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="h-5 w-5" />
          OAuth Authentication
        </CardTitle>
        <CardDescription>
          Authenticate with Booking.com API using OAuth to get an access token
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {token ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium">Token Received</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {receivedAt && (
                  <span>Expires in {formatDistanceToNow(new Date(receivedAt.getTime() + expiresIn * 1000))}</span>
                )}
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border overflow-auto max-h-24">
              <code className="text-xs break-all">{token}</code>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              No active token. Please retrieve a new access token to interact with the Booking.com API.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={getOAuthToken} 
          disabled={isLoading} 
          className="w-full"
          variant={token ? "outline" : "default"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Token...
            </>
          ) : token ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Token
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Get OAuth Token
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
