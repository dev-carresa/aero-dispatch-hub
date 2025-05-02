
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapUserData } from './userMapper';
import { clearUserProfileCache } from './userProfileCache';

export const useAuthListeners = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  refreshToken?,
  setAuthError?
) => {
  useEffect(() => {
    setLoading(true);

    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, !!newSession);

      // Handle various auth events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // When signed in or token refreshed, synchronously update the session
        // Then asynchronously fetch and update the user profile
        setSession(newSession);
        setIsAuthenticated(true);

        // Don't do async operations directly in the callback to avoid blocking
        setTimeout(async () => {
          if (newSession?.user) {
            const userData = await mapUserData(newSession.user);
            setUser(userData);
          }
          setLoading(false);
        }, 0);
      } 
      else if (event === 'SIGNED_OUT') {
        // When signed out, clear everything
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        clearUserProfileCache();
        setLoading(false);
      } 
      else {
        // For other events, just make sure loading is eventually set to false
        setLoading(false);
      }
    });

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (setAuthError) {
            setAuthError(error.message);
          }
          setLoading(false);
          return;
        }

        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          
          const userData = await mapUserData(session.user);
          setUser(userData);
        }
      } catch (error) {
        console.error("Unexpected error during session initialization:", error);
        if (setAuthError && error instanceof Error) {
          setAuthError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setLoading, refreshToken, setAuthError]);
};
