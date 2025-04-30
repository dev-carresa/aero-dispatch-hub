
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { Shield } from "lucide-react";

interface ProfileTabsSectionProps {
  user: User | null;
  isLoading: boolean;
}

export const ProfileTabsSection = ({ user, isLoading }: ProfileTabsSectionProps) => {
  if (isLoading) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-7 w-[150px]" />
          <Skeleton className="h-5 w-[250px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[200px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card className="md:col-span-2 shadow-md border-0">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          View and manage your personal information and account settings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="details" className="w-full">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="details" className="p-6 pt-4">
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-dashed">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                    <p className="mt-1 text-base">{user.name}</p>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="mt-1 text-base">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-dashed border-t">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                    <p className="mt-1 text-base">{user.role}</p>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className="mt-1 text-base capitalize">{user.status}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-dashed border-t">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                    <p className="mt-1 text-base">{user.phone || "-"}</p>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Last Active</h3>
                    <p className="mt-1 text-base">{user.lastActive}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="p-6">
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>
                </div>
                {/* Two-Factor Authentication section removed */}
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                    </div>
                    <Button variant="outline" size="sm">View Sessions</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="p-6">
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Language</h3>
                      <p className="text-sm text-muted-foreground">English (United States)</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Timezone</h3>
                      <p className="text-sm text-muted-foreground">UTC-08:00 Pacific Time (US & Canada)</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Shield className="h-4 w-4 mr-2" />
          <span>Your personal information is protected by our privacy policy</span>
        </div>
      </CardFooter>
    </Card>
  );
};
