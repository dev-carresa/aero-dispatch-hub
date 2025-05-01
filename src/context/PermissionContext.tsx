
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Permission, rolePermissions } from "@/lib/permissions";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

interface PermissionContextType {
  userRole: UserRole | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  isAdmin: boolean;
  isDriver: boolean;
  isFleet: boolean;
  isDispatcher: boolean;
  isCustomer: boolean;
  loading: boolean;
  userPermissions: Permission[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Helper functions to check specific roles
  const isAdmin = userRole === "Admin";
  const isDriver = userRole === "Driver";
  const isFleet = userRole === "Fleet";
  const isDispatcher = userRole === "Dispatcher";
  const isCustomer = userRole === "Customer";

  // Fetch user role and permissions from the database
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setUserPermissions([]);
      return;
    }
    
    // Fast path: Set initial role from metadata to avoid loading state
    if (user.user_metadata?.role) {
      const initialRole = user.user_metadata.role as UserRole;
      setUserRole(initialRole);
      setUserPermissions(rolePermissions[initialRole] || []);
    } else {
      // Default role as fallback
      setUserRole("Customer");
      setUserPermissions(rolePermissions.Customer || []);
    }
    
    // Then fetch from database in background
    const fetchUserRoleAndPermissions = async () => {
      try {
        // First get the user's role from profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData?.role) {
          // Set the role from profile data
          const role = profileData.role as UserRole;
          setUserRole(role);
          setUserPermissions(rolePermissions[role] || []);
        }
      } catch (error) {
        console.error('Error in permission context:', error);
      }
    };

    fetchUserRoleAndPermissions();
  }, [user]);

  // Check if the user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    
    // Admin always has all permissions
    if (userRole === "Admin") return true;
    
    // Check if the permission exists in the userPermissions array
    return userPermissions.includes(permission);
  };

  // Check if the user has any of the specified permissions
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    
    // Admin always has all permissions
    if (userRole === "Admin") return true;
    
    // Check if any of the permissions exist in the userPermissions array
    return permissions.some(permission => userPermissions.includes(permission));
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
        loading: false, // Always return false for loading
        userPermissions
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
