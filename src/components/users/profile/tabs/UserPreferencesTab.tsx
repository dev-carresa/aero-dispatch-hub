
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useState } from "react";

interface UserPreferencesTabProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

interface Preferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark" | "system";
}

// In a real app, these would be stored in the user's profile
const defaultPreferences: Preferences = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  theme: "system",
};

export const UserPreferencesTab = ({ user, onUserUpdate }: UserPreferencesTabProps) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  const handlePreferenceChange = (key: keyof Preferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePreferences = () => {
    // In a real app, this would be an API call
    toast.success("Preferences saved successfully");
    // Would typically update user preferences on the backend
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => 
                handlePreferenceChange("emailNotifications", checked)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via text message
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) => 
                handlePreferenceChange("smsNotifications", checked)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in the app
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => 
                handlePreferenceChange("pushNotifications", checked)
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose your preferred theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.theme}
            onValueChange={(value: "light" | "dark" | "system") => 
              handlePreferenceChange("theme", value)
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">System</Label>
            </div>
          </RadioGroup>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSavePreferences}>Save Theme</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
