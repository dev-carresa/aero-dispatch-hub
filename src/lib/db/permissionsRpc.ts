
import { supabase } from '@/integrations/supabase/client';

// This function creates the necessary RPC function in the database
export const createPermissionsRpcFunction = async () => {
  const { error } = await supabase.rpc('create_get_user_permissions_function');
  
  if (error) {
    console.error('Error creating RPC function:', error);
    throw error;
  }
  
  return { success: true };
};

// This function migrates old role permissions to the new system
export const migrateRolePermissions = async () => {
  const { error } = await supabase.rpc('migrate_role_permissions');
  
  if (error) {
    console.error('Error migrating role permissions:', error);
    throw error;
  }
  
  return { success: true };
};

// This function seeds the initial roles and permissions
export const seedRolesAndPermissions = async () => {
  const { error } = await supabase.rpc('seed_roles_and_permissions');
  
  if (error) {
    console.error('Error seeding roles and permissions:', error);
    throw error;
  }
  
  return { success: true };
};
