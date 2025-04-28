
import { Bell, Clock, Globe, Lock, Palette, Server, Shield, User } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SettingsTabs = () => {
  return (
    <TabsList className="grid grid-cols-5 md:grid-cols-8 lg:w-fit mb-6">
      <TabsTrigger value="general" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline">General</span>
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="hidden md:inline">Profile</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden md:inline">Notifications</span>
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span className="hidden md:inline">Security</span>
      </TabsTrigger>
      <TabsTrigger value="api" className="flex items-center gap-2">
        <Server className="h-4 w-4" />
        <span className="hidden md:inline">API</span>
      </TabsTrigger>
      <TabsTrigger value="appearance" className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        <span className="hidden md:inline">Appearance</span>
      </TabsTrigger>
      <TabsTrigger value="timezone" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="hidden md:inline">Timezone</span>
      </TabsTrigger>
      <TabsTrigger value="permissions" className="flex items-center gap-2">
        <Lock className="h-4 w-4" />
        <span className="hidden md:inline">Permissions</span>
      </TabsTrigger>
    </TabsList>
  );
};
