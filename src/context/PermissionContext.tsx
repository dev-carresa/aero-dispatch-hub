
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
  const [loading, setLoading] = useState(true);
  
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
      setLoading(false);
      return;
    }
    
    // Fast path: Set initial role from metadata to avoid loading state
    if (user.user_metadata?.role) {
      const initialRole = user.user_metadata.role as UserRole;
      console.log("Setting initial role from metadata:", initialRole);
      setUserRole(initialRole);
      
      // If user is Admin, set all permissions
      if (initialRole === "Admin") {
        setUserPermissions(rolePermissions.Admin || []);
      } else {
        setUserPermissions(rolePermissions[initialRole] || []);
      }
      
      // Still set loading to false to avoid flicker
      setLoading(false);
    }
    
    // Then fetch from database in background
    const fetchUserRoleAndPermissions = async () => {
      try {
        setLoading(true);
        
        // First get the user's role from profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user role:', profileError);
          return;
        }

        if (profileData?.role) {
          // Set the role from profile data
          const role = profileData.role as UserRole;
          console.log("Fetched role from database:", role);
          setUserRole(role);
          
          // If user is Admin, set all permissions directly
          if (role === "Admin") {
            setUserPermissions(rolePermissions.Admin || []);
          } else {
            // For non-admin users, try to fetch their specific permissions
            try {
              const { data: permissionsData, error: permissionsError } = await supabase
                .functions.invoke('get_user_permissions', {
                  body: { user_id: user.id }
                });
              
              if (permissionsError) throw permissionsError;
              
              if (Array.isArray(permissionsData)) {
                console.log("Fetched permissions:", permissionsData);
                setUserPermissions(permissionsData as Permission[]);
              } else {
                // Fallback to role-based permissions
                setUserPermissions(rolePermissions[role] || []);
              }
            } catch (permError) {
              console.error('Error fetching user permissions:', permError);
              // Fallback to role-based permissions
              setUserPermissions(rolePermissions[role] || []);
            }
          }
        }
      } catch (error) {
        console.error('Error in permission context:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndPermissions();
  }, [user]);

  // Check if the user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    // No permissions without a role
    if (!userRole) return false;
    
    // Admin always has all permissions
    if (userRole === "Admin") return true;
    
    // Check if the permission exists in the userPermissions array
    return userPermissions.includes(permission);
  };

  // Check if the user has any of the specified permissions
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    // No permissions without a role
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
        loading,
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
