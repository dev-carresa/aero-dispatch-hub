
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
    // Check if we have localStorage cache first for quick access
    if (localStorage.getItem('db_initialized') === 'true') {
      return true;
    }
    
    // Try to call the initialization check endpoint
    try {
      const { data, error } = await supabase.functions.invoke('init-permissions', {
        body: { action: 'check_initialization' }
      });
      
      if (error) {
        console.error('Error checking database initialization:', error);
        return false;
      }
      
      // Check if the database is properly initialized
      if (data && data.initialized) {
        localStorage.setItem('db_initialized', 'true');
        return true;
      }
    } catch (functionError) {
      console.error('Error with functions call:', functionError);
      // Fall through to direct table check
    }
    
    // Try a direct check of the tables as fallback
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('id, name')
        .limit(1);
        
      if (rolesError) {
        console.error('Error checking roles table:', rolesError);
        return false;
      }
      
      if (rolesData && rolesData.length > 0) {
        localStorage.setItem('db_initialized', 'true');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error in direct table check:', err);
      return false;
    }
  } catch (err) {
    console.error('Error checking database initialization:', err);
    return false;
  }
};
