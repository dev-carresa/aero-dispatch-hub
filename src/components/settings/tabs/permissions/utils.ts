
import { Permission } from "@/lib/permissions";
import { RoleData } from "./types";
import { permissionCategories } from "./types";

// Count how many permissions are enabled in a category for a role
export const countEnabledPermissionsInCategory = (role: RoleData, category: string): number => {
  const permissions = permissionCategories[category].permissions;
  return permissions.filter(perm => role.permissions[perm as Permission]).length;
};

// Calculate if all permissions in a category are enabled for a role
export const areAllPermissionsEnabledInCategory = (role: RoleData, category: string): boolean => {
  const permissions = permissionCategories[category].permissions;
  return permissions.every(perm => role.permissions[perm as Permission]);
};

// Format permission name for display
export const formatPermissionName = (permission: string): string => {
  return permission
    .split(':')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(': ');
};
