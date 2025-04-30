
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./tabs/GeneralSettings";
import { ProfileSettings } from "./tabs/ProfileSettings";
import { NotificationSettings } from "./tabs/NotificationSettings";
import { SecuritySettings } from "./tabs/SecuritySettings";
import { ApiSettings } from "./tabs/ApiSettings";
import { AppearanceSettings } from "./tabs/AppearanceSettings";
import { TimezoneSettings } from "./tabs/TimezoneSettings";
import { PermissionSettings } from "./tabs/PermissionSettings";

const SettingsLayout = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage application settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 md:grid-cols-8 lg:w-fit mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="timezone" className="flex items-center gap-2">
            <span className="hidden md:inline">Timezone</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <span className="hidden md:inline">Permissions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="api">
          <ApiSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="timezone">
          <TimezoneSettings />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsLayout;
