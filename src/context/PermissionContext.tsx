
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Permission, hasPermission, hasAnyPermission } from "@/lib/permissions";
import { UserRole } from "@/types/user";

interface PermissionContextType {
  userRole: UserRole | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  isAdmin: boolean;
  isDriver: boolean;
  isFleet: boolean;
  isDispatcher: boolean;
  isCustomer: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  // Get the user's role from the profile
  const userRole = user?.user_metadata?.role as UserRole | null;

  // Helper functions to check specific roles
  const isAdmin = userRole === "Admin";
  const isDriver = userRole === "Driver";
  const isFleet = userRole === "Fleet";
  const isDispatcher = userRole === "Dispatcher";
  const isCustomer = userRole === "Customer";

  // Check if the user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
  };

  // Check if the user has any of the specified permissions
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return hasAnyPermission(userRole, permissions);
  };

  return (
    <PermissionContext.Provider
      value={{
        userRole,
        hasPermission: checkPermission,
        hasAnyPermission: checkAnyPermission,
        isAdmin,
        isDriver,
        isFleet,
        isDispatcher,
        isCustomer,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
