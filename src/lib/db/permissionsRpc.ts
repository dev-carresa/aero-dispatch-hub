
import { supabase } from '@/integrations/supabase/client';

// This function creates the necessary RPC function in the database
export const createPermissionsRpcFunction = async () => {
  try {
    const { error } = await supabase.functions.invoke('admin_create_permission_functions');
    
    if (error) {
      console.error('Error creating RPC functions:', error);
      throw error;
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error invoking function:', err);
    throw err;
  }
};

// This function seeds the initial roles and permissions
export const seedRolesAndPermissions = async () => {
  try {
    const { error } = await supabase.functions.invoke('admin_seed_roles_and_permissions');
    
    if (error) {
      console.error('Error seeding roles and permissions:', error);
      throw error;
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error invoking function:', err);
    throw err;
  }
};

// Function to check if database has been properly initialized
export const checkDatabaseInitialized = async (): Promise<boolean> => {
  try {
    // First try to query the roles table directly
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .limit(1);
    
    // If we can query the roles table and get data, the DB is initialized
    if (!roleError && roleData && roleData.length > 0) {
      return true;
    }
    
    // If table doesn't exist, try calling the get_all_roles function
    try {
      const { data, error } = await supabase.rpc('get_all_roles');
      if (!error && Array.isArray(data) && data.length > 0) {
        return true;
      }
    } catch (funcErr) {
      console.log('Function get_all_roles not available', funcErr);
    }

    // Try edge function as a last resort
    try {
      const { data, error } = await supabase.functions.invoke('get_all_roles');
      if (!error && Array.isArray(data) && data.length > 0) {
        return true;
      }
    } catch (edgeFuncErr) {
      console.log('Edge function get_all_roles not available', edgeFuncErr);
    }

    // If we get here, the database is not initialized
    return false;
  } catch (err) {
    console.error('Failed to check database initialization:', err);
    return false;
  }
};
