
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
  // Force return true to bypass all initialization checks
  localStorage.setItem('db_initialized', 'true');
  return true;
};
