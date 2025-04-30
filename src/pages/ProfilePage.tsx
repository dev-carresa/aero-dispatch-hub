
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole, UserStatus } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/users/profile/ProfileHeader";
import { ProfileSidebar } from "@/components/users/profile/ProfileSidebar";
import { ProfileTabsSection } from "@/components/users/profile/ProfileTabsSection";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Get the current authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (authData?.user) {
          // Fetch the user profile from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
            
          if (profileError) throw profileError;
          
          // Map the profile data to our User type
          setUser({
            id: profileData.id,
            name: profileData.name,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            email: profileData.email,
            role: profileData.role as UserRole,
            status: profileData.status as UserStatus,
            lastActive: profileData.last_active || "Just now",
            imageUrl: profileData.image_url || "",
            phone: profileData.phone || "",
            nationality: profileData.nationality || "",
            dateOfBirth: profileData.date_of_birth || "",
            countryCode: profileData.country_code || "US"
          });
        } else {
          // Fallback to mock data if no authenticated user
          const mockUser: User = {
            id: "4",
            name: "Admin User",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            role: "Admin",
            status: "active",
            lastActive: "Just now",
            imageUrl: "",
            phone: "+1 (555) 123-4567",
            nationality: "American",
            dateOfBirth: "1990-01-01",
            countryCode: "US"
          };
          
          setUser(mockUser);
        }
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

  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileHeader isLoading={isLoading} handleEditProfile={handleEditProfile} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileSidebar 
          user={user} 
          isLoading={isLoading} 
          handleEditProfile={handleEditProfile} 
        />
        
        <ProfileTabsSection 
          user={user} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
