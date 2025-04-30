
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function GeneralSettings() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "Transport Co.",
    address: "123 Transport St, New York, NY 10001",
    taxId: "US123456789"
  });

  const [appSettings, setAppSettings] = useState({
    autoAssign: false,
    autoCancel: false,
    sendReminders: false
  });

  const [currencySettings, setCurrencySettings] = useState({
    defaultCurrency: "USD",
    priceRounding: "0.99",
    taxRate: "20",
    cancelFee: "25"
  });

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleAppSettingsChange = (key: string, value: boolean) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCurrencySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencySettings(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const saveCompanyInfo = () => {
    // Save company info logic here
    toast.success("Company information saved successfully!");
  };

  const saveAppSettings = () => {
    // Save app settings logic here
    toast.success("Application settings saved successfully!");
  };

  const saveCurrencySettings = () => {
    // Save currency settings logic here
    toast.success("Currency & pricing settings saved successfully!");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details shown on invoices and communications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input 
              id="name" 
              placeholder="Transport Co." 
              value={companyInfo.name}
              onChange={handleCompanyInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              placeholder="Company address" 
              value={companyInfo.address}
              onChange={handleCompanyInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT Number</Label>
            <Input 
              id="taxId" 
              placeholder="Tax ID or VAT number" 
              value={companyInfo.taxId}
              onChange={handleCompanyInfoChange}
            />
          </div>
          <Button className="w-full" onClick={saveCompanyInfo}>Save Company Information</Button>
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
            <Switch 
              id="autoAssign"
              checked={appSettings.autoAssign}
              onCheckedChange={(checked) => handleAppSettingsChange("autoAssign", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoCancel">Auto-cancel Pending</Label>
              <p className="text-sm text-muted-foreground">Automatically cancel bookings without payment after 24h.</p>
            </div>
            <Switch 
              id="autoCancel"
              checked={appSettings.autoCancel}
              onCheckedChange={(checked) => handleAppSettingsChange("autoCancel", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sendReminders">Send Reminders</Label>
              <p className="text-sm text-muted-foreground">Send email reminders before pickup time.</p>
            </div>
            <Switch 
              id="sendReminders"
              checked={appSettings.sendReminders}
              onCheckedChange={(checked) => handleAppSettingsChange("sendReminders", checked)}
            />
          </div>
          <Button className="w-full" onClick={saveAppSettings}>Save Application Settings</Button>
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
              <Input 
                id="defaultCurrency" 
                placeholder="USD" 
                value={currencySettings.defaultCurrency}
                onChange={handleCurrencySettingsChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceRounding">Price Rounding</Label>
              <Input 
                id="priceRounding" 
                placeholder="0.99" 
                value={currencySettings.priceRounding}
                onChange={handleCurrencySettingsChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input 
                id="taxRate" 
                placeholder="20" 
                value={currencySettings.taxRate}
                onChange={handleCurrencySettingsChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancelFee">Cancellation Fee (%)</Label>
              <Input 
                id="cancelFee" 
                placeholder="25" 
                value={currencySettings.cancelFee}
                onChange={handleCurrencySettingsChange}
              />
            </div>
          </div>
          <Button className="w-full mt-4" onClick={saveCurrencySettings}>Save Currency & Pricing</Button>
        </CardContent>
      </Card>
    </div>
  );
}
