import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { 
  Alert, 
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function SecuritySettings() {
  const { user, session } = useAuth();
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: true,
    ipRestriction: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSessionData, setIsLoadingSessionData] = useState(false);
  const [activeSessions, setActiveSessions] = useState<{id: string, device: string, lastActive: string, ip: string}[]>([]);

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  // Fetch sessions when component mounts
  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleSecuritySettingChange = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  // Update password function with proper validation and error handling
  const updatePassword = async (data: z.infer<typeof passwordSchema>) => {
    setPasswordError("");
    setIsSaving(true);
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: data.currentPassword
      });

      if (signInError) {
        setPasswordError("Current password is incorrect");
        throw signInError;
      }

      // If sign-in successful, update the password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: data.newPassword 
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      if (!passwordError) {
        setPasswordError("An error occurred while updating the password");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Security settings (session timeout, 2FA, etc.)
  const saveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      // If 2FA is enabled but wasn't before, redirect to 2FA setup
      const was2FAEnabled = securitySettings.twoFactor;
      
      // Store the settings in user metadata
      const { error } = await supabase.auth.updateUser({
        data: { 
          security_settings: {
            twoFactor: securitySettings.twoFactor,
            sessionTimeout: securitySettings.sessionTimeout,
            ipRestriction: securitySettings.ipRestriction
          }
        }
      });
      
      if (error) throw error;
      
      // If two-factor was enabled, let the user know they need to set it up
      if (securitySettings.twoFactor && !was2FAEnabled) {
        toast.info("Two-factor authentication enabled. You'll be prompted to set it up on your next sign in.");
      } else {
        toast.success("Security settings saved successfully");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save security settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch active sessions
  const fetchSessions = async () => {
    if (!user) return;
    
    setIsLoadingSessionData(true);
    try {
      // Current session from context
      const currentSession = {
        id: "current",
        device: getUserAgent(),
        lastActive: "Current session",
        ip: await getCurrentIP()
      };
      
      // Set the active sessions with at least the current one
      setActiveSessions([currentSession]);
      
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoadingSessionData(false);
    }
  };
  
  // Helper function to get user agent info
  const getUserAgent = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    
    if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Chrome/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua)) browser = "Safari";
    else if (/Edge/i.test(ua)) browser = "Edge";
    
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac/i.test(ua)) os = "MacOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Linux/i.test(ua)) os = "Linux";
    
    return `${browser} on ${os}`;
  };
  
  // Helper function to get current IP (using a service)
  const getCurrentIP = async () => {
    try {
      // This is just for UI display, not security critical
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "Unknown";
    }
  };

  // Terminate all other sessions
  const terminateAllOtherSessions = async () => {
    setIsLoadingSessionData(true);
    try {
      // In Supabase, this signs out all other sessions
      await supabase.auth.signOut({ scope: 'others' });
      
      // Keep only the current session in our state
      setActiveSessions(prev => prev.filter(session => session.id === "current"));
      toast.success("All other sessions have been terminated");
    } catch (error) {
      console.error("Error terminating sessions:", error);
      toast.error("Failed to close sessions");
    } finally {
      setIsLoadingSessionData(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showPasswords ? "text" : "password"}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type={showPasswords ? "text" : "password"} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type={showPasswords ? "text" : "password"} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                className="w-full" 
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
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
            <Switch 
              id="twoFactor"
              checked={securitySettings.twoFactor}
              onCheckedChange={(checked) => handleSecuritySettingChange("twoFactor", checked)}
              disabled={isSaving}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sessionTimeout">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out after 2 hours of inactivity.</p>
            </div>
            <Switch 
              id="sessionTimeout"
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(checked) => handleSecuritySettingChange("sessionTimeout", checked)}
              disabled={isSaving}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ipRestriction">IP Restriction</Label>
              <p className="text-sm text-muted-foreground">Limit login to specific IP addresses.</p>
            </div>
            <Switch 
              id="ipRestriction"
              checked={securitySettings.ipRestriction}
              onCheckedChange={(checked) => handleSecuritySettingChange("ipRestriction", checked)}
              disabled={isSaving}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={saveSecuritySettings}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Security Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient md:col-span-2">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active login sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSessions}
                disabled={isLoadingSessionData}
              >
                {isLoadingSessionData ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            {activeSessions.map(session => (
              <div key={session.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">Last activity: {session.lastActive}</p>
                    <p className="text-xs text-muted-foreground mt-1">IP: {session.ip}</p>
                  </div>
                  <Button variant="outline" size="sm" disabled={true}>Current Session</Button>
                </div>
              </div>
            ))}
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={terminateAllOtherSessions}
              disabled={isLoadingSessionData || activeSessions.length <= 1}
            >
              {isLoadingSessionData ? "Terminating sessions..." : "Terminate All Other Sessions"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
