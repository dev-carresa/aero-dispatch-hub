
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const NotificationsTab = () => {
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
              <Switch id="emailBookings" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailCancellations">Cancellations</Label>
              <Switch id="emailCancellations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailPayments">Payments</Label>
              <Switch id="emailPayments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailReviews">Customer Reviews</Label>
              <Switch id="emailReviews" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="pushBookings">New Bookings</Label>
              <Switch id="pushBookings" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushCancellations">Cancellations</Label>
              <Switch id="pushCancellations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushPayments">Payments</Label>
              <Switch id="pushPayments" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushReviews">Customer Reviews</Label>
              <Switch id="pushReviews" />
            </div>
          </div>
        </div>
        <Button className="w-full">Save Notification Preferences</Button>
      </CardContent>
    </Card>
  );
};
