
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { mapUserData, hasStoredSession, clearUserProfileCache } from './useUser';

export const useAuthListeners = (
  setUser,
  setSession,
  setIsAuthenticated,
  setLoading,
  setAuthError
) => {
  // Use refs to track initialization state and prevent duplicate processing
  const isInitializing = useRef(true);
  const pendingAuthCheck = useRef<NodeJS.Timeout | null>(null);
  
  // Set initial authentication state based on presence of token
  useEffect(() => {
    // Fast path: assume authenticated if token exists in localStorage
    const hasToken = hasStoredSession();
    
    // If token exists, assume authenticated until proven otherwise
    if (hasToken) {
      setIsAuthenticated(true);
      console.log("Found auth token in localStorage, assuming authenticated");
    }
  }, [setIsAuthenticated]);

  // Initialize auth state and set up listeners
  useEffect(() => {
    console.log("Setting up auth listeners");
    let mounted = true;
    
    // First set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Clear any pending auth checks
        if (pendingAuthCheck.current) {
          clearTimeout(pendingAuthCheck.current);
          pendingAuthCheck.current = null;
        }
        
        if (!mounted) return;
        
        // Handle sign out event immediately
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setLoading(false);
          clearUserProfileCache();
          console.log("Signed out successfully");
          return;
        }
        
        // For all other events, if we have a session, update auth state
        if (currentSession) {
          // First, update session and authentication state immediately
          setSession(currentSession);
          setIsAuthenticated(true);
          
          try {
            // Then get user data asynchronously
            const userData = await mapUserData(currentSession.user);
            if (mounted) {
              setUser(userData);
              console.log("User authenticated:", userData?.email);
            }
          } catch (err) {
            console.error("Non-fatal error fetching user data:", err);
            // Don't reset authentication state on profile fetch failure
            // Just use basic user data from the session
            if (mounted && currentSession?.user) {
              const basicUserData = {
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.email?.split('@')[0] || 'User',
                role: 'Customer'
              };
              setUser(basicUserData);
            }
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        } else if (event !== 'TOKEN_REFRESHED') {
          // No session and not just refreshing token
          if (mounted) {
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking existing session");
        
        // Get the session from Supabase
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          setAuthError(error.message);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        if (initialSession) {
          // Update session and authentication state
          setSession(initialSession);
          setIsAuthenticated(true);
          
          // Get user data
          try {
            const userData = await mapUserData(initialSession.user);
            if (mounted) {
              setUser(userData);
              console.log("Session found:", initialSession?.user.email);
            }
          } catch (err) {
            console.error("Non-fatal error processing user profile:", err);
            // Use basic user data from session instead of failing
            if (mounted && initialSession?.user) {
              const basicUserData = {
                id: initialSession.user.id,
                email: initialSession.user.email || '',
                name: initialSession.user.email?.split('@')[0] || 'User',
                role: 'Customer'
              };
              setUser(basicUserData);
            }
          }
        } else {
          console.log("No session found");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        setAuthError(`Authentication error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        if (mounted) {
          setLoading(false);
          isInitializing.current = false;
        }
      }
    };
    
    // Use a short timeout to check the session, allowing auth listener to set up first
    pendingAuthCheck.current = setTimeout(checkSession, 10);

    // Cleanup function
    return () => {
      mounted = false;
      if (pendingAuthCheck.current) {
        clearTimeout(pendingAuthCheck.current);
      }
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsAuthenticated, setLoading, setAuthError]);
};
