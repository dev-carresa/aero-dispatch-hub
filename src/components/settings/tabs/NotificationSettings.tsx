
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function NotificationSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    bookings: true,
    cancellations: true,
    payments: true,
    reviews: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    bookings: true,
    cancellations: true,
    payments: false,
    reviews: false
  });

  const handleEmailNotificationChange = (key: string, value: boolean) => {
    setEmailNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePushNotificationChange = (key: string, value: boolean) => {
    setPushNotifications(prev => ({ ...prev, [key]: value }));
  };

  const saveNotificationPreferences = async () => {
    if (!user) {
      toast.error("You must be logged in to update notification preferences");
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would save to the database
      // Here we're simulating an API call
      // const { error } = await supabase
      //   .from('notification_preferences')
      //   .upsert({
      //     user_id: user.id,
      //     email_notifications: emailNotifications,
      //     push_notifications: pushNotifications
      //   });
      
      // if (error) throw error;
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Notification preferences saved successfully!");
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Control how and when you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailBookings">New Bookings</Label>
              <Switch 
                id="emailBookings" 
                checked={emailNotifications.bookings}
                onCheckedChange={(checked) => handleEmailNotificationChange("bookings", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailCancellations">Cancellations</Label>
              <Switch 
                id="emailCancellations" 
                checked={emailNotifications.cancellations}
                onCheckedChange={(checked) => handleEmailNotificationChange("cancellations", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailPayments">Payments</Label>
              <Switch 
                id="emailPayments"
                checked={emailNotifications.payments}
                onCheckedChange={(checked) => handleEmailNotificationChange("payments", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailReviews">Customer Reviews</Label>
              <Switch 
                id="emailReviews"
                checked={emailNotifications.reviews}
                onCheckedChange={(checked) => handleEmailNotificationChange("reviews", checked)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="pushBookings">New Bookings</Label>
              <Switch 
                id="pushBookings"
                checked={pushNotifications.bookings}
                onCheckedChange={(checked) => handlePushNotificationChange("bookings", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushCancellations">Cancellations</Label>
              <Switch 
                id="pushCancellations"
                checked={pushNotifications.cancellations}
                onCheckedChange={(checked) => handlePushNotificationChange("cancellations", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushPayments">Payments</Label>
              <Switch 
                id="pushPayments"
                checked={pushNotifications.payments}
                onCheckedChange={(checked) => handlePushNotificationChange("payments", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushReviews">Customer Reviews</Label>
              <Switch 
                id="pushReviews"
                checked={pushNotifications.reviews}
                onCheckedChange={(checked) => handlePushNotificationChange("reviews", checked)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        <Button 
          className="w-full" 
          onClick={saveNotificationPreferences}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Notification Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
