
import { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ApiStatusBadge } from "./ApiStatusBadge";
import { ApiKeyField } from "./ApiKeyField";
import { ApiDefinition, ApiKeyState } from "../models/apiSettings";
import { toast } from "sonner";

interface ApiCardProps {
  api: ApiDefinition;
  category: string;
  apiKeysState: Record<string, ApiKeyState>;
  onApiToggle: (enabled: boolean) => void;
  onApiKeyChange: (keyName: string, value: string) => void;
  onTestConnection: () => void;
}

export function ApiCard({
  api,
  category,
  apiKeysState,
  onApiToggle,
  onApiKeyChange,
  onTestConnection
}: ApiCardProps) {
  // Check if any key in the API is enabled
  const isEnabled = Object.keys(api.keys).some(keyName => 
    apiKeysState[keyName]?.enabled
  );

  // Check status for display
  const hasNonDisconnectedStatus = Object.keys(api.keys).some(
    key => apiKeysState[key]?.status !== "disconnected"
  );
  
  const status = Object.keys(api.keys).some(
    key => apiKeysState[key]?.status === "connected"
  )
    ? "connected"
    : Object.keys(api.keys).some(
        key => apiKeysState[key]?.status === "error"
      )
        ? "error"
        : Object.keys(api.keys).some(
            key => apiKeysState[key]?.status === "pending"
          )
            ? "pending"
            : "disconnected";

  return (
    <Card className="hover-scale shadow-sm card-gradient overflow-hidden">
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
            {hasNonDisconnectedStatus && <ApiStatusBadge status={status} />}
            <div className="flex items-center gap-2">
              <Label htmlFor={`${api.title}-toggle`} className="text-sm mr-1">
                {isEnabled ? "Enabled" : "Disabled"}
              </Label>
              <Switch 
                id={`${api.title}-toggle`}
                checked={isEnabled}
                onCheckedChange={onApiToggle}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(api.keys).map(([keyName, keyConfig]) => (
            <ApiKeyField
              key={keyName}
              keyName={keyName}
              keyConfig={keyConfig}
              value={apiKeysState[keyName]?.value || ""}
              onChange={(value) => onApiKeyChange(keyName, value)}
              lastTested={apiKeysState[keyName]?.lastTested}
              disabled={!apiKeysState[keyName]?.enabled}
            />
          ))}
        </div>
        {isEnabled && (
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={onTestConnection}
              disabled={!isEnabled}
            >
              Test Connection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
