
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
  
  // Use a ref to track if initialization is complete to prevent multiple renders
  const initialized = useRef(false);
  
  // Use a ref to track mounted state to prevent updates after unmount
  const isMounted = useRef(true);
  
  // Add a timeout ref to prevent infinite loading
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set a maximum time for initialization to prevent infinite loading
  useEffect(() => {
    // Set a maximum timeout for initialization (10 seconds)
    timeoutRef.current = setTimeout(() => {
      if (loading && isMounted.current) {
        console.warn("Auth initialization timed out - forcing completion");
        setLoading(false);
      }
    }, 10000);

    return () => cleanupTimeouts(timeoutRef);
  }, []);

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
            
            // Update user data if session exists
            if (currentSession?.user) {
              try {
                const mappedUser = await mapUserData(currentSession.user);
                if (isMounted.current) {
                  setUser(mappedUser);
                }
              } catch (error) {
                console.error("Error updating user data:", error);
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
            const mappedUser = await mapUserData(currentSession.user);
            if (isMounted.current) {
              setUser(mappedUser);
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
    setUser,
    setSession,
    setLoading,
    setIsAuthenticated
  };
}
