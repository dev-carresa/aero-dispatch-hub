
import { DbRole, DbPermission } from '@/lib/types/permissions';
import { Permission } from '@/lib/permissions';

export interface SimpleRole {
  id: string;
  name: string;
  isBuiltIn: boolean;
  permissions: Record<string, boolean>;
}

export interface SimpleUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: string;
}

// Group permissions by category for better organization
export const permissionCategories = {
  "Dashboard": ["dashboard:view"],
  "Bookings": ["bookings:view", "bookings:create", "bookings:edit", "bookings:delete", "bookings:assign_driver"],
  "Users": ["users:view", "users:create", "users:edit", "users:delete"],
  "API Users": ["api_users:view", "api_users:create", "api_users:edit", "api_users:delete"],
  "Vehicles": ["vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete"],
  "Airports/Meeting Points": ["airports:view", "airports:create", "airports:edit", "airports:delete"],
  "Reports": ["reports:view", "reports:create"],
  "Complaints": ["complaints:view", "complaints:create", "complaints:respond"],
  "Driver Comments": ["driver_comments:view", "driver_comments:create"],
  "Quality Reviews": ["quality_reviews:view"],
  "Invoices": ["invoices:view", "invoices:create", "invoices:edit"],
  "Settings": ["settings:view", "settings:edit", "settings:permissions", "settings:api"]
};

export const formatPermissionName = (permission: string): string => {
  return permission
    .split(':')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(': ');
};
