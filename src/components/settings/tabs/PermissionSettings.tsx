import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePermission } from "@/context/PermissionContext";
import { Shield, User, Settings, Search, Check, ChevronDown, Plus, Save, Trash2, Copy, X } from "lucide-react";
import { Permission } from "@/lib/permissions";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

// Define proper TypeScript interfaces for our data structures
interface RoleData {
  id: string;
  name: string;
  permissions: Record<Permission, boolean>;
  isBuiltIn: boolean;
  description?: string;
  userCount?: number;
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
const permissionCategories: Record<string, { description: string; permissions: string[] }> = {
  "Dashboard": {
    description: "Access and control of the dashboard",
    permissions: ["dashboard:view"]
  },
  "Bookings": {
    description: "Booking management",
    permissions: ["bookings:view", "bookings:create", "bookings:edit", "bookings:delete", "bookings:assign_driver"]
  },
  "Users": {
    description: "User management",
    permissions: ["users:view", "users:create", "users:edit", "users:delete"]
  },
  "API Users": {
    description: "API user management",
    permissions: ["api_users:view", "api_users:create", "api_users:edit", "api_users:delete"]
  },
  "Vehicles": {
    description: "Vehicle management",
    permissions: ["vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete"]
  },
  "Airports/Meeting Points": {
    description: "Airport and meeting point management",
    permissions: ["airports:view", "airports:create", "airports:edit", "airports:delete"]
  },
  "Reports": {
    description: "Report creation and visualization",
    permissions: ["reports:view", "reports:create"]
  },
  "Complaints": {
    description: "Complaint management",
    permissions: ["complaints:view", "complaints:create", "complaints:respond"]
  },
  "Driver Comments": {
    description: "Driver comments",
    permissions: ["driver_comments:view", "driver_comments:create"]
  },
  "Quality Reviews": {
    description: "Quality reviews",
    permissions: ["quality_reviews:view"]
  },
  "Invoices": {
    description: "Invoice management",
    permissions: ["invoices:view", "invoices:create", "invoices:edit"]
  },
  "Settings": {
    description: "System settings",
    permissions: ["settings:view", "settings:edit", "settings:permissions", "settings:api"]
  }
};

// Permission descriptions for tooltips
const permissionDescriptions: Record<string, string> = {
  "dashboard:view": "View the dashboard and statistics",
  "bookings:view": "View bookings",
  "bookings:create": "Create new bookings",
  "bookings:edit": "Edit existing bookings",
  "bookings:delete": "Delete bookings",
  "bookings:assign_driver": "Assign drivers to bookings",
  "users:view": "View the list of users",
  "users:create": "Create new users",
  "users:edit": "Edit existing users",
  "users:delete": "Delete users",
  "api_users:view": "View API users",
  "api_users:create": "Create new API users",
  "api_users:edit": "Edit API users",
  "api_users:delete": "Delete API users",
  "vehicles:view": "View vehicles",
  "vehicles:create": "Add new vehicles",
  "vehicles:edit": "Edit existing vehicles",
  "vehicles:delete": "Delete vehicles",
  "airports:view": "View airports and meeting points",
  "airports:create": "Create new airports",
  "airports:edit": "Edit existing airports",
  "airports:delete": "Delete airports",
  "reports:view": "View reports",
  "reports:create": "Create new reports",
  "complaints:view": "View complaints",
  "complaints:create": "Create new complaints",
  "complaints:respond": "Respond to complaints",
  "driver_comments:view": "View driver comments",
  "driver_comments:create": "Create driver comments",
  "quality_reviews:view": "View quality reviews",
  "invoices:view": "View invoices",
  "invoices:create": "Create new invoices",
  "invoices:edit": "Edit existing invoices",
  "settings:view": "View system settings",
  "settings:edit": "Edit general system settings",
  "settings:permissions": "Manage permissions and roles",
  "settings:api": "Configure API settings"
};

// Role colors for badges
const roleColorClasses: Record<string, string> = {
  "Admin": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "Driver": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "Fleet": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "Dispatcher": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Customer": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
};

export function PermissionSettings() {
  const { hasPermission, isAdmin, roles: rolePermissions } = usePermission();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [confirmDeleteRoleId, setConfirmDeleteRoleId] = useState<string | null>(null);

  // State for role operations
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [isRoleOpDialogOpen, setIsRoleOpDialogOpen] = useState(false);
  const [roleOpType, setRoleOpType] = useState<'edit' | 'copy'>('edit');
  const [copiedRoleName, setCopiedRoleName] = useState("");

  // Initialize role data from our predefined permissions and/or database
  useEffect(() => {
    fetchRolesFromDB();
    fetchUsers();
  }, []);

  // Fetch roles from the database or initialize from predefined permissions
  const fetchRolesFromDB = async () => {
    setIsLoading(true);
    try {
      // First check if there are any custom roles in the database
      const { data: dbRoles, error: dbError } = await supabase
        .from('roles')
        .select('*');
      
      if (dbError) {
        throw dbError;
      }
      
      // Fetch role-permission mappings
      const { data: rolePermissionMappings, error: mappingError } = await supabase
        .from('role_permissions')
        .select('role_id, permission_id, permissions(name)');
        
      if (mappingError) {
        throw mappingError;
      }
      
      // If we have roles in the database, use those
      if (dbRoles && dbRoles.length > 0) {
        // Create a mapping of role permissions
        const permissionsByRole: Record<string, string[]> = {};
        
        rolePermissionMappings?.forEach(mapping => {
          if (!permissionsByRole[mapping.role_id]) {
            permissionsByRole[mapping.role_id] = [];
          }
          
          if (mapping.permissions && mapping.permissions.name) {
            permissionsByRole[mapping.role_id].push(mapping.permissions.name);
          }
        });
        
        // Convert to the format needed by the UI
        const formattedRoles: RoleData[] = dbRoles.map(role => {
          // Create an object with all permissions set to false by default
          const allPermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
          
          // Initialize all possible permissions as false
          const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
          allPermissionKeys.forEach(perm => {
            allPermissions[perm as Permission] = false;
          });
          
          // Set the permissions this role has to true
          const rolePerms = permissionsByRole[role.id] || [];
          rolePerms.forEach(perm => {
            allPermissions[perm as Permission] = true;
          });
          
          // Count the users with this role
          const userCount = 0; // We'll update this later when we fetch users
          
          // Return the role data structure
          return {
            id: role.id,
            name: role.name,
            description: role.description || `${role.name} role`,
            permissions: allPermissions,
            isBuiltIn: role.is_system || false,
            userCount: userCount
          };
        });
        
        setRoles(formattedRoles);
      } else {
        // If no roles in database, use predefined roles
        const initialRoles: RoleData[] = Object.entries(rolePermissions).map(([roleId, permissions]) => {
          // Create an object with all permissions set to false by default
          const allPermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
          
          // Initialize all possible permissions as false
          const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
          allPermissionKeys.forEach(perm => {
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
            isBuiltIn: ["Admin", "Driver", "Fleet", "Dispatcher", "Customer"].includes(roleId),
            description: `${roleId} role with predefined permissions`,
            userCount: Math.floor(Math.random() * 10) // Mock user count for demo
          };
        });
        
        // Initialize the database with predefined roles
        await seedPredefinedRolesToDB(initialRoles);
        
        setRoles(initialRoles);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Unable to load roles");
      setIsLoading(false);
    }
  };

  // Seed predefined roles to the database if none exist
  const seedPredefinedRolesToDB = async (initialRoles: RoleData[]) => {
    try {
      // For each predefined role
      for (const role of initialRoles) {
        // Create the role in the database
        const { data: newRole, error: roleError } = await supabase
          .from('roles')
          .insert([{
            id: role.id,
            name: role.name,
            description: role.description,
            is_system: role.isBuiltIn
          }])
          .select();
          
        if (roleError) {
          console.error("Error creating role:", roleError);
          continue;
        }
        
        // Now add permissions for this role
        const permissionEntries = Object.entries(role.permissions)
          .filter(([_, isEnabled]) => isEnabled) // Only include enabled permissions
          .map(([permName, _]) => ({
            role_id: role.id,
            permission_name: permName
          }));
        
        if (permissionEntries.length > 0) {
          // Fetch permission IDs from names
          for (const entry of permissionEntries) {
            const { data: permission, error: permError } = await supabase
              .from('permissions')
              .select('id')
              .eq('name', entry.permission_name)
              .single();
              
            if (permError || !permission) {
              console.error(`Permission not found: ${entry.permission_name}`);
              continue;
            }
            
            // Create role-permission mapping
            const { error: mappingError } = await supabase
              .from('role_permissions')
              .insert([{
                role_id: role.id,
                permission_id: permission.id
              }]);
              
            if (mappingError) {
              console.error("Error creating role-permission mapping:", mappingError);
            }
          }
        }
      }
      
      toast.success("Initial roles and permissions configured");
    } catch (error) {
      console.error("Error seeding roles to database:", error);
    }
  };

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      // In a real application, this would fetch from the database
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Map database results to our UserData format
      const fetchedUsers: UserData[] = profilesData.map((profile, index) => {
        const nameParts = profile.name.split(' ');
        const initials = nameParts.length > 1 
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : profile.name.substring(0, 2);
        
        // Assign a color based on role or index for variety
        const colors = ['blue', 'green', 'purple', 'amber', 'pink', 'indigo', 'teal'];
        const color = colors[index % colors.length];
        
        return {
          id: typeof profile.id === 'number' ? profile.id : parseInt(profile.id, 10),
          name: profile.name,
          email: profile.email,
          initials: initials.toUpperCase(),
          color: color,
          role: profile.role
        };
      });
      
      // Update user counts for each role
      const updatedRoles = [...roles];
      for (const role of updatedRoles) {
        role.userCount = fetchedUsers.filter(user => 
          user.role.toLowerCase() === role.id.toLowerCase()
        ).length;
      }
      
      setRoles(updatedRoles);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Unable to load users");
    }
  };

  const handleRolePermissionChange = async (roleId: string, permissionKey: string, value: boolean) => {
    // Update state first for immediate UI feedback
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
    
    try {
      // Fetch the permission ID from the database
      const { data: permission, error: permError } = await supabase
        .from('permissions')
        .select('id')
        .eq('name', permissionKey)
        .single();
        
      if (permError) {
        throw permError;
      }
      
      // If value is true, add the permission to the role
      if (value) {
        // Check if mapping already exists
        const { data: existingMapping } = await supabase
          .from('role_permissions')
          .select()
          .eq('role_id', roleId)
          .eq('permission_id', permission.id);
          
        if (!existingMapping || existingMapping.length === 0) {
          // Add the permission to the role
          const { error: addError } = await supabase
            .from('role_permissions')
            .insert([{
              role_id: roleId,
              permission_id: permission.id
            }]);
            
          if (addError) throw addError;
        }
      } else {
        // Remove the permission from the role
        const { error: removeError } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permission.id);
          
        if (removeError) throw removeError;
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
      
      // Revert the state change on error
      fetchRolesFromDB();
    }
  };

  const handleCategoryPermissionChange = async (roleId: string, category: string, value: boolean) => {
    // Get all permissions in the category
    const permissions = permissionCategories[category].permissions;
    
    // Update state first for immediate UI feedback
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedPermissions = { ...role.permissions };
        permissions.forEach(perm => {
          updatedPermissions[perm as Permission] = value;
        });
        
        return {
          ...role,
          permissions: updatedPermissions
        };
      }
      return role;
    }));
    
    // Update database
    try {
      // Process each permission in the category
      for (const permKey of permissions) {
        await handleRolePermissionChange(roleId, permKey, value);
      }
    } catch (error) {
      console.error('Error updating category permissions:', error);
      toast.error('Failed to update all permissions in category');
      
      // Refresh roles from DB on error
      fetchRolesFromDB();
    }
  };

  const handleUserRoleChange = async (userId: number, newRole: string) => {
    // Update state first for immediate UI feedback
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole
        };
      }
      return user;
    }));
    
    try {
      // Ensure userId is properly converted to string for Supabase
      const userIdString = userId.toString();
      
      // Update user role in the database
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userIdString);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      
      // Refresh users on error
      fetchUsers();
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    // Check if role is in use
    const roleInUse = users.some(user => user.role.toLowerCase() === roleId);
    
    if (roleInUse) {
      toast.error("Cannot delete a role assigned to users");
      return;
    }
    
    try {
      // Delete role from the database
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);
        
      if (error) throw error;
      
      // Update local state
      setRoles(roles.filter(role => role.id !== roleId));
      setConfirmDeleteRoleId(null);
      toast.success("Role successfully deleted");
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const handleCreateRole = async () => {
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
    
    try {
      // Create empty permissions object
      const permissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
      
      // Initialize all permissions as false
      const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
      allPermissionKeys.forEach(perm => {
        permissions[perm as Permission] = false;
      });
      
      // Create the role in the database
      const { data: newRoleData, error } = await supabase
        .from('roles')
        .insert([{
          id: roleId,
          name: newRoleName,
          description: newRoleDescription || `Custom role: ${newRoleName}`,
          is_system: false
        }])
        .select();
        
      if (error) throw error;
      
      // Add the new role to local state
      const newRole: RoleData = {
        id: roleId,
        name: newRoleName,
        description: newRoleDescription || `Custom role: ${newRoleName}`,
        permissions,
        isBuiltIn: false,
        userCount: 0
      };
      
      setRoles([...roles, newRole]);
      setNewRoleName("");
      setNewRoleDescription("");
      setIsCreateDialogOpen(false);
      toast.success(`Role "${newRoleName}" created successfully`);
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    }
  };

  const handleEditRole = async () => {
    if (!editingRole) return;
    
    try {
      // Update the role in the database
      const { error } = await supabase
        .from('roles')
        .update({
          name: editingRole.name,
          description: editingRole.description
        })
        .eq('id', editingRole.id);
        
      if (error) throw error;
      
      // Update local state
      setRoles(roles.map(role => role.id === editingRole.id ? editingRole : role));
      setEditingRole(null);
      toast.success(`Role "${editingRole.name}" updated successfully`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleCopyRole = async () => {
    if (!selectedRole || !copiedRoleName.trim()) return;

    const roleId = copiedRoleName.toLowerCase().replace(/\s+/g, '_');
    
    // Check if role with this ID already exists
    if (roles.some(role => role.id === roleId)) {
      toast.error("A role with a similar name already exists");
      return;
    }
    
    try {
      // Create the role in the database
      const { data: newRoleData, error } = await supabase
        .from('roles')
        .insert([{
          id: roleId,
          name: copiedRoleName,
          description: `Copy of ${selectedRole.name}`,
          is_system: false
        }])
        .select();
        
      if (error) throw error;
      
      // Copy permissions from the selected role
      const enabledPermissions = Object.entries(selectedRole.permissions)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([permName, _]) => permName);
        
      for (const permName of enabledPermissions) {
        // Get the permission ID
        const { data: permission, error: permError } = await supabase
          .from('permissions')
          .select('id')
          .eq('name', permName)
          .single();
          
        if (permError) continue;
        
        // Create the role-permission mapping
        await supabase
          .from('role_permissions')
          .insert([{
            role_id: roleId,
            permission_id: permission.id
          }]);
      }
      
      // Create a new role based on the selected role
      const newRole: RoleData = {
        ...selectedRole,
        id: roleId,
        name: copiedRoleName,
        isBuiltIn: false,
        description: `Copy of ${selectedRole.name}`,
        userCount: 0
      };

      setRoles([...roles, newRole]);
      setCopiedRoleName("");
      setSelectedRole(null);
      setIsRoleOpDialogOpen(false);
      toast.success(`Role "${copiedRoleName}" created successfully`);
    } catch (error) {
      console.error('Error copying role:', error);
      toast.error('Failed to copy role');
    }
  };

  const saveUserPermissions = async () => {
    try {
      // This function is now less important since we're updating roles immediately,
      // but we can still use it to make sure all pending changes are committed
      toast.success("User permissions saved successfully");
    } catch (error) {
      console.error('Error saving user permissions:', error);
      toast.error('Failed to save user permissions');
    }
  };

  const saveRolePermissions = async (role: RoleData) => {
    try {
      // This function is now less important since we're updating permissions immediately,
      // but we can still use it to make sure all pending changes are committed
      toast.success(`Role permissions for "${role.name}" saved successfully`);
    } catch (error) {
      console.error('Error saving role permissions:', error);
      toast.error('Failed to save role permissions');
    }
  };

  // Count how many permissions are enabled in a category for a role
  const countEnabledPermissionsInCategory = (role: RoleData, category: string) => {
    const permissions = permissionCategories[category].permissions;
    return permissions.filter(perm => role.permissions[perm as Permission]).length;
  };

  // Calculate if all permissions in a category are enabled for a role
  const areAllPermissionsEnabledInCategory = (role: RoleData, category: string) => {
    const permissions = permissionCategories[category].permissions;
    return permissions.every(perm => role.permissions[perm as Permission]);
  };

  // Format permission name for display
  const formatPermissionName = (permission: string) => {
    return permission
      .split(':')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(': ');
  };

  // Filter roles by search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter users by search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading permissions...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading roles and permissions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 animate-in fade-in duration-300">
      <Tabs defaultValue="roles" className="w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Role Management</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Role Assignment</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Role</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Role</DialogTitle>
                  <DialogDescription>
                    Enter the information for the new role. You can configure permissions after creation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input 
                      id="role-name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Ex: Support Technician"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description (optional)</Label>
                    <Input 
                      id="role-description"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                      placeholder="Ex: Role for the support technician team"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateRole}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="roles" className="space-y-6">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{ borderLeftColor: role.isBuiltIn ? 'var(--primary)' : 'var(--muted)' }}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{role.name}</CardTitle>
                      {role.isBuiltIn && (
                        <Badge variant="outline" className="font-normal">
                          System
                        </Badge>
                      )}
                      {role.userCount !== undefined && role.userCount > 0 && (
                        <Badge variant="secondary" className="font-normal">
                          {role.userCount} user{role.userCount > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleOpType('copy');
                              setCopiedRoleName(`${role.name} Copy`);
                              setIsRoleOpDialogOpen(true);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Duplicate</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Duplicate this role</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingRole(role);
                              setRoleOpType('edit');
                              setIsRoleOpDialogOpen(true);
                            }}
                            disabled={role.isBuiltIn}
                          >
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Edit details</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit the role details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <AlertDialog open={confirmDeleteRoleId === role.id} onOpenChange={(open) => !open && setConfirmDeleteRoleId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={role.isBuiltIn || (role.userCount !== undefined && role.userCount > 0)}
                          onClick={() => setConfirmDeleteRoleId(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Role</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the role <strong>{role.name}</strong>? This action is irreversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      onClick={() => saveRolePermissions(role)}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(permissionCategories).map(([category, { description, permissions }]) => {
                      const enabledCount = countEnabledPermissionsInCategory(role, category);
                      const totalCount = permissions.length;
                      const allEnabled = areAllPermissionsEnabledInCategory(role, category);
                      
                      return (
                        <AccordionItem value={`${role.id}-${category}`} key={`${role.id}-${category}`}>
                          <AccordionTrigger className="py-3 hover:bg-muted/30">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-4">
                                <Switch 
                                  checked={allEnabled} 
                                  onCheckedChange={(checked) => handleCategoryPermissionChange(role.id, category, checked)}
                                  disabled={role.isBuiltIn}
                                  className="data-[state=checked]:bg-primary"
                                />
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{category}</span>
                                  <span className="text-xs text-muted-foreground">{description}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="ml-auto mr-4">
                                {enabledCount}/{totalCount}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/20 rounded-md">
                              {permissions.map((permKey) => (
                                <div key={`${role.id}-${permKey}`} className="flex items-center justify-between space-x-4 p-2 rounded-md hover:bg-muted/40">
                                  <div className="flex items-center gap-3">
                                    <Switch 
                                      id={`${role.id}-${permKey}`}
                                      checked={role.permissions[permKey as Permission] || false}
                                      onCheckedChange={(checked) => handleRolePermissionChange(role.id, permKey, checked)}
                                      disabled={role.isBuiltIn}
                                      className="data-[state=checked]:bg-primary"
                                    />
                                    <Label 
                                      htmlFor={`${role.id}-${permKey}`}
                                      className="cursor-pointer"
                                    >
                                      {formatPermissionName(permKey)}
                                    </Label>
                                  </div>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="rounded-full bg-muted w-5 h-5 flex items-center justify-center cursor-help">
                                          <span className="text-xs">?</span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <p>{permissionDescriptions[permKey] || `Permission: ${permKey}`}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredRoles.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg">No roles found</h3>
                <p className="text-muted-foreground text-center mt-2">
                  No roles match your search. Try modifying your search criteria or create a new role.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter(null);
                  }}
                >
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="hover-scale shadow-sm">
            <CardHeader>
              <CardTitle>Role Assignment to Users</CardTitle>
              <CardDescription>Assign specific roles to users.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    variant={roleFilter === null ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter(null)}
                  >
                    All
                  </Button>
                  {roles.map((role) => (
                    <Button
                      key={`filter-${role.id}`}
                      variant={roleFilter === role.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setRoleFilter(roleFilter === role.id ? null : role.id)}
                      className="flex items-center gap-2"
                    >
                      {role.name}
                      {role.userCount !== undefined && role.userCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {role.userCount}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {filteredUsers
                    .filter(user => roleFilter === null || user.role.toLowerCase() === roleFilter)
                    .map((user) => (
                      <div key={user.id} className="border rounded-md p-4 transition-all hover:shadow">
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
                          <div className="w-[180px]">
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                              value={user.role.toLowerCase()}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                            >
                              {roles.map(role => (
                                <option key={`${user.id}-${role.id}`} value={role.id}>{role.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {filteredUsers.filter(user => roleFilter === null || user.role.toLowerCase() === roleFilter).length === 0 && (
                    <div className="text-center p-6 border rounded-md border-dashed">
                      <p className="text-muted-foreground">No users found with these criteria</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          setSearchQuery("");
                          setRoleFilter(null);
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={saveUserPermissions} className="px-8">
                    <Save className="h-4 w-4 mr-2" />
                    Save role assignments
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Role Operations Dialog (Edit & Copy) */}
      <Dialog open={isRoleOpDialogOpen} onOpenChange={setIsRoleOpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {roleOpType === 'edit' ? 'Edit Role' : 'Copy Role'}
            </DialogTitle>
            <DialogDescription>
              {roleOpType === 'edit' 
                ? 'Modify the details of the selected role.'
                : 'Create a new role based on this one.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-op-name">Role Name</Label>
              <Input 
                id="role-op-name"
                value={roleOpType === 'edit' 
                  ? editingRole?.name || '' 
                  : copiedRoleName}
                onChange={(e) => {
                  if (roleOpType === 'edit' && editingRole) {
                    setEditingRole({...editingRole, name: e.target.value});
                  } else {
                    setCopiedRoleName(e.target.value);
                  }
                }}
                placeholder="Role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-op-description">Description</Label>
              <Input 
                id="role-op-description"
                value={roleOpType === 'edit' 
                  ? editingRole?.description || '' 
                  : `Copy of ${selectedRole?.name || ''}`}
                onChange={(e) => {
                  if (roleOpType === 'edit' && editingRole) {
                    setEditingRole({...editingRole, description: e.target.value});
                  }
                  // For copy, we keep the default description
                }}
                placeholder="Role description"
                disabled={roleOpType === 'copy'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleOpDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={roleOpType === 'edit' ? handleEditRole : handleCopyRole}
            >
              {roleOpType === 'edit' ? 'Save' : 'Copy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
