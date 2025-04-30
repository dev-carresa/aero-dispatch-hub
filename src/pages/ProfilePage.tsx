
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/user";
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
