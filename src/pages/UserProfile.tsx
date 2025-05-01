
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

  useEffect(() => {
    // In a real app, this would be an API call
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
    }
  }, [id, navigate]);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    toast.success("User profile updated successfully");
  };

  // If no user is found, don't render anything
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <UserProfileHeader user={user} />
      <UserProfileTabs user={user} onUserUpdate={handleUserUpdate} />
    </div>
  );
};

export default UserProfile;
