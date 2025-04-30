
-- Function to create all permission RPC functions
CREATE OR REPLACE FUNCTION public.admin_create_permission_functions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Function to get all roles
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.get_all_roles()
  RETURNS TABLE (id UUID, name TEXT, description TEXT, is_system BOOLEAN, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT r.id, r.name, r.description, r.is_system, r.created_at, r.updated_at
    FROM roles r
    ORDER BY r.name;
  END;
  $func$;
  ';

  -- Function to get all permissions
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.get_all_permissions()
  RETURNS TABLE (id UUID, name TEXT, description TEXT, created_at TIMESTAMPTZ)
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.description, p.created_at
    FROM permissions p
    ORDER BY p.name;
  END;
  $func$;
  ';

  -- Function to get all role-permission mappings
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.get_all_role_permissions()
  RETURNS TABLE (role_id UUID, role_name TEXT, permission_id UUID, permission_name TEXT)
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT rp.role_id, r.name as role_name, rp.permission_id, p.name as permission_name
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    ORDER BY r.name, p.name;
  END;
  $func$;
  ';

  -- Function to create a new role
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.create_role(p_name TEXT, p_description TEXT)
  RETURNS UUID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  DECLARE
    v_role_id UUID;
  BEGIN
    INSERT INTO roles (name, description, is_system)
    VALUES (p_name, p_description, FALSE)
    RETURNING id INTO v_role_id;
    
    RETURN v_role_id;
  END;
  $func$;
  ';

  -- Function to delete a role
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.delete_role(p_role_id UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    -- Check if the role is a system role
    IF EXISTS (SELECT 1 FROM roles WHERE id = p_role_id AND is_system = TRUE) THEN
      RAISE EXCEPTION ''Cannot delete a system role'';
    END IF;
    
    -- Delete the role (cascade will remove role_permissions entries)
    DELETE FROM roles WHERE id = p_role_id;
  END;
  $func$;
  ';

  -- Function to add permission to a role by permission ID
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.add_permission_to_role(p_role_id UUID, p_permission_id UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (p_role_id, p_permission_id)
    ON CONFLICT (role_id, permission_id) DO NOTHING;
  END;
  $func$;
  ';

  -- Function to add permission to a role by permission name
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.add_permission_to_role_by_name(p_role_id UUID, p_permission_name TEXT)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  DECLARE
    v_permission_id UUID;
  BEGIN
    -- Get the permission ID from name
    SELECT id INTO v_permission_id FROM permissions WHERE name = p_permission_name;
    
    IF v_permission_id IS NULL THEN
      RAISE EXCEPTION ''Permission with name % not found'', p_permission_name;
    END IF;
    
    -- Add the permission to the role
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (p_role_id, v_permission_id)
    ON CONFLICT (role_id, permission_id) DO NOTHING;
  END;
  $func$;
  ';

  -- Function to remove permission from a role by permission ID
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.remove_permission_from_role(p_role_id UUID, p_permission_id UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    DELETE FROM role_permissions
    WHERE role_id = p_role_id AND permission_id = p_permission_id;
  END;
  $func$;
  ';

  -- Function to remove permission from a role by permission name
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.remove_permission_from_role_by_name(p_role_id UUID, p_permission_name TEXT)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  DECLARE
    v_permission_id UUID;
  BEGIN
    -- Get the permission ID from name
    SELECT id INTO v_permission_id FROM permissions WHERE name = p_permission_name;
    
    IF v_permission_id IS NULL THEN
      RAISE EXCEPTION ''Permission with name % not found'', p_permission_name;
    END IF;
    
    -- Remove the permission from the role
    DELETE FROM role_permissions
    WHERE role_id = p_role_id AND permission_id = v_permission_id;
  END;
  $func$;
  ';

  -- Function to update user's role by role ID
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.update_user_role(p_user_id UUID, p_role_id UUID)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  DECLARE
    v_role_name TEXT;
  BEGIN
    -- Get the role name
    SELECT name INTO v_role_name FROM roles WHERE id = p_role_id;
    
    IF v_role_name IS NULL THEN
      RAISE EXCEPTION ''Role with ID % not found'', p_role_id;
    END IF;
    
    -- Update the user''s role
    UPDATE profiles
    SET role = v_role_name, role_id = p_role_id
    WHERE id = p_user_id;
  END;
  $func$;
  ';

  -- Function to update user's role by role name
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.update_user_role_by_name(p_user_id UUID, p_role_name TEXT)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  DECLARE
    v_role_id UUID;
  BEGIN
    -- Get the role ID from name
    SELECT id INTO v_role_id FROM roles WHERE name = p_role_name;
    
    IF v_role_id IS NULL THEN
      RAISE EXCEPTION ''Role with name % not found'', p_role_name;
    END IF;
    
    -- Update the user''s role
    UPDATE profiles
    SET role = p_role_name, role_id = v_role_id
    WHERE id = p_user_id;
  END;
  $func$;
  ';

  -- Function to get user permissions
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
  RETURNS TABLE (permission_name TEXT)
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT DISTINCT p.name
    FROM profiles prof
    JOIN roles r ON prof.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE prof.id = user_id;
  END;
  $func$;
  ';

  -- Function to get user role name
  EXECUTE '
  CREATE OR REPLACE FUNCTION public.get_user_role_name(user_id UUID) 
  RETURNS TEXT
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $func$
  DECLARE
    role_name TEXT;
  BEGIN
    SELECT r.name
    FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = user_id
    INTO role_name;
    
    RETURN role_name;
  END;
  $func$;
  ';
END;
$$;

-- Function to seed initial roles and permissions
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
  permission_id UUID;
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
  ON CONFLICT (name) DO UPDATE SET description = 'Administrator with full access', is_system = TRUE
  RETURNING id INTO admin_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Driver', 'Driver with limited access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Driver with limited access', is_system = TRUE
  RETURNING id INTO driver_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Fleet', 'Fleet manager with vehicle management access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Fleet manager with vehicle management access', is_system = TRUE
  RETURNING id INTO fleet_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Dispatcher', 'Dispatcher with booking management access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Dispatcher with booking management access', is_system = TRUE
  RETURNING id INTO dispatcher_role_id;
  
  INSERT INTO roles (name, description, is_system) 
  VALUES ('Customer', 'Customer with limited access', TRUE) 
  ON CONFLICT (name) DO UPDATE SET description = 'Customer with limited access', is_system = TRUE
  RETURNING id INTO customer_role_id;

  -- Create permissions one by one
  FOREACH permission_name IN ARRAY permission_names
  LOOP
    -- Create the permission
    INSERT INTO permissions (name, description)
    VALUES (permission_name, 'Permission for ' || permission_name)
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO permission_id;
    
    -- If permission exists but we didn't get the ID, fetch it
    IF permission_id IS NULL THEN
      SELECT id INTO permission_id FROM permissions WHERE name = permission_name;
    END IF;
    
    -- Assign to Admin role
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (admin_role_id, permission_id)
    ON CONFLICT (role_id, permission_id) DO NOTHING;
    
    -- Assign specific permissions to Driver role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'driver_comments:create', 'complaints:view', 'complaints:create') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (driver_role_id, permission_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
    
    -- Assign specific permissions to Fleet role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'bookings:create', 'bookings:edit',
      'vehicles:view', 'vehicles:create', 'vehicles:edit', 'users:view', 
      'complaints:view', 'complaints:respond', 'driver_comments:view',
      'quality_reviews:view', 'reports:view', 'invoices:view') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (fleet_role_id, permission_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
    
    -- Assign specific permissions to Dispatcher role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'bookings:create', 'bookings:edit', 
      'bookings:assign_driver', 'users:view', 'vehicles:view', 'complaints:view', 'complaints:respond') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (dispatcher_role_id, permission_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
    
    -- Assign specific permissions to Customer role
    IF permission_name IN ('dashboard:view', 'bookings:view', 'bookings:create', 'complaints:view', 'complaints:create') THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (customer_role_id, permission_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
  END LOOP;

  -- Update existing user profiles to use role_id
  UPDATE profiles SET role_id = 
    (SELECT id FROM roles WHERE LOWER(name) = LOWER(profiles.role))
  WHERE role_id IS NULL AND role IS NOT NULL;
END;
$$;

-- Call this function once to create all the required RPC functions
SELECT admin_create_permission_functions();
