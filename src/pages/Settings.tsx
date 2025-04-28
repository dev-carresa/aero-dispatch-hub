
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { GeneralTab } from "@/components/settings/tabs/GeneralTab";
import { ProfileTab } from "@/components/settings/tabs/ProfileTab";
import { NotificationsTab } from "@/components/settings/tabs/NotificationsTab";
import { SecurityTab } from "@/components/settings/tabs/SecurityTab";
import { ApiTab } from "@/components/settings/tabs/ApiTab";
import { AppearanceTab } from "@/components/settings/tabs/AppearanceTab";
import { TimezoneTab } from "@/components/settings/tabs/TimezoneTab";
import { PermissionsTab } from "@/components/settings/tabs/PermissionsTab";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <SettingsHeader />

      <Tabs defaultValue="general" className="w-full">
        <SettingsTabs />
        
        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="api">
          <ApiTab />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="timezone">
          <TimezoneTab />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
