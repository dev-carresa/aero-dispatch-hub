
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  session: null
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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

    console.log('Setting up auth state listener');
    
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
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
        } else {
          setUser(null);
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
        // No need to manually update states here
        toast.success("Successfully logged in!");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log("Signing out...");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      // Clear user state regardless of API success
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success("Successfully logged out");
      console.log("Sign out successful");
      
      // Force a reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  // Debug values
  useEffect(() => {
    console.log("Auth context state updated:", {
      isAuthenticated,
      loading,
      userExists: !!user,
      sessionExists: !!session
    });
  }, [isAuthenticated, loading, user, session]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated, session }}>
      {children}
    </AuthContext.Provider>
  );
};
