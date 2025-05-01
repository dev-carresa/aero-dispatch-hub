import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RoleData, UserData, permissionCategories } from "../types";
import { Permission } from "@/lib/permissions";

export function useRolesManager() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch roles from the database
  const fetchRolesFromDB = async () => {
    setIsLoading(true);
    try {
      // Get all roles
      const { data: rolesData, error: rolesError } = await supabase
        .rpc('get_all_roles');
      
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        toast.error("Impossible de charger les rôles");
        setIsLoading(false);
        return;
      }
      
      // Get all permissions (to know what permissions exist)
      const { data: permissionsData, error: permissionsError } = await supabase
        .rpc('get_all_permissions');
      
      if (permissionsError) {
        console.error("Error fetching permissions:", permissionsError);
        toast.error("Impossible de charger les permissions");
        setIsLoading(false);
        return;
      }
      
      // Get all role-permission mappings
      const { data: rolePermData, error: rolePermError } = await supabase
        .rpc('get_role_permissions');
      
      if (rolePermError) {
        console.error("Error fetching role permissions:", rolePermError);
        toast.error("Impossible de charger les associations rôle-permission");
        setIsLoading(false);
        return;
      }
      
      // Build roles with their permissions
      const allPermissions = permissionsData.map(p => p.name as Permission);
      
      const initialRoles: RoleData[] = rolesData.map(role => {
        // Create an object with all permissions set to false by default
        const rolePermissions: Record<Permission, boolean> = {} as Record<Permission, boolean>;
        
        // Initialize all permissions as false
        allPermissions.forEach(perm => {
          rolePermissions[perm] = false;
        });
        
        // Set the permissions this role has to true
        const rolePermList = rolePermData
          .filter(rp => rp.role_id === role.id)
          .map(rp => rp.permission_name);
        
        rolePermList.forEach(perm => {
          rolePermissions[perm as Permission] = true;
        });
        
        // Return the role data structure
        return {
          id: role.id,
          name: role.name,
          permissions: rolePermissions,
          isBuiltIn: role.is_system || false,
          description: role.description || `${role.name} role`,
          userCount: 0 // Will be updated when we fetch users
        };
      });
      
      setRoles(initialRoles);
    } catch (error) {
      console.error("Error in fetchRolesFromDB:", error);
      toast.error("Une erreur est survenue lors du chargement des rôles");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, role_id')
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
          id: index, // Use as a key in the UI
          actualId: profile.id, // Store actual UUID for database operations
          name: profile.name,
          email: profile.email,
          initials: initials.toUpperCase(),
          color: color,
          role: profile.role
        };
      });
      
      // Update role user counts
      const roleCounts: Record<string, number> = {};
      fetchedUsers.forEach(user => {
        if (roleCounts[user.role]) {
          roleCounts[user.role]++;
        } else {
          roleCounts[user.role] = 1;
        }
      });
      
      setRoles(prevRoles => 
        prevRoles.map(role => ({
          ...role,
          userCount: roleCounts[role.name] || 0
        }))
      );
      
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Impossible de charger les utilisateurs");
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

  const handleCategoryPermissionChange = (roleId: string, category: string, value: boolean) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const updatedPermissions = { ...role.permissions };
        permissionCategories[category].permissions.forEach(perm => {
          updatedPermissions[perm as Permission] = value;
        });
        
        return {
          ...role,
          permissions: updatedPermissions
        };
      }
      return role;
    }));
  };

  const handleUserRoleChange = async (userId: string, newRoleId: string) => {
    try {
      // Find the role name from the role ID
      const role = roles.find(r => r.id === newRoleId);
      if (!role) {
        toast.error("Rôle introuvable");
        return;
      }

      // Update user's role in Supabase
      const { error } = await supabase.rpc('update_user_role', {
        p_user_id: userId,
        p_role_id: newRoleId
      });

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(users.map(user => {
        if (user.actualId === userId) {
          return {
            ...user,
            role: role.name
          };
        }
        return user;
      }));

      toast.success(`Le rôle de l'utilisateur a été mis à jour avec succès`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Impossible de mettre à jour le rôle de l'utilisateur");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      // Check if role is in use
      const roleInUse = users.some(user => {
        const role = roles.find(r => r.id === roleId);
        return role && user.role === role.name;
      });
      
      if (roleInUse) {
        toast.error("Impossible de supprimer un rôle attribué à des utilisateurs");
        return;
      }
      
      // Delete the role from the database
      const { error } = await supabase.rpc('delete_role', {
        p_role_id: roleId
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setRoles(roles.filter(role => role.id !== roleId));
      
      toast.success("Rôle supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Impossible de supprimer le rôle");
      return false;
    }
  };

  const handleCreateRole = async (name: string, description: string) => {
    if (!name.trim()) {
      toast.error("Le nom du rôle ne peut pas être vide");
      return null;
    }
    
    try {
      // Create role in the database
      const { data: roleId, error } = await supabase.rpc('create_role', {
        p_name: name,
        p_description: description || `Custom role: ${name}`
      });
      
      if (error) {
        throw error;
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
        id: roleId,
        name,
        description: description || `Custom role: ${name}`,
        permissions,
        isBuiltIn: false,
        userCount: 0
      };
      
      setRoles([...roles, newRole]);
      
      toast.success(`Rôle "${name}" créé avec succès`);
      return newRole;
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Impossible de créer le rôle");
      return null;
    }
  };

  const handleCopyRole = async (selectedRole: RoleData, copiedRoleName: string) => {
    if (!selectedRole || !copiedRoleName.trim()) return null;

    try {
      // Create role in the database
      const { data: roleId, error } = await supabase.rpc('create_role', {
        p_name: copiedRoleName,
        p_description: `Copy of ${selectedRole.name}`
      });
      
      if (error) {
        throw error;
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

      // Add the new role to local state
      setRoles([...roles, newRole]);
      
      // For each permission that is enabled in the original role, add it to the new role
      const enabledPermissions = Object.entries(selectedRole.permissions)
        .filter(([_, enabled]) => enabled)
        .map(([perm]) => perm);
      
      // Add each permission to the role (in sequence to avoid race conditions)
      for (const perm of enabledPermissions) {
        await supabase.rpc('add_permission_to_role_by_name', {
          p_role_id: roleId,
          p_permission_name: perm
        });
      }

      toast.success(`Rôle "${copiedRoleName}" créé avec succès`);
      return newRole;
    } catch (error) {
      console.error("Error copying role:", error);
      toast.error("Impossible de dupliquer le rôle");
      return null;
    }
  };

  const saveRolePermissions = async (role: RoleData) => {
    setIsSaving(true);
    try {
      // For each permission, determine if it needs to be added or removed
      const allPermissionKeys = Object.keys(role.permissions) as Permission[];
      
      for (const permKey of allPermissionKeys) {
        const isEnabled = role.permissions[permKey];
        
        // Check if this is a built-in role
        if (role.isBuiltIn) {
          // Skip updates for built-in roles
          continue;
        }
        
        if (isEnabled) {
          // Add permission to role if it doesn't already have it
          await supabase.rpc('add_permission_to_role_by_name', {
            p_role_id: role.id,
            p_permission_name: permKey
          });
        } else {
          // Remove permission from role if it has it
          await supabase.rpc('remove_permission_from_role_by_name', {
            p_role_id: role.id,
            p_permission_name: permKey
          });
        }
      }
      
      toast.success(`Permissions pour le rôle "${role.name}" enregistrées avec succès`);
      return true;
    } catch (error) {
      console.error("Error saving role permissions:", error);
      toast.error(`Impossible d'enregistrer les permissions pour le rôle "${role.name}"`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveUserPermissions = async () => {
    setIsSaving(true);
    try {
      // We've already saved user role changes as they were made
      toast.success("Permissions des utilisateurs enregistrées avec succès");
      return true;
    } catch (error) {
      console.error("Error saving user permissions:", error);
      toast.error("Impossible d'enregistrer les permissions des utilisateurs");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize role data on component mount
  useEffect(() => {
    fetchRolesFromDB();
    fetchUsers();
  }, []);

  return {
    roles,
    users,
    isLoading,
    isSaving,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    handleUserRoleChange,
    handleDeleteRole,
    handleCreateRole,
    handleCopyRole,
    saveRolePermissions,
    saveUserPermissions
  };
}
