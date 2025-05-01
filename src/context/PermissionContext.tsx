
import React, { createContext, useContext } from 'react';

interface PermissionContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  hasPermission: () => true,
  hasAnyPermission: () => true,
  isAdmin: false
});

export const usePermission = () => {
  return useContext(PermissionContext);
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PermissionContext.Provider 
      value={{
        hasPermission: () => true,
        hasAnyPermission: () => true,
        isAdmin: false
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
