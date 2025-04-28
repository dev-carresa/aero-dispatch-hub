
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/user";
import { initialUsers } from "@/data/sampleUsers";
import { UserProfileHeader } from "@/components/users/profile/UserProfileHeader";
import { UserProfileTabs } from "@/components/users/profile/UserProfileTabs";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUser = () => {
      setIsLoading(true);
      try {
        const foundUser = initialUsers.find(u => u.id === Number(id));
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
          navigate("/users");
        }
      } catch (error) {
        toast.error("Failed to load user profile");
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
