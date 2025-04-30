
import { UserRole } from "@/types/user";

// Define all available permissions in the system
export type Permission = 
  // Dashboard permissions
  | "dashboard:view"
  
  // Booking permissions
  | "bookings:view"
  | "bookings:create"
  | "bookings:edit"
  | "bookings:delete"
  | "bookings:assign_driver"
  
  // User permissions
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  
  // API Users permissions
  | "api_users:view"
  | "api_users:create"
  | "api_users:edit"
  | "api_users:delete"
  
  // Vehicle permissions
  | "vehicles:view"
  | "vehicles:create"
  | "vehicles:edit"
  | "vehicles:delete"
  
  // Meeting points/airports permissions
  | "airports:view"
  | "airports:create"
  | "airports:edit"
  | "airports:delete"
  
  // Report permissions
  | "reports:view"
  | "reports:create"
  
  // Complaint permissions
  | "complaints:view"
  | "complaints:create"
  | "complaints:respond"
  
  // Driver comment permissions
  | "driver_comments:view"
  | "driver_comments:create"
  
  // Quality review permissions
  | "quality_reviews:view"
  
  // Invoice permissions
  | "invoices:view"
  | "invoices:create"
  | "invoices:edit"
  
  // Settings permissions
  | "settings:view"
  | "settings:edit"
  | "settings:permissions"
  | "settings:api";

// Define the default permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  Admin: [
    // Admin has all permissions
    "dashboard:view",
    "bookings:view", "bookings:create", "bookings:edit", "bookings:delete", "bookings:assign_driver",
    "users:view", "users:create", "users:edit", "users:delete",
    "api_users:view", "api_users:create", "api_users:edit", "api_users:delete",
    "vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete",
    "airports:view", "airports:create", "airports:edit", "airports:delete",
    "reports:view", "reports:create",
    "complaints:view", "complaints:create", "complaints:respond",
    "driver_comments:view", "driver_comments:create",
    "quality_reviews:view",
    "invoices:view", "invoices:create", "invoices:edit",
    "settings:view", "settings:edit", "settings:permissions", "settings:api"
  ],
  Driver: [
    // Driver has limited permissions
    "dashboard:view",
    "bookings:view",
    "driver_comments:create",
    "complaints:view", "complaints:create"
  ],
  Fleet: [
    // Fleet manager permissions
    "dashboard:view",
    "bookings:view", "bookings:create", "bookings:edit",
    "vehicles:view", "vehicles:create", "vehicles:edit",
    "users:view", 
    "complaints:view", "complaints:respond",
    "driver_comments:view",
    "quality_reviews:view",
    "reports:view",
    "invoices:view"
  ],
  Dispatcher: [
    // Dispatcher permissions
    "dashboard:view",
    "bookings:view", "bookings:create", "bookings:edit", "bookings:assign_driver",
    "users:view",
    "vehicles:view",
    "complaints:view", "complaints:respond"
  ],
  Customer: [
    // Customer permissions
    "dashboard:view",
    "bookings:view", "bookings:create",
    "complaints:view", "complaints:create"
  ]
};

// Helper function to check if a user role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

// Helper function to check if a user role has any of the specified permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}
