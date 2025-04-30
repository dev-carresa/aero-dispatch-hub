
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";

interface ProfileSidebarProps {
  user: User | null;
  isLoading: boolean;
  handleEditProfile: () => void;
}

export const ProfileSidebar = ({ user, isLoading, handleEditProfile }: ProfileSidebarProps) => {
  if (isLoading) {
    return (
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-8 w-[120px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  return (
    <Card className="md:col-span-1 overflow-hidden border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
      <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
      <CardContent className="pt-0 relative">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 border-4 border-white -mt-16 bg-white shadow-lg">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="text-3xl bg-blue-100 text-blue-600 font-medium">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
          <Badge variant="outline" className={`mt-2 ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {user.role}
          </Badge>
          
          <div className="w-full mt-6 space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            {user.nationality && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{user.nationality}</span>
              </div>
            )}
            {user.dateOfBirth && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">{new Date(user.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <Button variant="outline" className="mt-6 w-full" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
