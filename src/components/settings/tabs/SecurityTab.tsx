
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const SecurityTab = () => {
  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button className="w-full">Update Password</Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure your account security options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Switch id="twoFactor" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sessionTimeout">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out after 2 hours of inactivity.</p>
            </div>
            <Switch id="sessionTimeout" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ipRestriction">IP Restriction</Label>
              <p className="text-sm text-muted-foreground">Restrict login to specific IP addresses.</p>
            </div>
            <Switch id="ipRestriction" />
          </div>
          <Button className="w-full">Save Security Settings</Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient md:col-span-2">
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
          <CardDescription>Manage your active login sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chrome on Windows</p>
                  <p className="text-sm text-muted-foreground">Last active: 2 minutes ago</p>
                  <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.1</p>
                </div>
                <Button variant="outline" size="sm">Current Session</Button>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Safari on MacOS</p>
                  <p className="text-sm text-muted-foreground">Last active: 2 days ago</p>
                  <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.2</p>
                </div>
                <Button variant="destructive" size="sm">Terminate</Button>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mobile App on iPhone</p>
                  <p className="text-sm text-muted-foreground">Last active: 5 days ago</p>
                  <p className="text-xs text-muted-foreground mt-1">IP: 192.168.1.3</p>
                </div>
                <Button variant="destructive" size="sm">Terminate</Button>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">Terminate All Other Sessions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
