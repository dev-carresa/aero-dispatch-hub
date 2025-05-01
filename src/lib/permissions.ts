
export type Permission = string;

export const rolePermissions: Record<string, Permission[]> = {
  Admin: [
    // Dashboard permissions
    'dashboard:view',
    
    // Bookings permissions
    'bookings:view', 
    'bookings:create', 
    'bookings:edit', 
    'bookings:delete',
    'bookings:assign_driver',
    
    // Users permissions
    'users:view', 
    'users:create', 
    'users:edit', 
    'users:delete',
    
    // API Users permissions
    'api_users:view', 
    'api_users:create', 
    'api_users:edit', 
    'api_users:delete',
    
    // Vehicles permissions
    'vehicles:view', 
    'vehicles:create', 
    'vehicles:edit', 
    'vehicles:delete',
    
    // Airports/Meeting Points permissions
    'airports:view', 
    'airports:create', 
    'airports:edit', 
    'airports:delete',
    
    // Reports permissions
    'reports:view', 
    'reports:create',
    
    // Complaints permissions
    'complaints:view', 
    'complaints:create', 
    'complaints:respond',
    
    // Driver Comments permissions
    'driver_comments:view', 
    'driver_comments:create',
    
    // Quality Reviews permissions
    'quality_reviews:view',
    
    // Invoices permissions
    'invoices:view', 
    'invoices:create', 
    'invoices:edit',
    
    // Settings permissions
    'settings:view', 
    'settings:edit', 
    'settings:permissions', 
    'settings:api'
  ],
  Customer: ['dashboard:view', 'bookings:view', 'bookings:create'],
  Driver: ['dashboard:view', 'bookings:view'],
  Fleet: ['dashboard:view', 'bookings:view', 'vehicles:view', 'vehicles:edit']
};
