
export type Permission = string;

export const rolePermissions: Record<string, Permission[]> = {
  Admin: ['dashboard:view', 'bookings:view', 'bookings:create', 'bookings:edit', 'bookings:delete', 
          'settings:view', 'settings:edit', 'settings:permissions'],
  Customer: ['dashboard:view', 'bookings:view', 'bookings:create'],
  Driver: ['dashboard:view', 'bookings:view'],
  Fleet: ['dashboard:view', 'bookings:view', 'vehicles:view', 'vehicles:edit']
};
