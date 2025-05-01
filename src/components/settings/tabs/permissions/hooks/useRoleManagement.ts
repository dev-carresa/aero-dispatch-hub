
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RoleData } from "../types";
import { Permission } from "@/lib/permissions";

export function useRoleManagement(
  roles: RoleData[],
  setRoles: React.Dispatch<React.SetStateAction<RoleData[]>>,
  users: any[]
) {
  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteRole = async (roleId: string) => {
    try {
      // Check if role is in use
      const roleInUse = users.some(user => {
        const role = roles.find(r => r.id === roleId);
        return role && user.role === role.name;
      });
      
      if (roleInUse) {
        toast.error("Impossible de supprimer un rôle attribué à des utilisateurs");
        return false;
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
      const allPermissionKeys = Object.values(roles[0]?.permissions || {}).keys();
      Array.from(allPermissionKeys).forEach(perm => {
        permissions[perm as unknown as Permission] = false;
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

  return {
    isSaving,
    handleDeleteRole,
    handleCreateRole,
    handleCopyRole
  };
}
