
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { UserRole } from '@/types/user';
import { Permission, hasRolePermission, hasRoleAnyPermission } from '@/lib/permissions';

// Define the context type
interface PermissionContextType {
  userRole: UserRole | null;
  isAdmin: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  setUserRole: (role: UserRole | null) => void;
}

// Create the context with default values
const PermissionContext = createContext<PermissionContextType>({
  userRole: null,
  isAdmin: false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  setUserRole: () => {},
});

// Define the provider props
interface PermissionProviderProps {
  children: ReactNode;
  initialRole?: UserRole | null;
}

// Create the PermissionProvider component
export const PermissionProvider = ({ children, initialRole = null }: PermissionProviderProps) => {
  const [userRole, setUserRole] = useState<UserRole | null>(initialRole);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(userRole === 'Admin');
  }, [userRole]);

  const hasPermission = (permission: Permission): boolean => {
    // If the user is an admin, they have all permissions
    if (isAdmin) return true;
    
    // If there's no role, return false
    if (!userRole) return false;
    
    // Check if the role has the specified permission
    return hasRolePermission(userRole, permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    // If the user is an admin, they have all permissions
    if (isAdmin) return true;
    
    // If there's no role, return false
    if (!userRole) return false;
    
    // Check if the role has any of the specified permissions
    return hasRoleAnyPermission(userRole, permissions);
  };

  return (
    <PermissionContext.Provider value={{ 
      userRole, 
      isAdmin, 
      hasPermission, 
      hasAnyPermission, 
      setUserRole 
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

// Create a hook to use the permission context
export const usePermission = () => useContext(PermissionContext);
