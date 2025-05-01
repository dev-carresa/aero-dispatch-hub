
import { supabase } from '@/integrations/supabase/client';

// This function creates the necessary RPC function in the database
export const createPermissionsRpcFunction = async () => {
  try {
    const { error } = await supabase.functions.invoke('init-permissions', {
      body: { action: 'create_functions' }
    });
    
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
    const { error } = await supabase.functions.invoke('init-permissions', {
      body: { action: 'seed_data' }
    });
    
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
    console.log("Checking database initialization...");
    
    // Try the new init-permissions check function first
    try {
      const { data, error } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'check_initialization' }
      });
      
      if (!error && data && data.initialized) {
        console.log("Database initialized according to init-permissions function");
        return true;
      }
    } catch (edgeFuncErr) {
      console.log('Edge function init-permissions check failed:', edgeFuncErr);
    }
    
    // Try the get_all_roles edge function as before
    try {
      const { data, error } = await supabase.functions.invoke('get_all_roles');
      if (!error && Array.isArray(data) && data.length > 0) {
        console.log("Database initialized according to get_all_roles function");
        return true;
      }
    } catch (edgeFuncErr) {
      console.log('Edge function get_all_roles check failed:', edgeFuncErr);
    }
    
    // Direct database queries as a fallback
    try {
      // Check for roles table data directly
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('id')
        .limit(1);
      
      if (!rolesError && rolesData && rolesData.length > 0) {
        console.log("Database initialized based on direct roles table check");
        return true;
      }
      
      // Check for permissions table data directly
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('id')
        .limit(1);
      
      if (!permissionsError && permissionsData && permissionsData.length > 0) {
        console.log("Database initialized based on direct permissions table check");
        return true;
      }
    } catch (dbErr) {
      console.error('Failed to check database tables directly:', dbErr);
    }
    
    // If we get here, the database might not be properly initialized
    console.log("Database initialization check result: false");
    return false;
  } catch (err) {
    console.error('Failed to check database initialization:', err);
    return false;
  }
};
