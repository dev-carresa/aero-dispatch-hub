
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDetailsTab } from "./tabs/UserDetailsTab";
import { UserPreferencesTab } from "./tabs/UserPreferencesTab";
import { UserSecurityTab } from "./tabs/UserSecurityTab";
import { UserInvoicesTab } from "./tabs/UserInvoicesTab";

interface ProfileTabsSectionProps {
  user: User | null;
  isLoading: boolean;
}

export const ProfileTabsSection = ({ user, isLoading }: ProfileTabsSectionProps) => {
  if (isLoading) {
    return (
      <div className="md:col-span-2 space-y-4">
        <Skeleton className="h-10 w-[320px]" />
        <Card>
          <Skeleton className="h-[400px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <UserDetailsTab user={user} />
        </TabsContent>
        
        <TabsContent value="preferences">
          <UserPreferencesTab user={user} />
        </TabsContent>
        
        <TabsContent value="security">
          <UserSecurityTab user={user} />
        </TabsContent>
        
        <TabsContent value="invoices">
          <UserInvoicesTab userId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
