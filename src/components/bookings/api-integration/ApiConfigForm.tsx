
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Key, Save } from "lucide-react";

export interface ApiConfigFormProps {
  apiName: string;
  keyName: string;
  onConfigSaved: (values: { apiKey: string; apiSecret?: string }) => void;
  initialValues?: {
    apiKey?: string;
    apiSecret?: string;
  };
}

export function ApiConfigForm({
  apiName,
  keyName,
  onConfigSaved,
  initialValues = {}
}: ApiConfigFormProps) {
  const [apiKey, setApiKey] = useState(initialValues.apiKey || "");
  const [apiSecret, setApiSecret] = useState(initialValues.apiSecret || "");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API key required",
        description: `Please enter a valid ${apiName} API key`,
        variant: "destructive",
      });
      return;
    }
    
    onConfigSaved({ apiKey, apiSecret });
    
    toast({
      title: "Configuration saved",
      description: `${apiName} API configuration has been saved`,
      variant: "default",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">API Credentials</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">{apiName} API Key</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                <Key className="h-4 w-4" />
              </span>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="rounded-l-none"
                placeholder={`Enter your ${apiName} API key`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">{apiName} API Secret (Optional)</Label>
            <Input
              id="apiSecret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              type="password"
              placeholder={`Enter your ${apiName} API secret (if required)`}
            />
          </div>

          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" /> Save Credentials
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
