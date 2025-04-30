
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft, CalendarDays, Camera, Mail, Phone, UserCog } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationality: "",
      dateOfBirth: "",
    },
  });

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
        
        // Set form default values
        form.reset({
          firstName: mockUser.firstName || "",
          lastName: mockUser.lastName || "",
          email: mockUser.email,
          phone: mockUser.phone || "",
          nationality: mockUser.nationality || "",
          dateOfBirth: mockUser.dateOfBirth || "",
        });
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    // In a real app with Supabase, you would upload the file to storage
    // For now, we'll just simulate a successful upload
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Avatar uploaded successfully");
      setShowAvatarDialog(false);
      
      // Update user object with new avatar URL (in a real app, this would be the storage URL)
      if (user) {
        setUser({
          ...user,
          imageUrl: avatarPreview || user.imageUrl,
        });
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error(error);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      // In a real app with Supabase, you would update the user profile in the database
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user object with form data
      if (user) {
        const updatedUser = {
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
        };
        setUser(updatedUser);
      }
      
      toast.success("Profile updated successfully");
      navigate('/profile');
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/profile" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Profile Information</AlertTitle>
        <AlertDescription>
          Update your profile information below. Your public profile will reflect these changes.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile picture card */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 pb-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-2 border-muted">
                <AvatarImage 
                  src={user?.imageUrl || avatarPreview || ""} 
                  alt={user?.name || "Profile"} 
                />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-600 font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setShowAvatarDialog(true)}
              >
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAvatarDialog(true)}
            >
              Change Picture
            </Button>
          </CardContent>
        </Card>
        
        {/* Profile form card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Edit your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input placeholder="Nationality" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Avatar upload dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. The image should be a square JPG, PNG, or GIF file.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-2 border-muted">
                <AvatarImage 
                  src={avatarPreview || user?.imageUrl || ""} 
                  alt={user?.name || "Profile"} 
                />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-600 font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <Label 
                htmlFor="avatar-upload" 
                className="cursor-pointer bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
              >
                Select Image
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAvatarUpload} 
              disabled={!avatarFile}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
