
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
    // Try to call a function that will exist if the permissions system is set up
    const { data, error } = await supabase.functions.invoke('get_all_roles');
    if (error) return false;
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error('Failed to check database initialization:', err);
    return false;
  }
};
