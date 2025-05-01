
import { supabase } from "@/integrations/supabase/client";

// Seed the permissions and roles in the database
export const seedPermissionsAndRoles = async () => {
  try {
    // Call the seed-permissions edge function
    const response = await supabase.functions.invoke('admin-seed-permissions');
    
    if (!response.data?.success) {
      throw new Error('Failed to seed permissions and roles');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error seeding permissions and roles:', error);
    return { success: false, error };
  }
};

// Get all permissions
export const getAllPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return { success: false, error };
  }
};

// Get all roles with their permissions
export const getAllRoles = async () => {
  try {
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('name');
      
    if (rolesError) throw rolesError;
    
    const { data: rolePermissions, error: permError } = await supabase
      .from('role_permissions')
      .select('role_id, permissions(id, name)');
      
    if (permError) throw permError;
    
    // Map permissions to roles
    const rolesWithPermissions = roles?.map(role => {
      const permissions = rolePermissions
        ?.filter(rp => rp.role_id === role.id)
        .map(rp => rp.permissions?.name)
        .filter(Boolean);
        
      return {
        ...role,
        permissions
      };
    });
    
    return { success: true, data: rolesWithPermissions };
  } catch (error) {
    console.error('Error fetching roles with permissions:', error);
    return { success: false, error };
  }
};

// Create a new role
export const createRole = async (name: string, description?: string) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert([{ name, description }])
      .select();
      
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error creating role:', error);
    return { success: false, error };
  }
};

// Update a role
export const updateRole = async (id: string, updates: { name?: string; description?: string }) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update(updates)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating role:', error);
    return { success: false, error };
  }
};

// Delete a role
export const deleteRole = async (id: string) => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    return { success: false, error };
  }
};

// Add permission to role
export const addPermissionToRole = async (roleId: string, permissionId: string) => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .insert([{ role_id: roleId, permission_id: permissionId }]);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error adding permission to role:', error);
    return { success: false, error };
  }
};

// Remove permission from role
export const removePermissionFromRole = async (roleId: string, permissionId: string) => {
  try {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing permission from role:', error);
    return { success: false, error };
  }
};

// Update user role
export const updateUserRole = async (userId: string, roleId: string) => {
  try {
    // First get role name
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('name')
      .eq('id', roleId)
      .single();
      
    if (roleError) throw roleError;
    
    // Update user profile with role_id and role name
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role_id: roleId,
        role: roleData.name 
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error };
  }
};
