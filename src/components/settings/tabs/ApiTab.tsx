
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ApiTab = () => {
  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for development integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Production Key</p>
                <p className="text-sm text-muted-foreground">Created: Apr 15, 2025</p>
                <div className="mt-2 flex items-center">
                  <Input 
                    className="font-mono text-sm" 
                    value="sk_live_xxxxxxxxxxxxxxxxxxxx" 
                    readOnly 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Copy</Button>
                <Button variant="destructive" size="sm">Revoke</Button>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Development Key</p>
                <p className="text-sm text-muted-foreground">Created: Apr 10, 2025</p>
                <div className="mt-2 flex items-center">
                  <Input 
                    className="font-mono text-sm" 
                    value="sk_test_xxxxxxxxxxxxxxxxxxxx" 
                    readOnly 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Copy</Button>
                <Button variant="destructive" size="sm">Revoke</Button>
              </div>
            </div>
          </div>
          <Button>Generate New API Key</Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Monitor your API usage and rate limits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Daily Requests (2,430 / 10,000)</Label>
                <span className="text-xs text-muted-foreground">24.3%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '24.3%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Monthly Bandwidth (156MB / 1GB)</Label>
                <span className="text-xs text-muted-foreground">15.6%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '15.6%' }}></div>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-2">Recent API Requests</h4>
              <div className="text-sm border rounded-md divide-y">
                <div className="p-3 flex justify-between">
                  <span>GET /api/bookings</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>POST /api/bookings/create</span>
                  <span className="text-muted-foreground">5 min ago</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>GET /api/vehicles</span>
                  <span className="text-muted-foreground">10 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
