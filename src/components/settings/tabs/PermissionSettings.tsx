
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePermission } from "@/context/PermissionContext";
import { Permission, rolePermissions } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Define proper TypeScript interfaces for our data structures
interface RoleData {
  id: string;
  name: string;
  permissions: Record<Permission, boolean>;
  isBuiltIn: boolean;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: string;
}

// Group permissions by category for better organization
const permissionCategories: Record<string, string[]> = {
  "Dashboard": ["dashboard:view"],
  "Bookings": ["bookings:view", "bookings:create", "bookings:edit", "bookings:delete", "bookings:assign_driver"],
  "Users": ["users:view", "users:create", "users:edit", "users:delete"],
  "API Users": ["api_users:view", "api_users:create", "api_users:edit", "api_users:delete"],
  "Vehicles": ["vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete"],
  "Airports/Meeting Points": ["airports:view", "airports:create", "airports:edit", "airports:delete"],
  "Reports": ["reports:view", "reports:create"],
  "Complaints": ["complaints:view", "complaints:create", "complaints:respond"],
  "Driver Comments": ["driver_comments:view", "driver_comments:create"],
  "Quality Reviews": ["quality_reviews:view"],
  "Invoices": ["invoices:view", "invoices:create", "invoices:edit"],
  "Settings": ["settings:view", "settings:edit", "settings:permissions", "settings:api"]
};

export function PermissionSettings() {
  const { hasPermission, isAdmin } = usePermission();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  // Initialize role data from our predefined permissions
  useEffect(() => {
    // Convert our predefined rolePermissions into the format needed by the UI
    const initialRoles: RoleData[] = Object.entries(rolePermissions).map(([roleId, permissions]) => {
      // Create an object with all permissions set to false by default
      const allPermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
      
      // Initialize all possible permissions as false
      Object.values(permissionCategories).flat().forEach(perm => {
        allPermissions[perm as Permission] = false;
      });
      
      // Set the permissions this role has to true
      permissions.forEach(perm => {
        allPermissions[perm] = true;
      });
      
      // Return the role data structure
      return {
        id: roleId.toLowerCase(),
        name: roleId,
        permissions: allPermissions,
        isBuiltIn: true // All predefined roles are built-in
      };
    });
    
    setRoles(initialRoles);
    fetchUsers();
    setIsLoading(false);
  }, []);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      // In a real application, this would fetch from the database
      // Sample data for now
      const mockUsers: UserData[] = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@transport-co.com",
          initials: "AD",
          color: "blue",
          role: "admin"
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "jane@transport-co.com",
          initials: "JD",
          color: "green",
          role: "driver"
        },
        {
          id: 3,
          name: "Mike Smith",
          email: "mike@transport-co.com",
          initials: "MS",
          color: "purple",
          role: "fleet"
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleRolePermissionChange = (roleId: string, permissionKey: string, value: boolean) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [permissionKey]: value
          }
        };
      }
      return role;
    }));
  };

  const handleUserRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole
        };
      }
      return user;
    }));
  };

  const deleteRole = (roleId: string) => {
    // Check if role is in use
    const roleInUse = users.some(user => user.role === roleId);
    
    if (roleInUse) {
      toast.error("Cannot delete role that is assigned to users");
      return;
    }
    
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success("Role deleted successfully");
  };

  const saveUserPermissions = () => {
    // In a real application, this would save to the database
    toast.success("User permissions saved successfully");
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }
    
    const roleId = newRoleName.toLowerCase().replace(/\s+/g, '_');
    
    // Check if role with this ID already exists
    if (roles.some(role => role.id === roleId)) {
      toast.error("A role with a similar name already exists");
      return;
    }
    
    // Create empty permissions object
    const permissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
    
    // Initialize all permissions as false
    Object.values(permissionCategories).flat().forEach(perm => {
      permissions[perm as Permission] = false;
    });
    
    // Add the new role
    const newRole: RoleData = {
      id: roleId,
      name: newRoleName,
      permissions,
      isBuiltIn: false
    };
    
    setRoles([...roles, newRole]);
    setNewRoleName("");
    setIsCreateDialogOpen(false);
    toast.success(`Role "${newRoleName}" created successfully`);
  };

  // We'll show the content regardless of permissions now
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading permissions...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const formatPermissionName = (permission: string) => {
    return permission
      .split(':')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(': ');
  };

  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Configure user roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingRoleId(role.id)}
                      disabled={role.isBuiltIn}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      disabled={role.isBuiltIn}
                      onClick={() => deleteRole(role.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {permissions.map((permKey) => (
                          <div key={permKey} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={`${role.id}-${permKey}`}
                              checked={role.permissions[permKey as Permission] || false}
                              disabled={role.isBuiltIn}
                              onChange={(e) => handleRolePermissionChange(role.id, permKey, e.target.checked)}
                              className="h-4 w-4" 
                            />
                            <Label htmlFor={`${role.id}-${permKey}`}>
                              {formatPermissionName(permKey)}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Role</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Enter a name for the new role. You'll be able to configure permissions after creation.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="role-name" className="block mb-2">Role Name</Label>
                  <Input 
                    id="role-name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter role name"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateRole}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>Assign roles to specific users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-${user.color}-100 flex items-center justify-center text-${user.color}-700 font-medium`}>
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={user.role}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            
            <Button className="w-full" onClick={saveUserPermissions}>Save User Permissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
