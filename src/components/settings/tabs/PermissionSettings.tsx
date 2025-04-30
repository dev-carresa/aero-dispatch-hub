
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePermission } from "@/context/PermissionContext";
import { Permission } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
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
import { DatabaseInitializer } from "../DatabaseInitializer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

interface DbRole {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
}

interface DbPermission {
  id: string;
  name: string;
  description: string;
}

interface DbRolePermission {
  role_id: string;
  permission_id: string;
  permission_name: string;
}

// Group permissions by category for better organization
const permissionCategories = {
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
  const [dbMode, setDbMode] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load roles and permissions from the database
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch roles from the database
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*');
          
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          setDbError("Failed to load roles. Please initialize the database.");
          throw rolesError;
        }
        
        // Fetch permissions from the database
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*');
          
        if (permissionsError) {
          console.error('Error fetching permissions:', permissionsError);
          setDbError("Failed to load permissions. Please initialize the database.");
          throw permissionsError;
        }
        
        // Fetch role-permission mappings
        const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
          .from('role_permissions')
          .select(`
            role_id,
            permission_id,
            permissions (
              name
            )
          `);
          
        if (rolePermissionsError) {
          console.error('Error fetching role permissions:', rolePermissionsError);
          setDbError("Failed to load role permissions. Please initialize the database.");
          throw rolePermissionsError;
        }
        
        // Transform the data for the UI
        const transformedRoles: RoleData[] = (rolesData as DbRole[]).map(role => {
          // Create an object with all permissions set to false by default
          const allPermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
          
          // Initialize all possible permissions as false
          Object.values(permissionCategories).flat().forEach(perm => {
            allPermissions[perm as Permission] = false;
          });
          
          // Set the permissions this role has to true
          rolePermissionsData.forEach(rp => {
            if (rp.role_id === role.id && rp.permissions?.name) {
              allPermissions[rp.permissions.name as Permission] = true;
            }
          });
          
          return {
            id: role.id,
            name: role.name,
            permissions: allPermissions,
            isBuiltIn: role.is_system
          };
        });
        
        setRoles(transformedRoles);
        fetchUsers();
      } catch (error) {
        console.error("Error initializing roles and permissions:", error);
        // Fall back to memory-based permissions
        setDbMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      // In a real application, this would fetch from the database
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, role');
        
      if (profilesError) {
        throw profilesError;
      }
      
      const usersData = profilesData.map((profile) => {
        const initials = profile.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
          
        // Generate a consistent color based on the user id
        const colors = ['blue', 'green', 'purple', 'red', 'amber', 'pink', 'indigo', 'cyan'];
        const colorIndex = Math.abs(profile.id.charCodeAt(0) % colors.length);
        
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          initials,
          color: colors[colorIndex],
          role: profile.role ? profile.role.toLowerCase() : 'customer'
        };
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      
      // Fallback to mock users if database access fails
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
    }
  };

  const handleRolePermissionChange = async (roleId: string, permissionKey: string, value: boolean) => {
    try {
      if (dbMode) {
        // Get permission id from name
        const { data: permData, error: permError } = await supabase
          .from('permissions')
          .select('id')
          .eq('name', permissionKey)
          .single();
          
        if (permError) throw permError;
        
        if (value) {
          // Add permission to role
          const { error: insertError } = await supabase
            .from('role_permissions')
            .insert({
              role_id: roleId,
              permission_id: permData.id
            });
            
          if (insertError) throw insertError;
        } else {
          // Remove permission from role
          const { error: deleteError } = await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', roleId)
            .eq('permission_id', permData.id);
            
          if (deleteError) throw deleteError;
        }
      }
      
      // Update UI state
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
    } catch (error) {
      console.error("Error updating role permission:", error);
      toast.error("Failed to update permission. Please try again.");
    }
  };

  const handleUserRoleChange = async (userId: string | number, newRoleValue: string) => {
    try {
      if (dbMode) {
        // Get role id from name
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .ilike('name', newRoleValue)
          .single();
          
        if (roleError) throw roleError;
        
        // Update user's role in the database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: newRoleValue.charAt(0).toUpperCase() + newRoleValue.slice(1),
            role_id: roleData.id
          })
          .eq('id', userId);
          
        if (updateError) throw updateError;
      }
      
      // Update UI state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            role: newRoleValue
          };
        }
        return user;
      }));
      
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      // Check if role is in use
      const roleInUse = users.some(user => {
        const roleName = roles.find(r => r.id === roleId)?.name.toLowerCase();
        return user.role === roleName;
      });
      
      if (roleInUse) {
        toast.error("Cannot delete role that is assigned to users");
        return;
      }
      
      if (dbMode) {
        // Delete role from database
        const { error } = await supabase
          .from('roles')
          .delete()
          .eq('id', roleId);
          
        if (error) throw error;
      }
      
      // Update UI state
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }
    
    try {
      const roleId = newRoleName.toLowerCase().replace(/\s+/g, '_');
      
      // Check if role with this ID already exists
      if (roles.some(role => role.name.toLowerCase() === newRoleName.toLowerCase())) {
        toast.error("A role with a similar name already exists");
        return;
      }
      
      let newRoleId = "";
      
      if (dbMode) {
        // Create role in database
        const { data, error } = await supabase
          .from('roles')
          .insert({
            name: newRoleName,
            description: `Custom role: ${newRoleName}`,
            is_system: false
          })
          .select();
          
        if (error) throw error;
        
        newRoleId = data[0].id;
      } else {
        // Generate a UUID-like string for memory mode
        newRoleId = 'custom_' + Math.random().toString(36).substring(2, 15);
      }
      
      // Create empty permissions object
      const permissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
      
      // Initialize all permissions as false
      Object.values(permissionCategories).flat().forEach(perm => {
        permissions[perm as Permission] = false;
      });
      
      // Add the new role
      const newRole: RoleData = {
        id: newRoleId,
        name: newRoleName,
        permissions,
        isBuiltIn: false
      };
      
      setRoles([...roles, newRole]);
      setNewRoleName("");
      setIsCreateDialogOpen(false);
      toast.success(`Role "${newRoleName}" created successfully`);
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role. Please try again.");
    }
  };

  // Only admins with permissions:settings permission can access this page
  if (!hasPermission("settings:permissions") && !isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Settings</CardTitle>
          <CardDescription>
            You don't have permission to view or modify permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
      <Tabs defaultValue="roles">
        <TabsList className="mb-4">
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="users">User Permissions</TabsTrigger>
          <TabsTrigger value="admin">Admin Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          {dbError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Database Error</AlertTitle>
              <AlertDescription>{dbError}</AlertDescription>
            </Alert>
          )}
          
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
                                  disabled={role.isBuiltIn && dbMode}
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
        </TabsContent>
        
        <TabsContent value="users">
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
                          <option key={role.id} value={role.name.toLowerCase()}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin">
          <DatabaseInitializer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
