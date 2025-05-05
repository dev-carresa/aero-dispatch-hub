
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const {
    profileForm,
    preferences,
    avatarUrl,
    isUploading,
    handlePreferencesChange,
    updateProfile,
    updatePreferences,
    uploadProfilePicture,
    isLoading,
    fetchProfileData
  } = useProfileSettings();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadProfilePicture(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "?";
    const fullName = profileForm.getValues().fullName || user.name || user.email || "";
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="john@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 (555) 000-0000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                className="w-full" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Avatar & Preferences</CardTitle>
          <CardDescription>Update your profile picture and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || undefined} alt="Profile" />
              <AvatarFallback className="text-2xl font-semibold text-primary">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter">Receive Newsletter</Label>
              <Switch 
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) => handlePreferencesChange("newsletter", checked)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing Communications</Label>
              <Switch 
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) => handlePreferencesChange("marketing", checked)}
                disabled={isLoading}
              />
            </div>
            <Button 
              className="w-full mt-2" 
              onClick={updatePreferences}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
