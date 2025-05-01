
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Permission, rolePermissions } from '@/lib/permissions';
import { supabase } from "@/integrations/supabase/client";
import { cleanupTimeouts } from './utils';

export function usePermissions() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Record<string, Permission[]>>(rolePermissions);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  // Track mounted state to prevent updates after unmount
  const isMounted = useRef(true);
  
  // Track timeout for permission loading
  const permissionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      cleanupTimeouts(permissionTimeoutRef);
    };
  }, []);

  // Set a timeout to prevent infinite permission loading
  useEffect(() => {
    if (loadingPermissions) {
      // Set 5 second timeout for permission loading
      permissionTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && loadingPermissions) {
          console.warn("Permission loading timed out - continuing with limited permissions");
          setLoadingPermissions(false);
          setPermissionError("Permission loading timed out");
        }
      }, 5000);
    } else if (permissionTimeoutRef.current) {
      cleanupTimeouts(permissionTimeoutRef);
    }
    
    return () => {
      cleanupTimeouts(permissionTimeoutRef);
    };
  }, [loadingPermissions]);

  // Fetch user permissions when user changes
  useEffect(() => {
    // Don't start loading permissions if auth is still loading or user is not authenticated
    if (authLoading) return;
    
    const fetchUserPermissions = async () => {
      // Only start loading permissions when authenticated and we have a user
      if (!isAuthenticated || !user?.id) {
        if (loadingPermissions && isMounted.current) {
          setLoadingPermissions(false);
        }
        return;
      }
      
      setLoadingPermissions(true);
      setPermissionError(null);
      
      try {
        console.log("Fetching user permissions for user:", user.id);
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
        
        if (isMounted.current) {
          console.log("User permissions loaded:", permArray.length);
          setUserPermissions(permArray as Permission[]);
          
          // Check if user is admin based on role
          setIsAdmin(user.role === 'Admin');
        }
      } catch (error) {
        console.error('Error in permission fetch:', error);
        setPermissionError('An unexpected error occurred while loading permissions');
      } finally {
        // Always clear loading state, even on error
        if (isMounted.current) {
          setLoadingPermissions(false);
        }
      }
    };

    // Fetch permissions immediately if user is available
    if (user?.id) {
      fetchUserPermissions();
    }
  }, [user, isAuthenticated, authLoading]);

  // Fetch roles and their permissions - this is less critical, so load separately
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
        if (Object.keys(newRoles).length > 0 && isMounted.current) {
          setRoles(newRoles);
        }
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
      }
    };

    // Fetch roles with a slight delay to prioritize other operations
    setTimeout(() => {
      if (isMounted.current) {
        fetchRoles();
      }
    }, 500);
  }, [isAuthenticated]);

  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return userPermissions.includes(permission as Permission);
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return permissions.some(permission => userPermissions.includes(permission as Permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    isAdmin,
    roles,
    loadingPermissions,
    permissionError
  };
}
