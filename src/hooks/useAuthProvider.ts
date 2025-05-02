
import { useState, useEffect } from 'react';
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
  
  // Map Supabase User to AuthUser with role
  const mapUserData = async (supabaseUser: User): Promise<AuthUser | null> => {
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
  };

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
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      setLoading(true);
      setAuthError(null);
      
      // Clear any previous session first to avoid conflicts
      await supabase.auth.signOut({ scope: 'local' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message);
        setAuthError(`Login failed: ${error.message}`);
        setLoading(false);
        throw error;
      }

      if (data.user) {
        console.log("Sign in successful");
        toast.success("Connexion réussie");
        
        // Set session and auth state
        setSession(data.session);
        setIsAuthenticated(true);
        
        // Map user data
        try {
          const mappedUser = await mapUserData(data.user);
          setUser(mappedUser);
        } catch (err) {
          console.error("Error mapping user after sign in:", err);
        }
        
        // Navigate to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log("Signing out...");
    try {
      setIsLoggingOut(true);
      
      // Clear local state immediately for responsive UI
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      // Explicitly clear local storage
      localStorage.removeItem('sb-qqfnokbhdzmffywksmvl-auth-token');
      
      // Call Supabase API to sign out
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all tabs/devices
      });
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      toast.success("Déconnexion réussie");
      console.log("Sign out successful");
      
      // Force navigation to login page
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setIsLoggingOut(false);
      setLoading(false);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log("Auth state updated:", {
      isAuthenticated,
      loading,
      userEmail: user?.email || 'no user',
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
