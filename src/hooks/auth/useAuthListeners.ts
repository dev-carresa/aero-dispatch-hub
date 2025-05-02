
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { mapUserData } from './useUser';

export const useAuthListeners = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError
) => {
  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Initializing auth provider");
    let mounted = true;

    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          // Clear state immediately for responsive UI
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setLoading(false);
        } 
        else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentSession?.user) {
            setSession(currentSession);
            setIsAuthenticated(true);
            
            // Map user data after small delay to prevent deadlocks
            setTimeout(async () => {
              if (mounted) {
                try {
                  const userData = await mapUserData(currentSession.user);
                  setUser(userData);
                  setLoading(false);
                } catch (err) {
                  console.error("Error processing user data:", err);
                  setLoading(false);
                }
              }
            }, 0);
          }
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          setAuthError(error.message);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        if (initialSession?.user) {
          setSession(initialSession);
          setIsAuthenticated(true);
          
          try {
            const userData = await mapUserData(initialSession.user);
            setUser(userData);
          } catch (err) {
            console.error("Error mapping user on init:", err);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setSession(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error in session check:", err);
        setAuthError(`Unexpected authentication error: ${err instanceof Error ? err.message : String(err)}`);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    // Start auth initialization after a minimal timeout
    setTimeout(() => {
      if (mounted) {
        initializeAuth();
      }
    }, 0);

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setLoading, setAuthError]);
};
