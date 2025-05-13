
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ApiConfigFormProps {
  apiName: string;
  keyName: string;
  onConfigSaved: () => void;
}

export function ApiConfigForm({ apiName, keyName, onConfigSaved }: ApiConfigFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !apiSecret) {
      toast.error("API key and secret are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save API credentials
      const { error } = await supabase
        .from('api_integrations')
        .upsert([
          {
            key_name: keyName,
            api_key: apiKey,
            api_secret: apiSecret,
            status: 'connected',
            last_updated: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      toast.success(`${apiName} API configuration saved successfully`);
      onConfigSaved();
    } catch (error: any) {
      console.error("Error saving API config:", error);
      toast.error(error.message || `Failed to save ${apiName} API configuration`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{apiName} API Configuration</CardTitle>
        <CardDescription>
          Enter your {apiName} API credentials to connect to the service
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              placeholder={`Enter your ${apiName} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder={`Enter your ${apiName} API secret`}
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="ml-auto" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
