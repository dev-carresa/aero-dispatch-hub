
import { useState, useRef, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "../types";
import { mapUserData, cleanupTimeouts } from "../utils";

export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use a ref to track if initialization is complete to prevent multiple renders
  const initialized = useRef(false);
  
  // Use a ref to track mounted state to prevent updates after unmount
  const isMounted = useRef(true);
  
  // Add a timeout ref to prevent infinite loading
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set a maximum time for initialization to prevent infinite loading (reduced to 5 seconds)
  useEffect(() => {
    // Set a maximum timeout for initialization (5 seconds)
    timeoutRef.current = setTimeout(() => {
      if (loading && isMounted.current) {
        console.warn("Auth initialization timed out - forcing completion");
        setLoading(false);
        setAuthError("Authentication initialization timed out");
      }
    }, 5000);

    return () => cleanupTimeouts(timeoutRef);
  }, []);

  // Function to force reset loading state (can be called from outside)
  const forceResetLoading = () => {
    if (isMounted.current) {
      console.log("Forcing reset of loading state");
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Clean up function to run on unmount
    return () => {
      isMounted.current = false;
      cleanupTimeouts(timeoutRef);
    };
  }, []);

  // Separate effect for auth initialization
  useEffect(() => {
    // Skip if already initialized to prevent double initialization
    if (initialized.current) return;
    
    initialized.current = true;
    console.log("Starting auth initialization");
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed:", event);
            
            if (!isMounted.current) return;
            
            // Update session state
            setSession(currentSession);
            setIsAuthenticated(!!currentSession);
            setAuthError(null);
            
            // Update user data if session exists
            if (currentSession?.user) {
              try {
                const mappedUser = await mapUserData(currentSession.user);
                if (isMounted.current) {
                  setUser(mappedUser);
                  
                  // Log role information for debugging
                  console.log("User role from profile:", mappedUser?.role);
                }
              } catch (error) {
                console.error("Error updating user data:", error);
                setAuthError("Error fetching user profile data");
              }
            } else {
              setUser(null);
            }
            
            // Always ensure loading is cleared
            setLoading(false);
          }
        );

        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMounted.current) {
          setSession(currentSession);
          setIsAuthenticated(!!currentSession);
          
          // Fetch user profile data if session exists
          if (currentSession?.user) {
            try {
              const mappedUser = await mapUserData(currentSession.user);
              if (isMounted.current) {
                setUser(mappedUser);
                
                // Log role information for debugging
                console.log("User role from profile:", mappedUser?.role);
              }
            } catch (error) {
              console.error("Error updating user data:", error);
              setAuthError("Error fetching user profile data");
              setLoading(false);
            }
          } else {
            setUser(null);
          }
          
          // Initialization complete
          setLoading(false);
          console.log("Auth initialization complete:", !!currentSession ? "Authenticated" : "Not authenticated");
        }

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted.current) {
          setLoading(false);
          setAuthError("Authentication initialization failed");
        }
      }
    };

    initializeAuth();
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated,
    authError,
    setUser,
    setSession,
    setLoading,
    setIsAuthenticated,
    forceResetLoading
  };
}
