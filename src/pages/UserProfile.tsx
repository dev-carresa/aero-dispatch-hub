
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/user";
import { fetchUsers } from "@/services/userService"; // Import fetchUsers to get real user data
import { UserProfileHeader } from "@/components/users/profile/UserProfileHeader";
import { UserProfileTabs } from "@/components/users/profile/UserProfileTabs";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // Get all users and find the one with matching ID
        const users = await fetchUsers();
        const foundUser = users.find(u => u.id === id);
        
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
          navigate("/users");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error("Error loading user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    toast.success("User profile updated successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <UserProfileHeader user={user} />
      <UserProfileTabs user={user} onUserUpdate={handleUserUpdate} />
    </div>
  );
};

export default UserProfile;
