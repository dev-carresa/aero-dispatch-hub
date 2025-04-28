
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, UserPlus, User, BarChart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample data for users
const initialUsers = [
  {
    id: 1,
    name: "Michael Rodriguez",
    email: "m.rodriguez@example.com",
    role: "Driver",
    status: "active",
    lastActive: "5 minutes ago",
    imageUrl: "",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    email: "s.thompson@example.com",
    role: "Driver",
    status: "active",
    lastActive: "2 hours ago",
    imageUrl: "",
  },
  {
    id: 3,
    name: "David Brown",
    email: "d.brown@example.com",
    role: "Driver",
    status: "inactive",
    lastActive: "3 days ago",
    imageUrl: "",
  },
  {
    id: 4,
    name: "Amanda Johnson",
    email: "a.johnson@example.com",
    role: "Admin",
    status: "active",
    lastActive: "Just now",
    imageUrl: "",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "j.wilson@example.com",
    role: "Driver",
    status: "active",
    lastActive: "1 hour ago",
    imageUrl: "",
  },
];

type User = typeof initialUsers[0];

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Search & Filter function
  const filteredUsers = users.filter(user => {
    // Search by name or email
    const matchesSearch = 
      searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by role
    const matchesRole = 
      roleFilter === "all" || 
      user.role.toLowerCase() === roleFilter.toLowerCase();
    
    // Filter by status
    const matchesStatus = 
      statusFilter === "all" || 
      user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  // Dropdown actions
  const handleViewProfile = (user: User) => {
    toast.info(`Viewing profile for ${user.name}`);
    // In a real application this would navigate to a user profile page
  };

  const handleEditUser = (user: User) => {
    toast.info(`Editing user ${user.name}`);
    // In a real application this would navigate to an edit user page
  };

  const toggleUserStatus = (user: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
    
    const newStatus = user.status === "active" ? "deactivated" : "activated";
    setUserToDeactivate(null);
    toast.success(`User ${user.name} ${newStatus} successfully`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage users and their permissions
          </p>
        </div>
        <div className="self-end sm:self-auto">
          <Link to="/users/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Users</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="dispatcher">Dispatcher</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <User className="h-8 w-8 text-muted-foreground/50" />
                    <p className="font-medium">No users found</p>
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
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className={user.status === 'active' ? "text-red-500" : "text-green-600"}
                          onClick={() => setUserToDeactivate(user)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
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

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={!!userToDeactivate} onOpenChange={(open) => !open && setUserToDeactivate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userToDeactivate?.status === 'active' 
                ? 'Deactivate User' 
                : 'Activate User'}
            </DialogTitle>
            <DialogDescription>
              {userToDeactivate?.status === 'active'
                ? `Are you sure you want to deactivate ${userToDeactivate?.name}? They will no longer be able to access the system.`
                : `Are you sure you want to activate ${userToDeactivate?.name}? They will regain access to the system.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDeactivate(null)}>
              Cancel
            </Button>
            <Button 
              variant={userToDeactivate?.status === 'active' ? "destructive" : "default"}
              onClick={() => userToDeactivate && toggleUserStatus(userToDeactivate)}
            >
              {userToDeactivate?.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
