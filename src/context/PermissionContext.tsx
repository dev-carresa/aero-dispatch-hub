
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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Record<string, Permission[]>>(rolePermissions);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Fetch user permissions when user changes
  useEffect(() => {
    // Don't start loading permissions if auth is still loading or user is not authenticated
    if (authLoading) return;
    
    const fetchUserPermissions = async () => {
      // Only start loading permissions when authenticated and we have a user
      if (!isAuthenticated || !user?.id) {
        setLoadingPermissions(false);
        return;
      }
      
      setLoadingPermissions(true);
      setPermissionError(null);
      
      try {
        // Fetch user permissions from database
        const { data: permissions, error } = await supabase
          .rpc('get_user_permissions', { user_id: user.id });
        
        if (error) {
          console.error('Error fetching user permissions:', error);
          setPermissionError('Failed to load user permissions');
          return;
        }
        
        // Format permissions into array of permission strings
        const permArray = permissions?.map(p => p.permission_name) || [];
        setUserPermissions(permArray as Permission[]);
        
        // Check if user is admin based on role
        setIsAdmin(user.role === 'Admin');
      } catch (error) {
        console.error('Error in permission fetch:', error);
        setPermissionError('An unexpected error occurred while loading permissions');
      } finally {
        // Always clear loading state, even on error
        setLoadingPermissions(false);
      }
    };

    // Fetch permissions with a slight delay to prioritize UI rendering
    const timeoutId = setTimeout(() => {
      fetchUserPermissions();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, isAuthenticated, authLoading]);

  // Fetch roles and their permissions separately to avoid blocking the UI
  useEffect(() => {
    // Only fetch roles if authenticated
    if (!isAuthenticated) return;
    
    const fetchRoles = async () => {
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

    // Give priority to user permissions loading before fetching roles
    const timeoutId = setTimeout(() => {
      fetchRoles();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated]);

  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return userPermissions.includes(permission as Permission);
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return permissions.some(permission => userPermissions.includes(permission as Permission));
  };

  // Don't block UI rendering if there's an error loading permissions
  if (permissionError) {
    console.warn('Permission loading error:', permissionError);
    // Continue with limited permissions instead of blocking the UI
  }

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
