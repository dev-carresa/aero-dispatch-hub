
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { UserRole } from '@/types/user';
import { cacheUser, getCachedUser, hasUserInCache } from './userProfileCache';

/**
 * Map Supabase User to AuthUser with role - optimized for performance
 */
export const mapUserData = async (supabaseUser: User): Promise<AuthUser | null> => {
  if (!supabaseUser) return null;
  
  try {
    // Check cache first to avoid unnecessary database calls
    if (hasUserInCache(supabaseUser.id)) {
      return getCachedUser(supabaseUser.id) || null;
    }

    // Prepare default values in case profile fetch fails
    let userData: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || 'User',
      role: 'Customer' as UserRole
    };

    // Try to fetch user profile to get role
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (!error && data) {
      // Update with profile data if available
      userData = {
        ...userData,
        name: data.name || userData.name,
        role: (data.role as UserRole) || userData.role
      };
    } else if (error) {
      console.error('Non-fatal error fetching user profile:', error);
      // Continue with default values instead of returning null
    }

    // Update cache with the new or default user data
    cacheUser(supabaseUser.id, userData);
    
    return userData;
  } catch (error) {
    console.error('Error mapping user data:', error);
    // Return basic user data instead of null to prevent authentication failures
    const basicUserData = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || 'User',
      role: 'Customer' as UserRole
    };
    
    // Even on error, update cache with basic data
    cacheUser(supabaseUser.id, basicUserData);
    
    return basicUserData;
  }
};
