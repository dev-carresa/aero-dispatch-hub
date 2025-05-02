
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthUser } from '@/types/auth';

// Re-export important functions
export { mapUserData } from './userMapper';
export { clearUserProfileCache } from './userProfileCache';
export { hasStoredSession } from './sessionHelpers';

/**
 * Hook for managing user state in the application
 */
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
