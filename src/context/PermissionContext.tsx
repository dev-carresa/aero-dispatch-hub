
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Permission } from "@/lib/permissions";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    const fetchUserRoleAndPermissions = async () => {
      if (!user) {
        setUserRole(null);
        setUserPermissions([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // First get the user's role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }

        // Set the role from profile data
        const role = profileData?.role as UserRole | null;
        setUserRole(role);

        // Then get the permissions for that role
        if (role) {
          // Use RPC to get permissions for the current user
          const { data: permissionsData, error: permissionsError } = await supabase
            .rpc('get_user_permissions', { user_id: user.id });

          if (permissionsError) {
            console.error('Error fetching user permissions:', permissionsError);
            throw permissionsError;
          }

          // Set permissions from the database
          const permissions = permissionsData?.map(p => p.name) || [];
          setUserPermissions(permissions as Permission[]);
        }
      } catch (error) {
        console.error('Error in permission context:', error);
        // Fallback to metadata role if database fetch fails
        if (user.user_metadata?.role) {
          setUserRole(user.user_metadata.role as UserRole);
        }
        toast.error("Failed to load permissions. Some features may be limited.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndPermissions();
  }, [user]);

  // Check if the user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (loading) return false;
    if (!userRole) return false;
    
    // Check if the permission exists in the userPermissions array
    return userPermissions.includes(permission);
  };

  // Check if the user has any of the specified permissions
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (loading) return false;
    if (!userRole) return false;
    
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
