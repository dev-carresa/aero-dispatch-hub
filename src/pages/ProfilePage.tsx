
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Mail, MapPin, Phone, Shield, UserCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app with Supabase, you would fetch the actual user data
        // For now, we'll use sample data
        const mockUser = {
          id: 4,
          name: "Admin User",
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          role: "Admin" as const,
          status: "active" as const,
          lastActive: "Just now",
          imageUrl: "",
          phone: "+1 (555) 123-4567",
          nationality: "American",
          dateOfBirth: "1990-01-01",
          countryCode: "US"
        };
        
        setUser(mockUser);
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-6 w-[180px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-8 w-[120px]" />
              </div>
            </CardContent>
          </Card>
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
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <Button onClick={handleEditProfile} className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <Card className="md:col-span-1 overflow-hidden border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <CardContent className="pt-0 relative">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 border-4 border-white -mt-16 bg-white shadow-lg">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-600 font-medium">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
              <Badge variant="outline" className={`mt-2 ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {user.role}
              </Badge>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user.nationality && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{user.nationality}</span>
                  </div>
                )}
                {user.dateOfBirth && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm">{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="mt-6 w-full" onClick={handleEditProfile}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile details tabs */}
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
                    <div className="border-t p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">Enable 2FA</Button>
                      </div>
                    </div>
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
      </div>
    </div>
  );
}
