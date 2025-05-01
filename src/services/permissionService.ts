
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
