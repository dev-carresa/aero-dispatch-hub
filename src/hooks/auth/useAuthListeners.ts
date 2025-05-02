import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { mapUserData } from './useUser';

export const useAuthListeners = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError
) => {
  // Use a ref to track initialization state to prevent duplicate processing
  const isInitializing = useRef(true);
  // Track auth state changes to prevent duplicate processing
  const isProcessingAuthChange = useRef(false);

  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Initializing auth provider");
    let mounted = true;
    
    // Function to update auth state consistently
    const updateAuthState = async (session) => {
      if (!mounted || isProcessingAuthChange.current) return;
      
      isProcessingAuthChange.current = true;
      
      try {
        if (!session) {
          // Clear state if no session
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          console.log("No session found, cleared auth state");
          return;
        }
        
        // Otherwise set session and auth state
        setSession(session);
        setIsAuthenticated(true);
        
        // Map user data after auth state is updated
        try {
          const userData = await mapUserData(session.user);
          if (mounted) {
            setUser(userData);
            console.log("User data mapped:", userData?.email);
          }
        } catch (err) {
          console.error("Error processing user data:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          isProcessingAuthChange.current = false;
        }
      }
    };

    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        // Only handle specific auth events to avoid duplicate processing
        if (event === 'SIGNED_OUT') {
          // For sign out, immediately clear state
          if (mounted) {
            setUser(null);
            setSession(null);
            setIsAuthenticated(false);
            setLoading(false);
            console.log("Signed out, cleared auth state");
          }
        } 
        else if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
          // For these events, update auth state
          await updateAuthState(currentSession);
        }
      }
    );

    // Then check for existing session, but only if we're still initializing
    if (isInitializing.current) {
      const checkSession = async () => {
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
          
          // Update auth state with initial session
          await updateAuthState(initialSession);
          
          // Mark initialization as complete
          isInitializing.current = false;
          console.log("Initial session check complete");
        } catch (err) {
          console.error("Unexpected error in session check:", err);
          if (mounted) {
            setAuthError(`Unexpected authentication error: ${err instanceof Error ? err.message : String(err)}`);
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      };

      checkSession();
    }

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setLoading, setAuthError]);
};
