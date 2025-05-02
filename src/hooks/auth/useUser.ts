
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { UserRole } from '@/types/user';
import { 
  hasStoredSession as checkStoredSession 
} from '@/services/sessionStorageService';

// Cache to store previously fetched user data to improve performance
const userProfileCache = new Map<string, AuthUser>();

// Map Supabase User to AuthUser with role - optimized for performance
export const mapUserData = async (supabaseUser: User): Promise<AuthUser | null> => {
  if (!supabaseUser) return null;
  
  try {
    // Check cache first to avoid unnecessary database calls
    if (userProfileCache.has(supabaseUser.id)) {
      return userProfileCache.get(supabaseUser.id) || null;
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
    userProfileCache.set(supabaseUser.id, userData);
    
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
    userProfileCache.set(supabaseUser.id, basicUserData);
    
    return basicUserData;
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

// Helper function to check if local storage has auth token
export const hasStoredSession = (): boolean => {
  return checkStoredSession();
};

// Clear the user profile cache (useful when logging out)
export const clearUserProfileCache = (): void => {
  userProfileCache.clear();
};
