
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ApiSettings() {
  // State for API keys
  const [apiKeys, setApiKeys] = useState({
    bookingSystemProductKey: "",
    bookingSystemSecretKey: "",
    googleMapsApiKey: "",
    flightTrackingApiKey: "",
    currencyExchangeApiKey: "",
    payzoneApiKey: "",
    payzoneSecretKey: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
    trustPilotApiKey: "",
    rapidApiKey: "",
  });

  // Handle API key input changes
  const handleApiKeyChange = (key: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  // Save API keys
  const handleSaveApiKeys = () => {
    // Here you would typically save the API keys to your backend
    console.log("Saving API keys:", apiKeys);
    toast.success("API keys saved successfully!");
  };

  // Reset to default
  const handleResetApiKeys = () => {
    setApiKeys({
      bookingSystemProductKey: "",
      bookingSystemSecretKey: "",
      googleMapsApiKey: "",
      flightTrackingApiKey: "",
      currencyExchangeApiKey: "",
      payzoneApiKey: "",
      payzoneSecretKey: "",
      stripePublishableKey: "",
      stripeSecretKey: "",
      trustPilotApiKey: "",
      rapidApiKey: "",
    });
    toast.success("API keys reset to default");
  };

  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>API Integration Settings</CardTitle>
          <CardDescription>Configure your API keys and credentials for external services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Booking System Integration */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">Booking System Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookingSystemProductKey">Product Key</Label>
                <Input 
                  id="bookingSystemProductKey" 
                  type="password" 
                  value={apiKeys.bookingSystemProductKey}
                  onChange={(e) => handleApiKeyChange('bookingSystemProductKey', e.target.value)}
                  placeholder="Enter product key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingSystemSecretKey">Secret Key</Label>
                <Input 
                  id="bookingSystemSecretKey" 
                  type="password"
                  value={apiKeys.bookingSystemSecretKey}
                  onChange={(e) => handleApiKeyChange('bookingSystemSecretKey', e.target.value)}
                  placeholder="Enter secret key"
                />
              </div>
            </div>
          </div>

          {/* Google Maps API */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">Google Maps API</h3>
            <div className="space-y-2">
              <Label htmlFor="googleMapsApiKey">Maps JavaScript API Key</Label>
              <Input 
                id="googleMapsApiKey" 
                type="password"
                value={apiKeys.googleMapsApiKey}
                onChange={(e) => handleApiKeyChange('googleMapsApiKey', e.target.value)}
                placeholder="Enter Google Maps API key"
              />
            </div>
          </div>

          {/* Flight Tracking Service */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">Flight Tracking Service</h3>
            <div className="space-y-2">
              <Label htmlFor="flightTrackingApiKey">API Key</Label>
              <Input 
                id="flightTrackingApiKey" 
                type="password"
                value={apiKeys.flightTrackingApiKey}
                onChange={(e) => handleApiKeyChange('flightTrackingApiKey', e.target.value)}
                placeholder="Enter flight tracking API key"
              />
            </div>
          </div>

          {/* Currency Exchange API */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">Currency Exchange API</h3>
            <div className="space-y-2">
              <Label htmlFor="currencyExchangeApiKey">API Key</Label>
              <Input 
                id="currencyExchangeApiKey" 
                type="password"
                value={apiKeys.currencyExchangeApiKey}
                onChange={(e) => handleApiKeyChange('currencyExchangeApiKey', e.target.value)}
                placeholder="Enter currency exchange API key"
              />
            </div>
          </div>

          {/* Payzone Integration */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">Payzone Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payzoneApiKey">API Key</Label>
                <Input 
                  id="payzoneApiKey" 
                  type="password"
                  value={apiKeys.payzoneApiKey}
                  onChange={(e) => handleApiKeyChange('payzoneApiKey', e.target.value)}
                  placeholder="Enter Payzone API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payzoneSecretKey">Secret Key</Label>
                <Input 
                  id="payzoneSecretKey" 
                  type="password"
                  value={apiKeys.payzoneSecretKey}
                  onChange={(e) => handleApiKeyChange('payzoneSecretKey', e.target.value)}
                  placeholder="Enter Payzone secret key"
                />
              </div>
            </div>
          </div>

          {/* Stripe Payments */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">Stripe Payments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                <Input 
                  id="stripePublishableKey" 
                  type="text"
                  value={apiKeys.stripePublishableKey}
                  onChange={(e) => handleApiKeyChange('stripePublishableKey', e.target.value)}
                  placeholder="Enter Stripe publishable key"
                />
                <p className="text-xs text-muted-foreground">Publishable keys are safe to expose in your frontend code.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey">Secret Key</Label>
                <Input 
                  id="stripeSecretKey" 
                  type="password"
                  value={apiKeys.stripeSecretKey}
                  onChange={(e) => handleApiKeyChange('stripeSecretKey', e.target.value)}
                  placeholder="Enter Stripe secret key"
                />
                <p className="text-xs text-muted-foreground">Secret keys should only be stored on your server.</p>
              </div>
            </div>
          </div>

          {/* TrustPilot Reviews */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">TrustPilot Reviews</h3>
            <div className="space-y-2">
              <Label htmlFor="trustPilotApiKey">API Key</Label>
              <Input 
                id="trustPilotApiKey" 
                type="password"
                value={apiKeys.trustPilotApiKey}
                onChange={(e) => handleApiKeyChange('trustPilotApiKey', e.target.value)}
                placeholder="Enter TrustPilot API key"
              />
            </div>
          </div>

          {/* RapidAPI */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">RapidAPI</h3>
            <div className="space-y-2">
              <Label htmlFor="rapidApiKey">API Key</Label>
              <Input 
                id="rapidApiKey" 
                type="password"
                value={apiKeys.rapidApiKey}
                onChange={(e) => handleApiKeyChange('rapidApiKey', e.target.value)}
                placeholder="Enter RapidAPI key"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={handleResetApiKeys}>Reset to Default</Button>
            <Button onClick={handleSaveApiKeys}>Save API Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Access documentation and resources for our API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">REST API Documentation</h3>
              <p className="text-sm text-muted-foreground">Comprehensive guide to our REST APIs</p>
            </div>
            <Button variant="outline" size="sm">View Docs</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">API Changelog</h3>
              <p className="text-sm text-muted-foreground">Recent updates to our APIs</p>
            </div>
            <Button variant="outline" size="sm">View Changes</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Webhook Documentation</h3>
              <p className="text-sm text-muted-foreground">Learn how to use our webhook system</p>
            </div>
            <Button variant="outline" size="sm">View Docs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
