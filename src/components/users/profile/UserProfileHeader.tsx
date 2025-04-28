
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@/types/user";

interface UserProfileHeaderProps {
  user: User;
}

export const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/users" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
