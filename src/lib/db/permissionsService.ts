
import { supabase } from '@/integrations/supabase/client';
import { Permission } from '@/lib/permissions';
import { DbPermission, DbRole, RoleWithPermissions } from '@/lib/types/permissions';
import { UserRole } from '@/types/user';

// Fetch roles using Edge function
export async function fetchRoles(): Promise<DbRole[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get_all_roles');
    if (error) throw error;
    return data as DbRole[] || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

// Fetch permissions using Edge function
export async function fetchPermissions(): Promise<DbPermission[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get_all_permissions');
    if (error) throw error;
    return data as DbPermission[] || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

// Fetch role-permission mappings using Edge function
export async function fetchRolePermissions(): Promise<{role_id: string; permissions: Permission[]}[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get_role_permissions');
    if (error) throw error;
    return data as {role_id: string; permissions: Permission[]}[] || [];
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
}

// Add permission to a role
export async function addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('add_permission_to_role', { 
      body: { p_role_id: roleId, p_permission_id: permissionId }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error adding permission to role:', error);
    throw error;
  }
}

// Remove permission from a role
export async function removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('remove_permission_from_role', {
      body: { p_role_id: roleId, p_permission_id: permissionId }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error removing permission from role:', error);
    throw error;
  }
}

// Create a new role
export async function createRole(name: string, description: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('create_role', {
      body: { p_name: name, p_description: description }
    });
    if (error) throw error;
    return data as string;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

// Delete a role
export async function deleteRole(roleId: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('delete_role', {
      body: { p_role_id: roleId }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}

// Update user's role
export async function updateUserRole(userId: string, roleName: UserRole): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('update_user_role', {
      body: { p_user_id: userId, p_role_name: roleName }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Check database initialization status
export async function checkDatabaseInitialized(): Promise<boolean> {
  try {
    // Try to call a function that will exist if the permissions system is set up
    const { data, error } = await supabase.functions.invoke('get_all_roles');
    if (error) return false;
    return Array.isArray(data) && (data as any[]).length > 0;
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
