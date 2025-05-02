
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { UserRole } from '@/types/user';

// Map Supabase User to AuthUser with role
export const mapUserData = async (supabaseUser: User): Promise<AuthUser | null> => {
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

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: data?.name || supabaseUser.email?.split('@')[0] || 'User',
      role: (data?.role as UserRole) || 'Customer'
    };
  } catch (error) {
    console.error('Error mapping user data:', error);
    return null;
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
