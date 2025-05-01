
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RoleData, permissionCategories } from "../types";
import { Permission } from "@/lib/permissions";

export function useRolePermissions(roles: RoleData[], setRoles: React.Dispatch<React.SetStateAction<RoleData[]>>) {
  const [isSaving, setIsSaving] = useState(false);

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

  return {
    isSaving,
    handleRolePermissionChange,
    handleCategoryPermissionChange,
    saveRolePermissions
  };
}
