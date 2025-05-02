
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiDocumentation() {
  return (
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
  );
}
