
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserData, RoleData } from "../types";

export function useUserRoles(
  users: UserData[],
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>,
  roles: RoleData[]
) {
  const [isSaving, setIsSaving] = useState(false);

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

  return {
    isSaving,
    handleUserRoleChange,
    saveUserPermissions
  };
}
