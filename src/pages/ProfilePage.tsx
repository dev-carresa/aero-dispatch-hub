
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole, UserStatus } from "@/types/user";
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
        // Use auth user data or fallback to mock data
        if (authUser) {
          const userData: User = {
            id: authUser.id,
            name: authUser.name,
            firstName: authUser.name.split(' ')[0],
            lastName: authUser.name.split(' ').slice(1).join(' '),
            email: authUser.email,
            role: authUser.role as UserRole,
            status: "active" as UserStatus,
            lastActive: "Just now",
            imageUrl: "",
            phone: "+1 (555) 000-0000",
            nationality: "American",
            dateOfBirth: "1990-01-01",
            countryCode: "US"
          };
          
          setUser(userData);
        } else {
          // Mock data for the profile if no auth user
          const mockUser = {
            id: "1",
            name: "Demo User",
            firstName: "Demo",
            lastName: "User",
            email: "user@example.com",
            role: "Customer" as UserRole,
            status: "active" as UserStatus,
            lastActive: "Just now",
            imageUrl: "",
            phone: "+1 (555) 000-0000",
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
  }, [navigate, authUser]);

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
