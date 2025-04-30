
import { supabase } from '@/integrations/supabase/client';
import { Permission } from '@/lib/permissions';
import { DbPermission, DbRole, RoleWithPermissions } from '@/lib/types/permissions';
import { UserRole } from '@/types/user';

// Fetch roles using RPC function
export async function fetchRoles(): Promise<DbRole[]> {
  const { data, error } = await supabase.rpc('get_all_roles');
  if (error) throw error;
  return data || [];
}

// Fetch permissions using RPC function
export async function fetchPermissions(): Promise<DbPermission[]> {
  const { data, error } = await supabase.rpc('get_all_permissions');
  if (error) throw error;
  return data || [];
}

// Fetch role-permission mappings using RPC function
export async function fetchRolePermissions(): Promise<{role_id: string; permissions: Permission[]}[]> {
  const { data, error } = await supabase.rpc('get_role_permissions');
  if (error) throw error;
  return data || [];
}

// Add permission to a role
export async function addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
  const { error } = await supabase.rpc('add_permission_to_role', { 
    p_role_id: roleId, 
    p_permission_id: permissionId 
  });
  if (error) throw error;
}

// Remove permission from a role
export async function removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
  const { error } = await supabase.rpc('remove_permission_from_role', { 
    p_role_id: roleId, 
    p_permission_id: permissionId 
  });
  if (error) throw error;
}

// Create a new role
export async function createRole(name: string, description: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_role', { 
    p_name: name, 
    p_description: description 
  });
  if (error) throw error;
  return data;
}

// Delete a role
export async function deleteRole(roleId: string): Promise<void> {
  const { error } = await supabase.rpc('delete_role', { p_role_id: roleId });
  if (error) throw error;
}

// Update user's role
export async function updateUserRole(userId: string, roleName: UserRole): Promise<void> {
  const { error } = await supabase.rpc('update_user_role', { 
    p_user_id: userId, 
    p_role_name: roleName 
  });
  if (error) throw error;
}

// Check database initialization status
export async function checkDatabaseInitialized(): Promise<boolean> {
  try {
    // Try to call a function that will exist if the permissions system is set up
    const { data, error } = await supabase.rpc('get_all_roles', {}, { count: 'exact' });
    if (error) return false;
    return (data && data.length > 0);
  } catch (err) {
    console.error('Error checking DB initialization:', err);
    return false;
  }
}

// Transform raw data into RoleWithPermissions
export function transformRolesWithPermissions(
  roles: DbRole[], 
  rolePermissions: {role_id: string; permissions: Permission[]}[]
): RoleWithPermissions[] {
  return roles.map(role => {
    const permissionsForRole = rolePermissions.find(rp => rp.role_id === role.id)?.permissions || [];
    return {
      ...role,
      permissions: permissionsForRole
    };
  });
}
