
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDetailsTab } from "./tabs/UserDetailsTab";
import { UserSecurityTab } from "./tabs/UserSecurityTab";
import { UserPreferencesTab } from "./tabs/UserPreferencesTab";
import { User } from "@/types/user";

interface UserProfileTabsProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export const UserProfileTabs = ({ user, onUserUpdate }: UserProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Tabs
      defaultValue="details"
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="details">Profile Details</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4">
        <UserDetailsTab user={user} onUserUpdate={onUserUpdate} />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <UserSecurityTab user={user} />
      </TabsContent>
      
      <TabsContent value="preferences" className="space-y-4">
        <UserPreferencesTab user={user} onUserUpdate={onUserUpdate} />
      </TabsContent>
    </Tabs>
  );
};
