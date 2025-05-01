
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Permission, rolePermissions } from '@/lib/permissions';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface PermissionContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
  roles: Record<string, Permission[]>;
  loadingPermissions: boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  hasPermission: () => false,
  hasAnyPermission: () => false,
  isAdmin: false,
  roles: rolePermissions,
  loadingPermissions: true
});

export const usePermission = () => {
  return useContext(PermissionContext);
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Record<string, Permission[]>>(rolePermissions);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Fetch user permissions when user changes
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user?.id) return;
      
      setLoadingPermissions(true);
      try {
        // Fetch user permissions from database
        const { data: permissions, error } = await supabase
          .rpc('get_user_permissions', { user_id: user.id });
        
        if (error) {
          console.error('Error fetching user permissions:', error);
          return;
        }
        
        // Format permissions into array of permission strings
        const permArray = permissions?.map(p => p.permission_name) || [];
        setUserPermissions(permArray as Permission[]);
        
        // Check if user is admin based on role
        setIsAdmin(user.role === 'Admin');
      } catch (error) {
        console.error('Error in permission fetch:', error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    // Fetch all roles and their permissions
    const fetchRoles = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Get all roles
        const { data: rolesData, error: rolesError } = await supabase
          .rpc('get_all_roles');
        
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          return;
        }
        
        // Get all role permissions
        const { data: rolePermData, error: permError } = await supabase
          .rpc('get_role_permissions');
        
        if (permError) {
          console.error('Error fetching role permissions:', permError);
          return;
        }
        
        // Build the role-permission map
        const newRoles: Record<string, Permission[]> = {};
        
        rolesData.forEach((role) => {
          const roleName = role.name;
          const rolePerms = rolePermData
            .filter(rp => rp.role_id === role.id)
            .map(rp => rp.permission_name);
          
          newRoles[roleName] = rolePerms as Permission[];
        });
        
        // If we got data back, update the roles state
        if (Object.keys(newRoles).length > 0) {
          setRoles(newRoles);
        }
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserPermissions();
      fetchRoles();
    } else {
      setLoadingPermissions(false);
    }
  }, [user, isAuthenticated]);

  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return userPermissions.includes(permission as Permission);
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return permissions.some(permission => userPermissions.includes(permission as Permission));
  };

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        isAdmin,
        roles,
        loadingPermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
