
import { toast } from "sonner";
import { SimpleRole, permissionCategories } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { DbRole } from "@/lib/types/permissions";
import { Permission } from "@/lib/permissions";
import { fetchRoles, fetchRolePermissions } from '@/lib/db/permissionsService';

/**
 * Fetch roles and their permissions from the database
 */
export async function fetchRolesAndPermissions(): Promise<{ 
  roles: SimpleRole[], 
  dbMode: boolean, 
  dbError: string | null 
}> {
  try {
    // Try to fetch roles from the database
    let rolesData: DbRole[] = [];
    let rolePermissionsData: { role_id: string; permissions: Permission[] }[] = [];
    let dbMode = true;
    let dbError = null;
    
    try {
      rolesData = await fetchRoles();
      rolePermissionsData = await fetchRolePermissions();
    } catch (error) {
      console.warn('Database functions not available, using memory mode');
      dbMode = false;
      return { 
        roles: initializeMemoryRoles(), 
        dbMode, 
        dbError: 'Database functions not available. Using memory mode.' 
      };
    }

    if (!rolesData || !rolePermissionsData) {
      console.warn('Invalid data returned, using memory mode');
      dbMode = false;
      return { 
        roles: initializeMemoryRoles(), 
        dbMode, 
        dbError: 'Invalid data returned from database. Using memory mode.' 
      };
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
    
    return { roles: transformedRoles, dbMode, dbError: null };
  } catch (error) {
    console.error("Error initializing roles and permissions:", error);
    // Fall back to memory-based permissions
    return { 
      roles: initializeMemoryRoles(), 
      dbMode: false, 
      dbError: 'Error initializing roles and permissions. Using memory mode.' 
    };
  }
}

/**
 * Initialize memory mode with default roles
 */
export function initializeMemoryRoles(): SimpleRole[] {
  return [
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
}
