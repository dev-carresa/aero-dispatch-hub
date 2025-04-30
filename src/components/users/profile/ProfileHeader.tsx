
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  isLoading: boolean;
  handleEditProfile: () => void;
}

export const ProfileHeader = ({ isLoading, handleEditProfile }: ProfileHeaderProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div className="h-12 w-[250px] bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-10 w-[120px] bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      <Button onClick={handleEditProfile} className="flex items-center gap-2">
        <UserCog className="h-4 w-4" />
        Edit Profile
      </Button>
    </div>
  );
};
