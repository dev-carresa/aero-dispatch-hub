
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { UserRole } from '@/types/user';

// Map Supabase User to AuthUser with role - optimized for performance
export const mapUserData = async (supabaseUser: User): Promise<AuthUser | null> => {
  if (!supabaseUser) return null;

  try {
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
      console.error('Error fetching user profile:', error);
      // Continue with default values instead of returning null
    }

    return userData;
  } catch (error) {
    console.error('Error mapping user data:', error);
    // Return basic user data instead of null to prevent authentication failures
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || 'User',
      role: 'Customer' as UserRole
    };
  }
};

export const useUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    isAuthenticated,
    setIsAuthenticated,
    authError,
    setAuthError
  };
};
