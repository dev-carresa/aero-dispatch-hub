
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Info, Check, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ApiKeyState {
  value: string;
  enabled: boolean;
  status: "connected" | "disconnected" | "error" | "pending";
  lastTested?: string;
}

interface ApiCategory {
  name: string;
  description: string;
  apis: ApiDefinition[];
}

interface ApiDefinition {
  title: string;
  description: string;
  keys: {
    [key: string]: {
      label: string;
      placeholder: string;
      info?: string;
      sensitive?: boolean;
    }
  };
}

export function ApiSettings() {
  // Define API categories
  const apiCategories: ApiCategory[] = [
    {
      name: "payment",
      description: "Payment processing integrations",
      apis: [
        {
          title: "Stripe Payments",
          description: "Connect to Stripe for payment processing",
          keys: {
            stripePublishableKey: {
              label: "Publishable Key",
              placeholder: "Enter Stripe publishable key",
              info: "Publishable keys are safe to expose in your frontend code."
            },
            stripeSecretKey: {
              label: "Secret Key",
              placeholder: "Enter Stripe secret key",
              info: "Secret keys should only be stored on your server.",
              sensitive: true
            }
          }
        },
        {
          title: "Payzone Integration",
          description: "Connect to Payzone payment services",
          keys: {
            payzoneApiKey: {
              label: "API Key",
              placeholder: "Enter Payzone API key",
              sensitive: true
            },
            payzoneSecretKey: {
              label: "Secret Key",
              placeholder: "Enter Payzone secret key",
              sensitive: true
            }
          }
        }
      ]
    },
    {
      name: "services",
      description: "Essential service integrations",
      apis: [
        {
          title: "Booking System Integration",
          description: "Connect to the main booking platform",
          keys: {
            bookingSystemProductKey: {
              label: "Product Key",
              placeholder: "Enter product key",
              sensitive: true
            },
            bookingSystemSecretKey: {
              label: "Secret Key", 
              placeholder: "Enter secret key",
              sensitive: true
            }
          }
        },
        {
          title: "Currency Exchange API",
          description: "Real-time currency conversion rates",
          keys: {
            currencyExchangeApiKey: {
              label: "API Key",
              placeholder: "Enter currency exchange API key",
              sensitive: true
            }
          }
        }
      ]
    },
    {
      name: "mapping",
      description: "Location and mapping services",
      apis: [
        {
          title: "Google Maps API",
          description: "Maps, location services and route planning",
          keys: {
            googleMapsApiKey: {
              label: "Maps JavaScript API Key",
              placeholder: "Enter Google Maps API key",
              sensitive: true
            }
          }
        }
      ]
    },
    {
      name: "travel",
      description: "Travel and transportation services",
      apis: [
        {
          title: "Flight Tracking Service",
          description: "Real-time flight status and tracking",
          keys: {
            flightTrackingApiKey: {
              label: "API Key",
              placeholder: "Enter flight tracking API key",
              sensitive: true
            }
          }
        }
      ]
    },
    {
      name: "reviews",
      description: "Customer review integrations",
      apis: [
        {
          title: "TrustPilot Reviews",
          description: "Integrate TrustPilot review system",
          keys: {
            trustPilotApiKey: {
              label: "API Key",
              placeholder: "Enter TrustPilot API key",
              sensitive: true
            }
          }
        }
      ]
    },
    {
      name: "other",
      description: "Other API integrations",
      apis: [
        {
          title: "RapidAPI",
          description: "Access multiple APIs through RapidAPI",
          keys: {
            rapidApiKey: {
              label: "API Key",
              placeholder: "Enter RapidAPI key",
              sensitive: true
            }
          }
        }
      ]
    }
  ];

  // Initialize API keys state
  const [apiKeysState, setApiKeysState] = useState<Record<string, Record<string, ApiKeyState>>>(() => {
    const initialState: Record<string, Record<string, ApiKeyState>> = {};
    
    apiCategories.forEach(category => {
      initialState[category.name] = {};
      
      category.apis.forEach(api => {
        Object.keys(api.keys).forEach(keyName => {
          initialState[category.name][keyName] = {
            value: "",
            enabled: false,
            status: "disconnected"
          };
        });
      });
    });
    
    return initialState;
  });

  // Handle API enable/disable toggle
  const handleApiToggle = (category: string, apiTitle: string, enabled: boolean) => {
    const updatedState = { ...apiKeysState };
    
    // Find all keys related to this API and update their enabled state
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          if (updatedState[category][keyName]) {
            updatedState[category][keyName].enabled = enabled;
            // Set status to pending when enabled, disconnected when disabled
            updatedState[category][keyName].status = enabled ? "pending" : "disconnected";
          }
        });
      }
    });
    
    setApiKeysState(updatedState);
    
    toast(`${apiTitle} ${enabled ? "enabled" : "disabled"}`, {
      description: enabled 
        ? "API integration has been enabled. Please configure your API keys." 
        : "API integration has been disabled.",
    });
  };

  // Handle API key input changes
  const handleApiKeyChange = (category: string, keyName: string, value: string) => {
    setApiKeysState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [keyName]: {
          ...prev[category][keyName],
          value: value,
          // Reset status to pending if the value is changed
          status: value ? "pending" : "disconnected"
        }
      }
    }));
  };

  // Test API connection
  const testApiConnection = (category: string, apiTitle: string) => {
    const updatedState = { ...apiKeysState };
    let allKeysProvided = true;
    let keysToTest: string[] = [];
    
    // Find all keys for this API
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          keysToTest.push(keyName);
          if (!updatedState[category][keyName].value) {
            allKeysProvided = false;
          }
        });
      }
    });
    
    if (!allKeysProvided) {
      toast("Missing API Keys", {
        description: "Please provide all required API keys before testing the connection.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API connection test
    toast("Testing API Connection", {
      description: `Testing connection to ${apiTitle}...`
    });
    
    // Simulate connection test with timeout
    setTimeout(() => {
      // For demo: randomly succeed or fail (80% success rate)
      const success = Math.random() > 0.2;
      
      keysToTest.forEach(keyName => {
        updatedState[category][keyName].status = success ? "connected" : "error";
        updatedState[category][keyName].lastTested = new Date().toISOString();
      });
      
      setApiKeysState(updatedState);
      
      if (success) {
        toast("Connection Successful", {
          description: `Successfully connected to ${apiTitle}.`,
        });
      } else {
        toast("Connection Failed", {
          description: `Failed to connect to ${apiTitle}. Please check your API keys.`,
          variant: "destructive"
        });
      }
    }, 1500);
  };

  // Save API keys
  const handleSaveApiKeys = () => {
    // Here you would typically save the API keys to your backend
    console.log("Saving API keys:", apiKeysState);
    toast.success("API settings saved successfully!");
  };

  // Reset to default
  const handleResetApiKeys = () => {
    const resetState: Record<string, Record<string, ApiKeyState>> = {};
    
    apiCategories.forEach(category => {
      resetState[category.name] = {};
      
      category.apis.forEach(api => {
        Object.keys(api.keys).forEach(keyName => {
          resetState[category.name][keyName] = {
            value: "",
            enabled: false,
            status: "disconnected"
          };
        });
      });
    });
    
    setApiKeysState(resetState);
    toast.success("API keys reset to default");
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: ApiKeyState['status']) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3 mr-1" /> Connected</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Error</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Setup</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  // Helper function to check if any key in an API is enabled
  const isApiEnabled = (category: string, apiTitle: string): boolean => {
    let enabled = false;
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          if (apiKeysState[category][keyName]?.enabled) {
            enabled = true;
          }
        });
      }
    });
    return enabled;
  };

  // Helper to get all keys for a specific API
  const getKeysForApi = (category: string, apiTitle: string): string[] => {
    const keys: string[] = [];
    apiCategories.find(c => c.name === category)?.apis.forEach(api => {
      if (api.title === apiTitle) {
        Object.keys(api.keys).forEach(keyName => {
          keys.push(keyName);
        });
      }
    });
    return keys;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">API Integrations</h2>
          <p className="text-muted-foreground">
            Configure your API keys and external service connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search APIs..." 
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          {apiCategories.map((category) => (
            <TabsTrigger key={category.name} value={category.name} className="capitalize">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {apiCategories.map((category) => (
          <TabsContent key={category.name} value={category.name} className="animate-fade-in">
            <div className="grid gap-6">
              {category.apis.map((api) => (
                <Card key={api.title} className="hover-scale shadow-sm card-gradient overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{api.title}</CardTitle>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{api.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <CardDescription>{api.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getKeysForApi(category.name, api.title).some(
                          key => apiKeysState[category.name][key].status !== "disconnected"
                        ) && renderStatusBadge(
                          getKeysForApi(category.name, api.title).some(
                            key => apiKeysState[category.name][key].status === "connected"
                          ) 
                            ? "connected" 
                            : getKeysForApi(category.name, api.title).some(
                                key => apiKeysState[category.name][key].status === "error"
                              )
                                ? "error"
                                : "pending"
                        )}
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${api.title}-toggle`} className="text-sm mr-1">
                            {isApiEnabled(category.name, api.title) ? "Enabled" : "Disabled"}
                          </Label>
                          <Switch 
                            id={`${api.title}-toggle`}
                            checked={isApiEnabled(category.name, api.title)}
                            onCheckedChange={(checked) => handleApiToggle(category.name, api.title, checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(api.keys).map(([keyName, keyConfig]) => (
                        <div key={keyName} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={keyName} className="flex items-center gap-1">
                              {keyConfig.label}
                              {keyConfig.info && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{keyConfig.info}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </Label>
                            {apiKeysState[category.name][keyName]?.lastTested && (
                              <span className="text-xs text-muted-foreground">
                                Last tested: {new Date(apiKeysState[category.name][keyName].lastTested!).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <Input 
                            id={keyName} 
                            type={keyConfig.sensitive ? "password" : "text"}
                            value={apiKeysState[category.name][keyName]?.value || ""}
                            onChange={(e) => handleApiKeyChange(category.name, keyName, e.target.value)}
                            placeholder={keyConfig.placeholder}
                            disabled={!apiKeysState[category.name][keyName]?.enabled}
                          />
                        </div>
                      ))}
                    </div>
                    {isApiEnabled(category.name, api.title) && (
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => testApiConnection(category.name, api.title)}
                          disabled={!isApiEnabled(category.name, api.title)}
                        >
                          Test Connection
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={handleResetApiKeys}>Reset to Default</Button>
        <Button onClick={handleSaveApiKeys}>Save API Settings</Button>
      </div>
    </div>
  );
}
