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
  // Track attempts to recover from errors
  const recoveryAttemptMade = useRef(false);
  // Add a new ref to track if we already have a valid session
  const hasValidSession = useRef(false);

  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Initializing auth provider");
    let mounted = true;
    let timeoutId = null;
    
    // Function to update auth state consistently
    const updateAuthState = async (session) => {
      if (!mounted || isProcessingAuthChange.current) return;
      
      try {
        isProcessingAuthChange.current = true;
        
        if (!session) {
          // Clear state if no session
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          console.log("No session found, cleared auth state");
          return;
        }
        
        // Mark that we have a valid session
        hasValidSession.current = true;
        
        // Otherwise set session and auth state
        setSession(session);
        setIsAuthenticated(true);
        
        // Map user data after auth state is updated, but use setTimeout to avoid deadlocks
        try {
          setTimeout(async () => {
            try {
              if (!mounted) return;
              const userData = await mapUserData(session.user);
              if (mounted) {
                setUser(userData);
                console.log("User data mapped:", userData?.email);
              }
            } catch (error) {
              console.error("Error in delayed user data processing:", error);
            }
          }, 0);
        } catch (err) {
          console.error("Error setting up user data processing:", err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          isProcessingAuthChange.current = false;
        }
      }
    };

    // Helper function to clean up invalid tokens from localStorage
    const cleanupInvalidTokens = () => {
      try {
        console.log("Cleaning up potentially invalid auth tokens");
        // Remove all Supabase-related items from localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          // Use a broader check to catch all Supabase-related items
          if (key && (key.includes('sb-') || key.includes('supabase'))) {
            localStorage.removeItem(key);
            console.log("Removed auth token:", key);
          }
        }
      } catch (err) {
        console.error("Error cleaning up tokens:", err);
      }
    };

    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        // Cancel timeout if there's already one
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        // Only handle specific auth events to avoid duplicate processing
        if (event === 'SIGNED_OUT') {
          // For sign out, immediately clear state
          if (mounted) {
            setUser(null);
            setSession(null);
            setIsAuthenticated(false);
            setLoading(false);
            hasValidSession.current = false;
            console.log("Signed out, cleared auth state");
          }
        } 
        else if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
          // For these events, update auth state - use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            await updateAuthState(currentSession);
          }, 0);
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
            
            // Clean up potentially invalid tokens if token-related error
            if (error.message.includes("Invalid") || error.message.includes("token") || error.message.includes("expired")) {
              if (!recoveryAttemptMade.current) {
                recoveryAttemptMade.current = true;
                // Clean up all Supabase tokens and reload
                cleanupInvalidTokens();
                // Don't reload immediately - this avoids an infinite loop
                setTimeout(() => {
                  if (mounted && !hasValidSession.current) {
                    console.log("Attempting recovery by page reload");
                    window.location.reload();
                  }
                }, 100);
                return;
              }
            }
            
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
          
          // Update auth state with initial session
          if (initialSession) {
            await updateAuthState(initialSession);
            hasValidSession.current = true;
          } else {
            // No session found
            setLoading(false);
            console.log("No initial session found");
          }
          
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

      // Set a failsafe timeout to ensure loading state is not stuck indefinitely
      timeoutId = setTimeout(() => {
        if (mounted && isInitializing.current) {
          console.log("Authentication check timed out, forcing loading state to false");
          setLoading(false);
          setAuthError("Vérification de l'authentification a expiré");
          isInitializing.current = false;
        }
      }, 5000); // 5 second timeout safety net

      checkSession();
    }

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [setUser, setSession, setIsAuthenticated, setLoading, setAuthError]);
};
