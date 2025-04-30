
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole, UserStatus } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/users/profile/ProfileHeader";
import { ProfileSidebar } from "@/components/users/profile/ProfileSidebar";
import { ProfileTabsSection } from "@/components/users/profile/ProfileTabsSection";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        if (authUser) {
          // Fetch the user profile from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (profileError) throw profileError;
          
          // Map the profile data to our User type
          setUser({
            id: profileData.id,
            name: profileData.name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: profileData.email || authUser.email || '',
            role: (profileData.role as UserRole) || 'Customer',
            status: (profileData.status as UserStatus) || 'active',
            lastActive: profileData.last_active || "Just now",
            imageUrl: profileData.image_url || "",
            phone: profileData.phone || "",
            nationality: profileData.nationality || "",
            dateOfBirth: profileData.date_of_birth || "",
            countryCode: profileData.country_code || "US"
          });
        } else {
          // If no authenticated user, navigate to login (shouldn't happen due to ProtectedRoute)
          navigate('/auth');
        }
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser, navigate]);

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
