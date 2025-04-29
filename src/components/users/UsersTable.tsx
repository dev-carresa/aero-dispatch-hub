
import { User } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Edit, UserPlus, Phone, Car } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UsersTableProps {
  filteredUsers: User[];
  handleViewProfile: (user: User) => void;
  handleEditUser: (user: User) => void;
  setUserToDeactivate: (user: User) => void;
  currentFilter?: string;
}

export const UsersTable = ({
  filteredUsers,
  handleViewProfile,
  handleEditUser,
  setUserToDeactivate,
  currentFilter = "all",
}: UsersTableProps) => {
  const isDriverView = currentFilter === "Driver";

  // Function to determine badge color based on driver availability
  const getDriverAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'busy':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'on_break':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'offline':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {isDriverView && <TableHead>Vehicle</TableHead>}
            <TableHead>{isDriverView ? "Position" : "Role"}</TableHead>
            <TableHead>{isDriverView ? "Availability" : "Status"}</TableHead>
            {isDriverView && <TableHead>Phone</TableHead>}
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isDriverView ? 6 : 5} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <UserIcon className="h-8 w-8 text-muted-foreground/50" />
                  <p className="font-medium">No {isDriverView ? "drivers" : "users"} found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        to={`/users/${user.id}`}
                        className="font-medium hover:underline"
                      >
                        {user.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                {isDriverView && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{user.vehicleType || "Not Assigned"}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      isDriverView
                        ? getDriverAvailabilityColor(user.driverAvailability)
                        : (user.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200')
                    }
                    onClick={() => isDriverView && setUserToDeactivate(user)}
                    style={{ cursor: isDriverView ? 'pointer' : 'default' }}
                  >
                    {isDriverView 
                      ? (user.driverAvailability || 'offline').replace('_', ' ').charAt(0).toUpperCase() + 
                        (user.driverAvailability || 'offline').replace('_', ' ').slice(1) 
                      : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                {isDriverView && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone || "Not Available"}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell>{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to={`/users/${user.id}`} className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit {isDriverView ? "Driver" : "User"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className={user.status === 'active' ? "text-red-500" : "text-green-600"}
                        onClick={() => setUserToDeactivate(user)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {isDriverView 
                          ? 'Change Availability'
                          : (user.status === 'active' ? 'Deactivate User' : 'Activate User')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
