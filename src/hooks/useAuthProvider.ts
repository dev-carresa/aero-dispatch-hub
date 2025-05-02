import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { toast } from "sonner";
import { UserRole } from '@/types/user';

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Convert Supabase User to AuthUser with role
  const mapUserData = useCallback(async (supabaseUser: User | null): Promise<AuthUser | null> => {
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
  }, []);

  // Check for existing session on load with improved timeout handling
  useEffect(() => {
    let isMounted = true;
    const AUTH_TIMEOUT = 3000; // Reduced from 5000ms to 3000ms for faster feedback
    
    const authTimeout = setTimeout(() => {
      console.log('Auth timeout reached, setting loading to false');
      if (isMounted) {
        setLoading(false);
        setAuthError('Authentication verification timeout. Please try refreshing the page.');
      }
    }, AUTH_TIMEOUT);
    
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        if (!isMounted) return;
        
        // Update auth state based on event
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setIsLoggingOut(false);
          clearTimeout(authTimeout);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          // Immediately update session state
          setSession(currentSession);
          setIsAuthenticated(!!currentSession);
          
          if (currentSession?.user) {
            try {
              const mappedUser = await mapUserData(currentSession.user);
              if (isMounted) {
                setUser(mappedUser);
                console.log("User mapped successfully:", mappedUser?.email);
                clearTimeout(authTimeout);
                setLoading(false);
              }
            } catch (err) {
              console.error("Error mapping user in auth state change:", err);
              if (isMounted) {
                setAuthError('Error retrieving user profile');
                setLoading(false);
              }
            }
          }
        }
      }
    );

    // Then check for existing session
    const checkExistingSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          setAuthError(`Session error: ${error.message}`);
          setLoading(false);
          clearTimeout(authTimeout);
          return;
        }
        
        console.log("Session check result:", currentSession ? "session exists" : "no session");
        
        if (!currentSession) {
          // No session found, clear loading state
          setIsAuthenticated(false);
          setLoading(false);
          clearTimeout(authTimeout);
          return;
        }
        
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          try {
            const mappedUser = await mapUserData(currentSession.user);
            if (isMounted) {
              setUser(mappedUser);
              console.log("User mapped successfully on init:", mappedUser?.email);
            }
          } catch (err) {
            console.error("Error mapping user on init:", err);
            if (isMounted) {
              setAuthError('Error retrieving user profile');
            }
          } finally {
            if (isMounted) {
              setLoading(false);
              clearTimeout(authTimeout);
            }
          }
        }
      } catch (err) {
        console.error("Unexpected error in session check:", err);
        if (isMounted) {
          setAuthError(`Unexpected authentication error: ${err instanceof Error ? err.message : String(err)}`);
          setLoading(false);
          clearTimeout(authTimeout);
        }
      }
    };
    
    // Start session check - use setTimeout to ensure auth state listener is set up first
    setTimeout(() => {
      if (isMounted) {
        checkExistingSession();
      }
    }, 0);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, [mapUserData]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign in attempt for:", email);
      setLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message);
        setAuthError(`Login failed: ${error.message}`);
        throw error;
      }

      if (data.user) {
        console.log("Sign in successful");
        toast.success("Connexion réussie");
        
        // We'll use location.href for navigation to ensure a full page reload
        // This helps when there might be stale state causing issues
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log("Signing out...");
    try {
      // Set logging out state to prevent flashing of default values
      setIsLoggingOut(true);
      
      // First clear local state for immediate UI response
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      // Then call Supabase API to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      toast.success("Déconnexion réussie");
      console.log("Sign out successful");
      
      // Force navigation to login page and clear any auth state
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setIsLoggingOut(false);
      setLoading(false);
    }
  };

  // Debug values
  useEffect(() => {
    console.log("Auth context state updated:", {
      isAuthenticated,
      loading,
      userExists: !!user,
      sessionExists: !!session,
      isLoggingOut,
      authError
    });
  }, [isAuthenticated, loading, user, session, isLoggingOut, authError]);

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated,
    session,
    isLoggingOut,
    authError
  };
};
