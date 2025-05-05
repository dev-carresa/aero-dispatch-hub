
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function TimezoneSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dateTimeSettings, setDateTimeSettings] = useState({
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
    autoDetect: false
  });

  const handleDateTimeSettingChange = (setting: string, value: string) => {
    setDateTimeSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleAutoDetectChange = (checked: boolean) => {
    setDateTimeSettings(prev => ({ ...prev, autoDetect: checked }));
    
    if (checked) {
      // Logic to auto-detect timezone
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setDateTimeSettings(prev => ({ ...prev, timezone: detectedTimezone }));
      toast.info(`Detected timezone: ${detectedTimezone}`);
    }
  };

  const saveDateTimeSettings = async () => {
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would save to the database
      // Here we're simulating an API call
      // const { error } = await supabase
      //   .from('user_settings')
      //   .upsert({
      //     user_id: user.id,
      //     timezone: dateTimeSettings.timezone,
      //     date_format: dateTimeSettings.dateFormat,
      //     time_format: dateTimeSettings.timeFormat
      //   });
      
      // if (error) throw error;
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Date & Time settings saved successfully!");
    } catch (error) {
      console.error('Error saving date & time settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <CardTitle>Date & Time Settings</CardTitle>
        <CardDescription>Configure timezone and date format preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <select 
            id="timezone"
            value={dateTimeSettings.timezone}
            onChange={(e) => handleDateTimeSettingChange('timezone', e.target.value)}
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="America/New_York">Eastern Time - US & Canada (UTC-05:00)</option>
            <option value="America/Chicago">Central Time - US & Canada (UTC-06:00)</option>
            <option value="America/Denver">Mountain Time - US & Canada (UTC-07:00)</option>
            <option value="America/Los_Angeles">Pacific Time - US & Canada (UTC-08:00)</option>
            <option value="Europe/London">London, Edinburgh (UTC+00:00)</option>
            <option value="Europe/Paris">Paris, Berlin, Rome (UTC+01:00)</option>
            <option value="Asia/Tokyo">Tokyo, Osaka (UTC+09:00)</option>
            <option value="Australia/Sydney">Sydney, Melbourne (UTC+10:00)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateFormat">Date Format</Label>
          <select 
            id="dateFormat"
            value={dateTimeSettings.dateFormat}
            onChange={(e) => handleDateTimeSettingChange('dateFormat', e.target.value)}
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY (04/28/2025)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (28/04/2025)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-04-28)</option>
            <option value="MMM D, YYYY">MMM D, YYYY (Apr 28, 2025)</option>
            <option value="D MMM YYYY">D MMM YYYY (28 Apr 2025)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeFormat">Time Format</Label>
          <select 
            id="timeFormat"
            value={dateTimeSettings.timeFormat}
            onChange={(e) => handleDateTimeSettingChange('timeFormat', e.target.value)}
            disabled={isLoading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="12">12-hour (2:30 PM)</option>
            <option value="24">24-hour (14:30)</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <Label htmlFor="autoDetect">Auto-detect Timezone</Label>
            <p className="text-sm text-muted-foreground">Automatically detect and set timezone based on browser.</p>
          </div>
          <Switch 
            id="autoDetect"
            checked={dateTimeSettings.autoDetect}
            onCheckedChange={handleAutoDetectChange}
            disabled={isLoading}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={saveDateTimeSettings}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Date & Time Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
