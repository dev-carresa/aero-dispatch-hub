
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function NotificationSettings() {
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

  const saveNotificationPreferences = () => {
    // Save notification preferences logic here
    toast.success("Notification preferences saved successfully!");
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
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailCancellations">Cancellations</Label>
              <Switch 
                id="emailCancellations" 
                checked={emailNotifications.cancellations}
                onCheckedChange={(checked) => handleEmailNotificationChange("cancellations", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailPayments">Payments</Label>
              <Switch 
                id="emailPayments"
                checked={emailNotifications.payments}
                onCheckedChange={(checked) => handleEmailNotificationChange("payments", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailReviews">Customer Reviews</Label>
              <Switch 
                id="emailReviews"
                checked={emailNotifications.reviews}
                onCheckedChange={(checked) => handleEmailNotificationChange("reviews", checked)}
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
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushCancellations">Cancellations</Label>
              <Switch 
                id="pushCancellations"
                checked={pushNotifications.cancellations}
                onCheckedChange={(checked) => handlePushNotificationChange("cancellations", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushPayments">Payments</Label>
              <Switch 
                id="pushPayments"
                checked={pushNotifications.payments}
                onCheckedChange={(checked) => handlePushNotificationChange("payments", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushReviews">Customer Reviews</Label>
              <Switch 
                id="pushReviews"
                checked={pushNotifications.reviews}
                onCheckedChange={(checked) => handlePushNotificationChange("reviews", checked)}
              />
            </div>
          </div>
        </div>
        <Button className="w-full" onClick={saveNotificationPreferences}>Save Notification Preferences</Button>
      </CardContent>
    </Card>
  );
}
