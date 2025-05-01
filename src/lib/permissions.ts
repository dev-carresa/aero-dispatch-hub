
// Define all available permissions as a type
export type Permission = 
  | "dashboard:view"
  | "bookings:view" | "bookings:create" | "bookings:edit" | "bookings:delete" | "bookings:assign_driver"
  | "users:view" | "users:create" | "users:edit" | "users:delete"
  | "api_users:view" | "api_users:create" | "api_users:edit" | "api_users:delete"
  | "vehicles:view" | "vehicles:create" | "vehicles:edit" | "vehicles:delete"
  | "airports:view" | "airports:create" | "airports:edit" | "airports:delete"
  | "reports:view" | "reports:create"
  | "complaints:view" | "complaints:create" | "complaints:respond"
  | "driver_comments:view" | "driver_comments:create"
  | "quality_reviews:view"
  | "invoices:view" | "invoices:create" | "invoices:edit"
  | "settings:view" | "settings:edit" | "settings:permissions" | "settings:api";

// Define the permissions for each role
export const rolePermissions: Record<string, Permission[]> = {
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
  Fleet: [
    // Fleet managers have limited permissions
    "dashboard:view",
    "bookings:view", "bookings:create", "bookings:edit", "bookings:assign_driver",
    "users:view",
    "vehicles:view", "vehicles:create", "vehicles:edit",
    "airports:view",
    "reports:view",
    "complaints:view", "complaints:respond",
    "driver_comments:view",
    "quality_reviews:view",
    "invoices:view", "invoices:create",
    "settings:view"
  ],
  Driver: [
    // Drivers have very limited permissions
    "dashboard:view",
    "bookings:view",
    "driver_comments:view", "driver_comments:create"
  ],
  Dispatcher: [
    // Dispatchers have moderate permissions focused on bookings
    "dashboard:view",
    "bookings:view", "bookings:create", "bookings:edit", "bookings:assign_driver",
    "users:view",
    "vehicles:view",
    "airports:view",
    "complaints:view",
    "driver_comments:view",
    "invoices:view",
    "settings:view"
  ],
  Customer: [
    // Customers have minimal view permissions
    "bookings:view", "bookings:create",
    "invoices:view"
  ]
};

// Helper function to check if a role has a specific permission
export const hasRolePermission = (role: string, permission: Permission): boolean => {
  const permissions = rolePermissions[role];
  if (!permissions) return false;
  return permissions.includes(permission);
};

// Helper function to check if a role has any of the specified permissions
export const hasRoleAnyPermission = (role: string, permissions: Permission[]): boolean => {
  const rolePerms = rolePermissions[role];
  if (!rolePerms) return false;
  return permissions.some(permission => rolePerms.includes(permission));
};
