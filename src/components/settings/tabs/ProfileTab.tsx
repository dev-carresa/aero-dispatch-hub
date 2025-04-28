
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ProfileTab = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" />
          </div>
          <Button className="w-full">Update Profile</Button>
        </CardContent>
      </Card>
      
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Avatar & Preferences</CardTitle>
          <CardDescription>Update your profile picture and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">AD</span>
            </div>
            <Button variant="outline" size="sm">Upload Photo</Button>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter">Receive Newsletter</Label>
              <Switch id="newsletter" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing Communications</Label>
              <Switch id="marketing" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
