
-- Function to create the get_user_permissions RPC function
CREATE OR REPLACE FUNCTION public.admin_create_get_user_permissions_function()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create function to get all permissions for a user
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
  RETURNS TABLE (id UUID, name TEXT, description TEXT)
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT DISTINCT p.id, p.name, p.description
    FROM profiles prof
    JOIN roles r ON prof.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE prof.id = user_id;
  END;
  $func$;
  ';
END;
$$;

-- Function to seed roles and permissions in database
CREATE OR REPLACE FUNCTION public.admin_seed_roles_and_permissions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_role_id UUID;
  driver_role_id UUID;
  fleet_role_id UUID;
  dispatcher_role_id UUID;
  customer_role_id UUID;
  perm_id UUID;
  permission_name TEXT;
  permission_names TEXT[] := ARRAY[
    'dashboard:view',
    'bookings:view', 'bookings:create', 'bookings:edit', 'bookings:delete', 'bookings:assign_driver',
    'users:view', 'users:create', 'users:edit', 'users:delete',
    'api_users:view', 'api_users:create', 'api_users:edit', 'api_users:delete',
    'vehicles:view', 'vehicles:create', 'vehicles:edit', 'vehicles:delete',
    'airports:view', 'airports:create', 'airports:edit', 'airports:delete',
    'reports:view', 'reports:create',
    'complaints:view', 'complaints:create', 'complaints:respond',
    'driver_comments:view', 'driver_comments:create',
    'quality_reviews:view',
    'invoices:view', 'invoices:create', 'invoices:edit',
    'settings:view', 'settings:edit', 'settings:permissions', 'settings:api'
  ];
BEGIN
  -- Create roles if they don't exist
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Admin', 'Administrator with full access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Administrator with full access'
  RETURNING id INTO admin_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Driver', 'Driver with limited access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Driver with limited access'
  RETURNING id INTO driver_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Fleet', 'Fleet manager with vehicle management access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Fleet manager with vehicle management access'
  RETURNING id INTO fleet_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Dispatcher', 'Dispatcher with booking management access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Dispatcher with booking management access'
  RETURNING id INTO dispatcher_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Customer', 'Customer with limited access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Customer with limited access'
  RETURNING id INTO customer_role_id;

  -- Create permissions one by one
  FOREACH permission_name IN ARRAY permission_names
  LOOP
    -- Create the permission
    INSERT INTO permissions (name, description)
    VALUES (permission_name, 'Permission for ' || permission_name)
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO perm_id;
    
    -- If permission exists but we didn't get the ID, fetch it
    IF perm_id IS NULL THEN
      SELECT id INTO perm_id FROM permissions WHERE name = permission_name;
    END IF;
    
    -- Assign to Admin role
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (admin_role_id, perm_id)
    ON CONFLICT (role_id, permission_id) DO NOTHING;
    
    -- Assign specific permissions to Driver role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'driver_comments:create', 'complaints:view', 'complaints:create') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (driver_role_id, perm_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
    
    -- Assign specific permissions to Fleet role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'bookings:create', 'bookings:edit',
      'vehicles:view', 'vehicles:create', 'vehicles:edit', 'users:view', 
      'complaints:view', 'complaints:respond', 'driver_comments:view',
      'quality_reviews:view', 'reports:view', 'invoices:view') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (fleet_role_id, perm_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
    
    -- Assign specific permissions to Dispatcher role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'bookings:create', 'bookings:edit', 
      'bookings:assign_driver', 'users:view', 'vehicles:view', 'complaints:view', 'complaints:respond') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (dispatcher_role_id, perm_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
    
    -- Assign specific permissions to Customer role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'bookings:create', 'complaints:view', 'complaints:create') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (customer_role_id, perm_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
  END LOOP;

  -- Update existing user profiles to use role_id
  UPDATE profiles SET role_id = 
    (SELECT id FROM roles WHERE LOWER(name) = LOWER(profiles.role))
  WHERE role_id IS NULL AND role IS NOT NULL;
END;
$$;
