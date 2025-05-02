
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import { useLocation } from "react-router-dom";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  session: null,
  isLoggingOut: false
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const { navigateToLogin, navigateToDashboard } = useAuthNavigation();
  
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

  // Check for existing session on load with timeout
  useEffect(() => {
    const authTimeout = setTimeout(() => {
      console.log('Auth timeout reached, setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout to prevent infinite loading
    
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        // Update auth state based on event
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setIsLoggingOut(false);
        } else {
          // Immediately update session state
          setSession(currentSession);
          setIsAuthenticated(!!currentSession);
          
          if (currentSession?.user) {
            try {
              const mappedUser = await mapUserData(currentSession.user);
              setUser(mappedUser);
              console.log("User mapped successfully:", mappedUser?.email);
            } catch (err) {
              console.error("Error mapping user in auth state change:", err);
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
        
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          clearTimeout(authTimeout);
          return;
        }
        
        console.log("Session check result:", currentSession ? "session exists" : "no session");
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          try {
            const mappedUser = await mapUserData(currentSession.user);
            setUser(mappedUser);
            console.log("User mapped successfully on init:", mappedUser?.email);
          } catch (err) {
            console.error("Error mapping user on init:", err);
          }
        }
      } catch (err) {
        console.error("Unexpected error in session check:", err);
      } finally {
        console.log("Finishing auth initialization, setting loading to false");
        setLoading(false);
        clearTimeout(authTimeout);
      }
    };
    
    checkExistingSession();

    return () => {
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, [mapUserData]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign in attempt for:", email);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message);
        throw error;
      }

      if (data.user) {
        console.log("Sign in successful");
        // Session will be updated via onAuthStateChange
        toast.success("Connexion réussie");
        navigateToDashboard();
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
      setLoading(true);
      
      // First clear local state for immediate UI response
      setUser(null);
      setIsAuthenticated(false);
      
      // Then call Supabase API to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Échec de la déconnexion: ${error.message}`);
        throw error;
      }
      
      // Clear all auth state
      setSession(null);
      
      toast.success("Déconnexion réussie");
      console.log("Sign out successful");
      
      // Navigate to login page
      navigateToLogin();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Échec de la déconnexion");
    } finally {
      setLoading(false);
      // We keep isLoggingOut true until next auth state change
    }
  };

  // Debug values
  useEffect(() => {
    console.log("Auth context state updated:", {
      isAuthenticated,
      loading,
      userExists: !!user,
      sessionExists: !!session,
      isLoggingOut
    });
  }, [isAuthenticated, loading, user, session, isLoggingOut]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut, 
      isAuthenticated, 
      session,
      isLoggingOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
