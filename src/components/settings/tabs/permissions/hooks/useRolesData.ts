
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RoleData, UserData, permissionCategories } from "../types";
import { Permission } from "@/lib/permissions";

export function useRolesData() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Initialize role data on component mount
  useEffect(() => {
    fetchRolesFromDB();
    fetchUsers();
  }, []);

  return {
    roles,
    setRoles,
    users,
    setUsers,
    isLoading
  };
}
