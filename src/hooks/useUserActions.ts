
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserStatus } from "@/types/user";
import { updateDriverAvailability, toggleUserActiveStatus } from "@/services/userService";
import { toast } from "sonner";

export const useUserActions = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const navigate = useNavigate();
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Navigate to user profile
  const handleViewProfile = (user: User) => {
    const userId = typeof user.id === 'number' ? user.id.toString() : user.id;
    navigate(`/users/${userId}`);
  };

  // Navigate to edit user
  const handleEditUser = (user: User) => {
    const userId = typeof user.id === 'number' ? user.id.toString() : user.id;
    navigate(`/users/${userId}`);
  };

  // Toggle user status
  const toggleUserStatus = async (user: User, newStatus?: string) => {
    if (user.role === "Driver" && newStatus) {
      try {
        // Update driver availability in Supabase
        await updateDriverAvailability(user.id, newStatus);
        
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === user.id
              ? { ...u, driverAvailability: newStatus as any }
              : u
          )
        );
        toast.success(`Driver ${user.name}'s availability updated to ${newStatus.replace('_', ' ')}`);
      } catch (error) {
        console.error('Error updating driver status:', error);
        toast.error('Failed to update driver status');
      }
    } else {
      try {
        // Toggle active/inactive status for non-drivers
        await toggleUserActiveStatus(user.id, user.status);
        
        // Update local state
        const newUserStatus = user.status === "active" ? "inactive" : "active";
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === user.id
              ? { ...u, status: newUserStatus as UserStatus }
              : u
          )
        );
        
        const actionText = user.status === "active" ? "deactivated" : "activated";
        toast.success(`User ${user.name} ${actionText} successfully`);
      } catch (error) {
        console.error('Error updating user status:', error);
        toast.error('Failed to update user status');
      }
    }
    setUserToDeactivate(null);
  };

  return {
    userToDeactivate,
    setUserToDeactivate,
    handleViewProfile,
    handleEditUser,
    toggleUserStatus
  };
};
