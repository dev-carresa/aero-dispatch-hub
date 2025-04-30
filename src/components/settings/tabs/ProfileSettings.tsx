
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function ProfileSettings() {
  const [profileInfo, setProfileInfo] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 000-0000"
  });
  
  const [preferences, setPreferences] = useState({
    newsletter: false,
    marketing: false
  });

  const handleProfileInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePreferencesChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateProfile = () => {
    // Update profile logic here
    toast.success("Profile updated successfully!");
  };

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
            <Input 
              id="fullName" 
              placeholder="John Doe" 
              value={profileInfo.fullName}
              onChange={handleProfileInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john@example.com" 
              value={profileInfo.email}
              onChange={handleProfileInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="+1 (555) 000-0000" 
              value={profileInfo.phone}
              onChange={handleProfileInfoChange}
            />
          </div>
          <Button className="w-full" onClick={updateProfile}>Update Profile</Button>
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
              <Switch 
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) => handlePreferencesChange("newsletter", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing Communications</Label>
              <Switch 
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) => handlePreferencesChange("marketing", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
