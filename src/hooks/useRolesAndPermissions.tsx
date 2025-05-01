
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePermission } from "@/context/PermissionContext";
import { RoleData, UserData } from "@/types/permission";
import { supabase } from "@/integrations/supabase/client";
import { Permission } from "@/lib/permissions";
import { 
  getAllRoles, 
  getAllPermissions, 
  createRole,
  updateRole, 
  deleteRole, 
  addPermissionToRole, 
  removePermissionFromRole, 
  updateUserRole 
} from "@/services/permissionService";
import { permissionCategories } from "@/types/permission";

export function useRolesAndPermissions() {
  const { roles: rolePermissions } = usePermission();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [permissions, setPermissions] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Fetch all permissions
  const fetchPermissions = async () => {
    try {
      const { data, success } = await getAllPermissions();
      if (success && data) {
        setPermissions(data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error("Impossible de charger les permissions");
    }
  };

  // Fetch roles from the database or initialize from predefined permissions
  const fetchRolesFromDB = async () => {
    setIsLoading(true);
    try {
      const { data: rolesData, success } = await getAllRoles();
      
      if (success && rolesData && rolesData.length > 0) {
        // Convert to the format needed by the UI
        const formattedRoles: RoleData[] = rolesData.map(role => {
          // Create an object with all permissions set to false by default
          const allPermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
          
          // Initialize all possible permissions as false
          const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
          allPermissionKeys.forEach(perm => {
            allPermissions[perm as Permission] = false;
          });
          
          // Set the permissions this role has to true
          const rolePerms = role.permissions || [];
          rolePerms.forEach(perm => {
            allPermissions[perm as Permission] = true;
          });
          
          // Return the role data structure
          return {
            id: role.id,
            name: role.name,
            description: role.description || `${role.name} role`,
            permissions: allPermissions,
            isBuiltIn: role.is_system || false,
            userCount: 0 // Will be updated when we fetch users
          };
        });
        
        setRoles(formattedRoles);
      }
      
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Impossible de charger les rôles");
    } finally {
      setIsLoading(false);
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
          id: profile.id,
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
          user.role.toLowerCase() === role.name.toLowerCase()
        ).length;
      }
      
      setRoles(updatedRoles);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Impossible de charger les utilisateurs");
    }
  };

  const handleRolePermissionChange = async (roleId: string, permissionKey: string, value: boolean) => {
    // Find the permission ID
    const permission = permissions.find(p => p.name === permissionKey);
    if (!permission) {
      toast.error(`Permission ${permissionKey} not found`);
      return;
    }
    
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
      // Update the database
      if (value) {
        await addPermissionToRole(roleId, permission.id);
      } else {
        await removePermissionFromRole(roleId, permission.id);
      }
      toast.success(`Permission mise à jour avec succès`);
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
      
      // Revert the state change on error
      fetchRolesFromDB();
    }
  };

  const handleCategoryPermissionChange = async (roleId: string, category: string, value: boolean) => {
    // Get all permissions in the category
    const permissionKeys = permissionCategories[category].permissions;
    
    // Update state first for immediate UI feedback
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedPermissions = { ...role.permissions };
        permissionKeys.forEach(perm => {
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
      for (const permKey of permissionKeys) {
        await handleRolePermissionChange(roleId, permKey, value);
      }
    } catch (error) {
      console.error('Error updating category permissions:', error);
      toast.error('Failed to update all permissions in category');
      
      // Refresh roles from DB on error
      fetchRolesFromDB();
    }
  };

  const handleUserRoleChange = async (userId: string, newRoleName: string) => {
    // Find the role ID
    const role = roles.find(r => r.name === newRoleName);
    if (!role) {
      toast.error(`Role ${newRoleName} not found`);
      return;
    }
    
    // Update state first for immediate UI feedback
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRoleName
        };
      }
      return user;
    }));
    
    try {
      // Update user role in the database
      await updateUserRole(userId, role.id);
      toast.success(`Rôle de l'utilisateur mis à jour avec succès`);
      
      // Update the role user counts
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      
      // Refresh users on error
      fetchUsers();
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    // Check if role is in use
    const roleInUse = users.some(user => {
      const role = roles.find(r => r.id === roleId);
      return role && user.role.toLowerCase() === role.name.toLowerCase();
    });
    
    if (roleInUse) {
      toast.error("Impossible de supprimer un rôle attribué à des utilisateurs");
      return;
    }
    
    try {
      // Delete role from the database
      const { success } = await deleteRole(roleId);
      
      if (success) {
        // Update local state
        setRoles(roles.filter(role => role.id !== roleId));
        toast.success("Rôle supprimé avec succès");
      } else {
        throw new Error("Failed to delete role");
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const handleCreateRole = async (newRoleName: string, newRoleDescription?: string) => {
    if (!newRoleName.trim()) {
      toast.error("Le nom du rôle ne peut pas être vide");
      return;
    }
    
    try {
      // Create the role in the database
      const { data: newRoleData, success } = await createRole(
        newRoleName, 
        newRoleDescription || `Custom role: ${newRoleName}`
      );
      
      if (!success || !newRoleData) {
        throw new Error("Failed to create role");
      }
      
      // Create empty permissions object
      const permissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
      
      // Initialize all permissions as false
      const allPermissionKeys = Object.values(permissionCategories).flatMap(cat => cat.permissions);
      allPermissionKeys.forEach(perm => {
        permissions[perm as Permission] = false;
      });
      
      // Add the new role to local state
      const newRole: RoleData = {
        id: newRoleData.id,
        name: newRoleName,
        description: newRoleDescription || `Custom role: ${newRoleName}`,
        permissions,
        isBuiltIn: false,
        userCount: 0
      };
      
      setRoles([...roles, newRole]);
      toast.success(`Rôle "${newRoleName}" créé avec succès`);
      return true;
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
      return false;
    }
  };

  const handleEditRole = async (editingRole: RoleData) => {
    try {
      // Update the role in the database
      const { success } = await updateRole(editingRole.id, {
        name: editingRole.name,
        description: editingRole.description
      });
      
      if (!success) {
        throw new Error("Failed to update role");
      }
      
      // Update local state
      setRoles(roles.map(role => role.id === editingRole.id ? editingRole : role));
      toast.success(`Rôle "${editingRole.name}" mis à jour avec succès`);
      return true;
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
      return false;
    }
  };

  const handleCopyRole = async (selectedRole: RoleData, copiedRoleName: string) => {
    if (!copiedRoleName.trim()) return false;

    try {
      // Create the role in the database
      const { data: newRoleData, success } = await createRole(
        copiedRoleName,
        `Copy of ${selectedRole.name}`
      );
      
      if (!success || !newRoleData) {
        throw new Error("Failed to create role");
      }
      
      // Copy permissions from the selected role
      const enabledPermissions = Object.entries(selectedRole.permissions)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([permName, _]) => permName);
        
      for (const permName of enabledPermissions) {
        // Find permission ID
        const permission = permissions.find(p => p.name === permName);
        if (permission) {
          await addPermissionToRole(newRoleData.id, permission.id);
        }
      }
      
      // Create a new role based on the selected role
      const newRole: RoleData = {
        ...selectedRole,
        id: newRoleData.id,
        name: copiedRoleName,
        isBuiltIn: false,
        description: `Copy of ${selectedRole.name}`,
        userCount: 0
      };

      setRoles([...roles, newRole]);
      toast.success(`Rôle "${copiedRoleName}" créé avec succès`);
      
      // Refresh to get the updated data
      fetchRolesFromDB();
      return true;
    } catch (error) {
      console.error('Error copying role:', error);
      toast.error('Failed to copy role');
      return false;
    }
  };

  const saveUserPermissions = async () => {
    toast.success("Permissions des utilisateurs enregistrées avec succès");
    return true;
  };

  const saveRolePermissions = async (role: RoleData) => {
    toast.success(`Permissions pour le rôle "${role.name}" enregistrées avec succès`);
    return true;
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

  // Filter roles by search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter users by search query and role
  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (roleFilter === null || user.role.toLowerCase() === roleFilter)
  );

  // Initialize data
  useEffect(() => {
    fetchRolesFromDB();
    fetchUsers();
    fetchPermissions();
  }, []);

  return {
    roles,
    users,
    permissions,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredRoles,
    filteredUsers,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    handleUserRoleChange,
    handleDeleteRole,
    handleCreateRole,
    handleEditRole,
    handleCopyRole,
    saveUserPermissions,
    saveRolePermissions,
    countEnabledPermissionsInCategory,
    areAllPermissionsEnabledInCategory,
    fetchRolesFromDB,
    fetchUsers
  };
}
