
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./types";

// Convert Supabase User to AuthUser with role
export const mapUserData = async (supabaseUser: User | null): Promise<AuthUser | null> => {
  if (!supabaseUser) return null;

  try {
    // Fetch user profile to get role
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      console.warn('No profile found for user:', supabaseUser.id);
      return null;
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: data.name || supabaseUser.email?.split('@')[0] || 'User',
      role: data.role as any
    };
  } catch (error) {
    console.error('Error mapping user data:', error);
    return null;
  }
};

// Clean up function to clear timeouts
export const cleanupTimeouts = (timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};
