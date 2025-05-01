
import { usePermission } from '@/context/PermissionContext';
import { Permission } from '@/lib/permissions';

// A hook to easily check permissions within components
export function useRolePermission() {
  const { 
    hasPermission, 
    hasAnyPermission, 
    userRole, 
    isAdmin,
    isDriver,
    isFleet,
    isDispatcher,
    isCustomer
  } = usePermission();

  return {
    // Pass a permission to check if the user has it
    can: (permission: Permission) => hasPermission(permission),
    
    // Pass multiple permissions to check if the user has any of them
    canAny: (permissions: Permission[]) => hasAnyPermission(permissions),
    
    // Pass multiple permissions to check if the user has all of them
    canAll: (permissions: Permission[]) => permissions.every(p => hasPermission(p)),
    
    // Current user role
    userRole,
    
    // Role shortcuts
    isAdmin,
    isDriver,
    isFleet,
    isDispatcher,
    isCustomer,
    
    // Helper for conditional rendering
    check: (permission: Permission | Permission[], fallback: React.ReactNode = null) => {
      if (Array.isArray(permission)) {
        return hasAnyPermission(permission) ? true : fallback;
      }
      return hasPermission(permission) ? true : fallback;
    }
  };
}
