
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Permission, rolePermissions } from '@/lib/permissions';

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
  roles: rolePermissions
});

export const usePermission = () => {
  return useContext(PermissionContext);
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userRole = user?.role || 'Customer';
  const isAdmin = userRole === 'Admin';
  
  // Get permissions for the current user role
  const userPermissions = rolePermissions[userRole] || [];
  
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
        roles: rolePermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
