
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Permission } from '@/lib/permissions';
import { useAuth } from '@/context/AuthContext';

interface PermissionContextType {
  userRole: string | null;
  userPermissions: Permission[];
  isAdmin: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  setUserPermissions: (permissions: Permission[]) => void;
  setUserRole: (role: string | null) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  // Effect to load user permissions when user changes
  useEffect(() => {
    if (user?.user_metadata?.role) {
      setUserRole(user.user_metadata.role);
      
      // Load permissions from user metadata or fetch from backend
      // This is a placeholder - in a real app you would fetch this data
      // or extract it from the user's JWT claims
    }
  }, [user]);

  // Determine if the user has admin privileges
  const isAdmin = userRole === 'Admin';

  // Check if the user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (isAdmin) return true;
    return userPermissions.includes(permission);
  };

  // Check if the user has any of the provided permissions
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (isAdmin) return true;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Check if the user has all of the provided permissions
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (isAdmin) return true;
    return permissions.every(permission => userPermissions.includes(permission));
  };

  const value = {
    userRole,
    userPermissions,
    isAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    setUserPermissions,
    setUserRole
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
