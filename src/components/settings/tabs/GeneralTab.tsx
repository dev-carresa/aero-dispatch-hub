
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const GeneralTab = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details shown on invoices and communications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" placeholder="Transport Co." defaultValue="Transport Co." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea id="companyAddress" placeholder="Company address" defaultValue="123 Transport St, New York, NY 10001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT Number</Label>
            <Input id="taxId" placeholder="Tax ID or VAT number" defaultValue="US123456789" />
          </div>
          <Button className="w-full">Save Company Information</Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Configure general application behavior.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoAssign">Auto-assign Drivers</Label>
              <p className="text-sm text-muted-foreground">Automatically assign drivers to new bookings.</p>
            </div>
            <Switch id="autoAssign" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoCancel">Auto-cancel Pending</Label>
              <p className="text-sm text-muted-foreground">Automatically cancel bookings without payment after 24h.</p>
            </div>
            <Switch id="autoCancel" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sendReminders">Send Reminders</Label>
              <p className="text-sm text-muted-foreground">Send email reminders before pickup time.</p>
            </div>
            <Switch id="sendReminders" />
          </div>
          <Button className="w-full">Save Application Settings</Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient md:col-span-2">
        <CardHeader>
          <CardTitle>Currency & Pricing</CardTitle>
          <CardDescription>Configure currency and price calculation settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Input id="defaultCurrency" placeholder="USD" defaultValue="USD" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceRounding">Price Rounding</Label>
              <Input id="priceRounding" placeholder="0.99" defaultValue="0.99" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input id="taxRate" placeholder="20" defaultValue="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancelFee">Cancellation Fee (%)</Label>
              <Input id="cancelFee" placeholder="25" defaultValue="25" />
            </div>
          </div>
          <Button className="w-full mt-4">Save Currency & Pricing</Button>
        </CardContent>
      </Card>
    </div>
  );
};
