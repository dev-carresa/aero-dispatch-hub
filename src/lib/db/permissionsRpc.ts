
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
    // Use the edge function approach as our primary method
    try {
      const { data, error } = await supabase.functions.invoke('get_all_roles');
      if (!error && Array.isArray(data) && data.length > 0) {
        return true;
      }
    } catch (edgeFuncErr) {
      console.log('Edge function get_all_roles not available', edgeFuncErr);
    }
    
    // Try to query user profiles as a fallback
    // We check if profiles exist since this table definitely exists in our schema
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (!profileError && profileData) {
        // If we can query profiles, the database exists but roles system might not be initialized
        return false;
      }
    } catch (err) {
      console.error('Failed to check profiles table:', err);
    }

    // If we get here, the database might not be accessible
    return false;
  } catch (err) {
    console.error('Failed to check database initialization:', err);
    return false;
  }
};
