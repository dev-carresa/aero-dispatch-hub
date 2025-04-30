
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Permission, rolePermissions } from "@/lib/permissions";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkDatabaseInitialized } from "@/lib/db/permissionsRpc";

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
  const [dbInitialized, setDbInitialized] = useState(false);
  
  // Helper functions to check specific roles
  const isAdmin = userRole === "Admin";
  const isDriver = userRole === "Driver";
  const isFleet = userRole === "Fleet";
  const isDispatcher = userRole === "Dispatcher";
  const isCustomer = userRole === "Customer";

  // Check if database is initialized
  useEffect(() => {
    const checkDb = async () => {
      const initialized = await checkDatabaseInitialized();
      setDbInitialized(initialized);
    };
    checkDb();
  }, []);

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
        
        if (dbInitialized) {
          // Use Edge function to get user's role name
          const { data: roleData, error: roleError } = await supabase.functions
            .invoke('get_user_role_name', {
              body: { user_id: user.id }
            });
          
          if (roleError) {
            console.error('Error fetching user role:', roleError);
            throw roleError;
          }
          
          // Set the role from Edge function call
          setUserRole(roleData as UserRole);
          
          // Use Edge function to get permissions for the current user
          const { data: permissionsData, error: permissionsError } = await supabase.functions
            .invoke('get_user_permissions', {
              body: { user_id: user.id }
            });
          
          if (permissionsError) {
            console.error('Error fetching user permissions:', permissionsError);
            throw permissionsError;
          }
          
          // Set permissions from the Edge function call
          setUserPermissions((permissionsData || []) as Permission[]);
        } else {
          // If DB is not initialized, fall back to meta data
          // First get the user's role from profiles
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
          
          // Default permissions based on role for basic functionality
          if (role === "Admin") {
            setUserPermissions(rolePermissions.Admin);
          } else if (role) {
            // Add role-specific permissions from our local permissions definition
            setUserPermissions(rolePermissions[role] || []);
          } else {
            setUserPermissions([]);
          }
        }
      } catch (error) {
        console.error('Error in permission context:', error);
        // Fallback to metadata role if database fetch fails
        if (user.user_metadata?.role) {
          const role = user.user_metadata.role as UserRole;
          setUserRole(role);
          setUserPermissions(rolePermissions[role] || []);
        }
        toast.error("Failed to load permissions. Some features may be limited.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndPermissions();
  }, [user, dbInitialized]);

  // Check if the user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (loading) return false;
    if (!userRole) return false;
    
    // Admin always has all permissions
    if (userRole === "Admin") return true;
    
    // Check if the permission exists in the userPermissions array
    return userPermissions.includes(permission);
  };

  // Check if the user has any of the specified permissions
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (loading) return false;
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
