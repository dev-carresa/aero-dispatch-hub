
// Define permission types for various actions in the application
export type Permission =
  | "dashboard:view"
  | "bookings:view"
  | "bookings:create"
  | "bookings:edit"
  | "bookings:delete"
  | "bookings:assign_driver"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "api_users:view"
  | "api_users:create"
  | "api_users:edit"
  | "api_users:delete"
  | "vehicles:view"
  | "vehicles:create"
  | "vehicles:edit"
  | "vehicles:delete"
  | "airports:view"
  | "airports:create"
  | "airports:edit"
  | "airports:delete"
  | "reports:view"
  | "reports:create"
  | "complaints:view"
  | "complaints:create"
  | "complaints:respond"
  | "driver_comments:view"
  | "driver_comments:create"
  | "quality_reviews:view"
  | "invoices:view"
  | "invoices:create"
  | "invoices:edit"
  | "settings:view"
  | "settings:edit"
  | "settings:permissions"
  | "settings:api";

// Pre-defined role permissions
export const rolePermissions: Record<string, Permission[]> = {
  Admin: [
    "dashboard:view",
    "bookings:view",
    "bookings:create",
    "bookings:edit",
    "bookings:delete",
    "bookings:assign_driver",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "api_users:view",
    "api_users:create",
    "api_users:edit",
    "api_users:delete",
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit",
    "vehicles:delete",
    "airports:view",
    "airports:create",
    "airports:edit",
    "airports:delete",
    "reports:view",
    "reports:create",
    "complaints:view",
    "complaints:create",
    "complaints:respond",
    "driver_comments:view",
    "driver_comments:create",
    "quality_reviews:view",
    "invoices:view",
    "invoices:create",
    "invoices:edit",
    "settings:view",
    "settings:edit",
    "settings:permissions",
    "settings:api"
  ],
  Manager: [
    "dashboard:view",
    "bookings:view",
    "bookings:create",
    "bookings:edit",
    "bookings:assign_driver",
    "users:view",
    "users:create",
    "users:edit",
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit",
    "airports:view",
    "airports:create",
    "airports:edit",
    "reports:view",
    "reports:create",
    "complaints:view",
    "complaints:respond",
    "driver_comments:view",
    "quality_reviews:view",
    "invoices:view",
    "invoices:create",
    "settings:view"
  ],
  Driver: [
    "dashboard:view",
    "bookings:view",
    "driver_comments:create"
  ],
  Fleet: [
    "dashboard:view",
    "bookings:view",
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit"
  ],
  Support: [
    "dashboard:view",
    "bookings:view",
    "users:view",
    "complaints:view",
    "complaints:respond",
    "quality_reviews:view"
  ],
  Accounting: [
    "dashboard:view",
    "bookings:view",
    "invoices:view",
    "invoices:create",
    "invoices:edit",
    "reports:view",
    "reports:create"
  ]
};
