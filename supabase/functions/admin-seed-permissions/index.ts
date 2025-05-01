
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This endpoint handles CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the admin secret
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Define all permissions
    const permissions = [
      // Dashboard permissions
      { name: 'dashboard:view', description: 'View dashboard and stats' },
      
      // Bookings permissions
      { name: 'bookings:view', description: 'View bookings' },
      { name: 'bookings:create', description: 'Create new bookings' },
      { name: 'bookings:edit', description: 'Edit existing bookings' },
      { name: 'bookings:delete', description: 'Delete bookings' },
      { name: 'bookings:assign_driver', description: 'Assign drivers to bookings' },
      
      // Users permissions
      { name: 'users:view', description: 'View user list' },
      { name: 'users:create', description: 'Create new users' },
      { name: 'users:edit', description: 'Edit existing users' },
      { name: 'users:delete', description: 'Delete users' },
      
      // API Users permissions
      { name: 'api_users:view', description: 'View API users' },
      { name: 'api_users:create', description: 'Create new API users' },
      { name: 'api_users:edit', description: 'Edit API users' },
      { name: 'api_users:delete', description: 'Delete API users' },
      
      // Vehicles permissions
      { name: 'vehicles:view', description: 'View vehicles' },
      { name: 'vehicles:create', description: 'Create new vehicles' },
      { name: 'vehicles:edit', description: 'Edit existing vehicles' },
      { name: 'vehicles:delete', description: 'Delete vehicles' },
      
      // Airports/Meeting Points permissions
      { name: 'airports:view', description: 'View airports and meeting points' },
      { name: 'airports:create', description: 'Create new airports' },
      { name: 'airports:edit', description: 'Edit existing airports' },
      { name: 'airports:delete', description: 'Delete airports' },
      
      // Reports permissions
      { name: 'reports:view', description: 'View reports' },
      { name: 'reports:create', description: 'Create new reports' },
      
      // Complaints permissions
      { name: 'complaints:view', description: 'View complaints' },
      { name: 'complaints:create', description: 'Create new complaints' },
      { name: 'complaints:respond', description: 'Respond to complaints' },
      
      // Driver Comments permissions
      { name: 'driver_comments:view', description: 'View driver comments' },
      { name: 'driver_comments:create', description: 'Create driver comments' },
      
      // Quality Reviews permissions
      { name: 'quality_reviews:view', description: 'View quality reviews' },
      
      // Invoices permissions
      { name: 'invoices:view', description: 'View invoices' },
      { name: 'invoices:create', description: 'Create new invoices' },
      { name: 'invoices:edit', description: 'Edit existing invoices' },
      
      // Settings permissions
      { name: 'settings:view', description: 'View settings' },
      { name: 'settings:edit', description: 'Edit general settings' },
      { name: 'settings:permissions', description: 'Manage permissions and roles' },
      { name: 'settings:api', description: 'Configure API settings' }
    ];

    // Create default roles
    const roles = [
      {
        name: 'Admin',
        description: 'Administrator with full access',
        is_system: true,
        permissions: permissions.map(p => p.name)
      },
      {
        name: 'Customer',
        description: 'Customer with limited access',
        is_system: true,
        permissions: ['dashboard:view', 'bookings:view', 'bookings:create']
      },
      {
        name: 'Driver',
        description: 'Driver with limited access',
        is_system: true,
        permissions: ['dashboard:view', 'bookings:view']
      },
      {
        name: 'Fleet',
        description: 'Fleet manager with vehicle management access',
        is_system: true,
        permissions: ['dashboard:view', 'bookings:view', 'vehicles:view', 'vehicles:edit']
      },
      {
        name: 'Dispatcher',
        description: 'Dispatcher with booking management access',
        is_system: true,
        permissions: [
          'dashboard:view', 
          'bookings:view', 
          'bookings:create', 
          'bookings:edit', 
          'bookings:assign_driver'
        ]
      }
    ];

    // First, insert all permissions
    for (const permission of permissions) {
      // Check if permission already exists
      const { data: existingPerm } = await supabase
        .from('permissions')
        .select()
        .eq('name', permission.name)
        .maybeSingle();
        
      if (!existingPerm) {
        await supabase
          .from('permissions')
          .insert([permission]);
      }
    }
    
    // Get all permissions for role-permission mapping
    const { data: allPermissions } = await supabase
      .from('permissions')
      .select('id, name');
      
    const permissionMap = new Map();
    allPermissions?.forEach(perm => {
      permissionMap.set(perm.name, perm.id);
    });
    
    // Insert roles and their permissions
    for (const role of roles) {
      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('roles')
        .select()
        .eq('name', role.name)
        .maybeSingle();
        
      let roleId;
      
      if (!existingRole) {
        // Create the role
        const { data: newRole } = await supabase
          .from('roles')
          .insert([{
            name: role.name,
            description: role.description,
            is_system: role.is_system
          }])
          .select();
          
        if (newRole && newRole.length > 0) {
          roleId = newRole[0].id;
        }
      } else {
        roleId = existingRole.id;
      }
      
      if (roleId) {
        // Add permissions to the role
        for (const permName of role.permissions) {
          const permId = permissionMap.get(permName);
          if (permId) {
            // Check if mapping already exists
            const { data: existingMapping } = await supabase
              .from('role_permissions')
              .select()
              .eq('role_id', roleId)
              .eq('permission_id', permId)
              .maybeSingle();
              
            if (!existingMapping) {
              await supabase
                .from('role_permissions')
                .insert([{
                  role_id: roleId,
                  permission_id: permId
                }]);
            }
          }
        }
      }
    }
    
    // Update profiles table - set role_id based on role
    const { data: roles_data } = await supabase
      .from('roles')
      .select('id, name');
      
    if (roles_data && roles_data.length > 0) {
      const roleIdByName = new Map();
      roles_data.forEach(r => {
        roleIdByName.set(r.name, r.id);
      });
      
      // Update all profiles to set role_id from role
      for (const [roleName, roleId] of roleIdByName.entries()) {
        await supabase
          .from('profiles')
          .update({ role_id: roleId })
          .eq('role', roleName);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Permissions and roles seeded successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
  }
});
