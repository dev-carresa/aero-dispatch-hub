
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SimpleRole, SimpleUser, permissionCategories } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { DbRole } from "@/lib/types/permissions";
import { Permission } from "@/lib/permissions";
import { fetchRoles, fetchRolePermissions } from '@/lib/db/permissionsService';
import { UserRole } from "@/types/user";

export function usePermissionSettings() {
  const [roles, setRoles] = useState<SimpleRole[]>([]);
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbMode, setDbMode] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Load roles and permissions using edge functions
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch roles from the database
        let rolesData: DbRole[] = [];
        let rolePermissionsData: { role_id: string; permissions: Permission[] }[] = [];
        
        try {
          rolesData = await fetchRoles();
          rolePermissionsData = await fetchRolePermissions();
          setDbMode(true);
        } catch (error) {
          console.warn('Database functions not available, using memory mode');
          setDbMode(false);
          initializeMemoryMode();
          return;
        }

        if (!rolesData || !rolePermissionsData) {
          console.warn('Invalid data returned, using memory mode');
          setDbMode(false);
          initializeMemoryMode();
          return;
        }
          
        // Transform the data for the UI
        const transformedRoles: SimpleRole[] = rolesData.map((role: DbRole) => {
          // Create an object with all permissions set to false by default
          const allPermissions: Record<string, boolean> = {};
          
          // Initialize all possible permissions as false
          Object.values(permissionCategories).flat().forEach(perm => {
            allPermissions[perm] = false;
          });
          
          // Find permissions for this role
          const rolePerms = rolePermissionsData.find(rp => rp.role_id === role.id);
          
          // Set the permissions this role has to true
          if (rolePerms && Array.isArray(rolePerms.permissions)) {
            rolePerms.permissions.forEach((permName: Permission) => {
              allPermissions[permName] = true;
            });
          }
          
          return {
            id: role.id,
            name: role.name,
            permissions: allPermissions,
            isBuiltIn: role.is_system
          };
        });
        
        setRoles(transformedRoles);
        fetchUsers();
      } catch (error) {
        console.error("Error initializing roles and permissions:", error);
        // Fall back to memory-based permissions
        setDbMode(false);
        initializeMemoryMode();
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  // Initialize memory mode with mock data
  const initializeMemoryMode = () => {
    const defaultRoles: SimpleRole[] = [
      {
        id: 'admin',
        name: 'Admin',
        isBuiltIn: true,
        permissions: Object.values(permissionCategories).flat().reduce((acc, perm) => {
          acc[perm] = true;
          return acc;
        }, {} as Record<string, boolean>)
      },
      {
        id: 'driver',
        name: 'Driver',
        isBuiltIn: true,
        permissions: Object.values(permissionCategories).flat().reduce((acc, perm) => {
          acc[perm] = ["dashboard:view", "bookings:view", "driver_comments:create", "complaints:view", "complaints:create"].includes(perm as Permission);
          return acc;
        }, {} as Record<string, boolean>)
      },
      {
        id: 'fleet',
        name: 'Fleet',
        isBuiltIn: true,
        permissions: Object.values(permissionCategories).flat().reduce((acc, perm) => {
          acc[perm] = ["dashboard:view", "bookings:view", "bookings:create", "bookings:edit", 
                     "vehicles:view", "vehicles:create", "vehicles:edit", "users:view", 
                     "complaints:view", "complaints:respond", "driver_comments:view",
                     "quality_reviews:view", "reports:view", "invoices:view"].includes(perm as Permission);
          return acc;
        }, {} as Record<string, boolean>)
      },
      {
        id: 'dispatcher',
        name: 'Dispatcher',
        isBuiltIn: true,
        permissions: Object.values(permissionCategories).flat().reduce((acc, perm) => {
          acc[perm] = ["dashboard:view", "bookings:view", "bookings:create", "bookings:edit", 
                     "bookings:assign_driver", "users:view", "vehicles:view", 
                     "complaints:view", "complaints:respond"].includes(perm as Permission);
          return acc;
        }, {} as Record<string, boolean>)
      },
      {
        id: 'customer',
        name: 'Customer',
        isBuiltIn: true,
        permissions: Object.values(permissionCategories).flat().reduce((acc, perm) => {
          acc[perm] = ["dashboard:view", "bookings:view", "bookings:create", 
                     "complaints:view", "complaints:create"].includes(perm as Permission);
          return acc;
        }, {} as Record<string, boolean>)
      }
    ];
    
    setRoles(defaultRoles);
    
    const mockUsers: SimpleUser[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@transport-co.com",
        initials: "AD",
        color: "blue",
        role: "admin"
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane@transport-co.com",
        initials: "JD",
        color: "green",
        role: "driver"
      },
      {
        id: "3",
        name: "Mike Smith",
        email: "mike@transport-co.com",
        initials: "MS",
        color: "purple",
        role: "fleet"
      }
    ];
    
    setUsers(mockUsers);
  };

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, role');
        
      if (profilesError) {
        throw profilesError;
      }
      
      const usersData = profilesData.map((profile: any) => {
        const initials = profile.name
          ? profile.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : 'XX';
          
        // Generate a consistent color based on the user id
        const colors = ['blue', 'green', 'purple', 'red', 'amber', 'pink', 'indigo', 'cyan'];
        const colorIndex = profile.id 
          ? Math.abs(profile.id.charCodeAt(0) % colors.length)
          : 0;
        
        return {
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: profile.email || 'No email',
          initials,
          color: colors[colorIndex],
          role: profile.role ? profile.role.toLowerCase() : 'customer'
        };
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      
      // Fallback to mock users if database access fails
      const mockUsers: SimpleUser[] = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@transport-co.com",
          initials: "AD",
          color: "blue",
          role: "admin"
        },
        {
          id: "2",
          name: "Jane Doe",
          email: "jane@transport-co.com",
          initials: "JD",
          color: "green",
          role: "driver"
        },
        {
          id: "3",
          name: "Mike Smith",
          email: "mike@transport-co.com",
          initials: "MS",
          color: "purple",
          role: "fleet"
        }
      ];
      
      setUsers(mockUsers);
    }
  };

  return {
    roles,
    setRoles,
    users,
    setUsers,
    isLoading,
    dbMode,
    dbError,
  };
}
