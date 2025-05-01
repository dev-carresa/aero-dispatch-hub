
import React, { createContext, useContext } from 'react';
import { PermissionContextType } from './types';
import { usePermissions } from './usePermissions';

// Create the context with default values
const PermissionContext = createContext<PermissionContextType>({
  hasPermission: () => false,
  hasAnyPermission: () => false,
  isAdmin: false,
  roles: {},
  loadingPermissions: true
});

// Hook for consuming the permission context
export const usePermission = () => {
  return useContext(PermissionContext);
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    hasPermission,
    hasAnyPermission,
    isAdmin,
    roles,
    loadingPermissions,
    permissionError,
    forceResetPermissionsLoading,
    userPermissions
  } = usePermissions();

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        isAdmin,
        roles,
        loadingPermissions,
        permissionError,
        forceResetPermissionsLoading,
        userPermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
