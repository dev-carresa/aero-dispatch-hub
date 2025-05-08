
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Permission, rolePermissions as defaultRolePermissions } from '@/lib/permissions';
import { supabase } from '@/integrations/supabase/client';

interface PermissionContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
  roles: Record<string, Permission[]>;
}

const PermissionContext = createContext<PermissionContextType>({
  hasPermission: () => false,
  hasAnyPermission: () => false,
  isAdmin: false,
  roles: defaultRolePermissions
});

export const usePermission = () => {
  return useContext(PermissionContext);
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userRole = user?.role || 'Customer';
  const isAdmin = userRole === 'Admin';
  const [rolePermissions, setRolePermissions] = useState<Record<string, Permission[]>>(defaultRolePermissions);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch roles and permissions from the database
    const fetchRolesAndPermissions = async () => {
      try {
        setLoading(true);
        
        // First, check if permissions table is populated
        const { data: permissions, error: permError } = await supabase
          .from('permissions')
          .select('*');
          
        if (permError) throw permError;
        
        // If permissions table is empty, we need to populate it
        if (!permissions || permissions.length === 0) {
          // Populate permissions from our default list
          const allPermissions = new Set<string>();
          Object.values(defaultRolePermissions).forEach(perms => {
            perms.forEach(p => allPermissions.add(p));
          });
          
          // Insert all permissions into the database
          const permissionsToInsert = Array.from(allPermissions).map(name => ({
            name,
            description: `Permission for ${name}`
          }));
          
          const { error: insertError } = await supabase
            .from('permissions')
            .insert(permissionsToInsert);
            
          if (insertError) throw insertError;
        }
        
        // Get roles and their permissions
        const { data: roles, error: rolesError } = await supabase
          .from('roles')
          .select('*');
          
        if (rolesError) throw rolesError;
        
        // Get role-permission mappings
        const { data: rolePermMappings, error: mappingError } = await supabase
          .from('role_permissions')
          .select('role_id, permission_id, permissions(name)');
          
        if (mappingError) throw mappingError;
        
        // Build role permissions map
        const dbRolePermissions: Record<string, Permission[]> = {};
        
        if (roles && roles.length > 0) {
          // Initialize each role with an empty permissions array
          roles.forEach(role => {
            dbRolePermissions[role.name] = [];
          });
          
          // Add permissions to each role
          rolePermMappings?.forEach(mapping => {
            const roleName = roles.find(r => r.id === mapping.role_id)?.name;
            if (roleName && mapping.permissions?.name) {
              dbRolePermissions[roleName].push(mapping.permissions.name as Permission);
            }
          });
          
          setRolePermissions(dbRolePermissions);
        } else {
          // If no roles in the database, use the default ones
          setRolePermissions(defaultRolePermissions);
        }
        
        // Get current user's permissions based on their role
        if (user) {
          const userPerms = dbRolePermissions[userRole] || defaultRolePermissions[userRole] || [];
          setUserPermissions(userPerms);
        }
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
        // Fallback to default permissions if there's an error
        setRolePermissions(defaultRolePermissions);
        const userPerms = defaultRolePermissions[userRole] || [];
        setUserPermissions(userPerms);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolesAndPermissions();
  }, [user, userRole]);
  
  // Get permissions for the current user role
  const currentUserPermissions = isAdmin 
    ? Object.values(rolePermissions).flat() // Admin has all permissions
    : userPermissions;
  
  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return currentUserPermissions.includes(permission as Permission);
  };
  
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isAdmin) return true; // Admin has all permissions
    return permissions.some(permission => currentUserPermissions.includes(permission as Permission));
  };
  
  // Log permissions for debugging
  useEffect(() => {
    console.log('Current user role:', userRole);
    console.log('Is admin:', isAdmin);
    console.log('User permissions:', currentUserPermissions);
  }, [userRole, isAdmin, currentUserPermissions]);

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        isAdmin,
        roles: rolePermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
